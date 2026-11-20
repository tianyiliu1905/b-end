#!/usr/bin/env python3
"""Read-only audit by default; record accepts a human/agent semantic review, not a version bump."""
import argparse
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]

def digest(data):
    return hashlib.sha256(data).hexdigest()

def read_json(path, default=None):
    return json.loads(path.read_text()) if path.exists() else default

def repo_root(value):
    candidates = [Path(value).resolve()] if value else [Path.cwd(), *Path.cwd().parents, SKILL.parents[1]]
    for p in candidates:
        if (p/'b-end-page/SKILL.md').exists() and (p/'b-end-showcase/src/App.tsx').exists():
            return p
    raise ValueError('Repository not found. Pass --repo with the directory containing both b-end-page and b-end-showcase.')

def resolve_import(root, parent, target):
    target = target.split('?')[0]
    base = parent.parent/target
    for p in [base, *[Path(str(base)+e) for e in ('.tsx','.ts','.jsx','.js','.css','.json')], base/'index.tsx', base/'index.ts']:
        if p.is_file() and p.resolve().is_relative_to(root):
            return p.relative_to(root).as_posix()
    return None

def closure(root, files):
    seen = set()
    todo = list(files)
    while todo:
        rel = todo.pop()
        if rel in seen:
            continue
        seen.add(rel)
        p = root/rel
        if not p.is_file() or p.suffix not in ('.tsx','.ts','.jsx','.js','.css'):
            continue
        source = p.read_text()
        for target in re.findall(r'''(?:from\s*|import\s*\(?\s*)['"](\.[^'"]+)['"]''', source):
            dep = resolve_import(root, p, target)
            if dep:
                todo.append(dep)
    return seen

def scope_files(root, scopes, scope, visited=None):
    visited = set() if visited is None else visited
    if scope in visited:
        return set()
    if scope not in scopes:
        raise ValueError(f'Unknown dependency scope: {scope}')
    visited.add(scope)
    entry = scopes[scope]
    files = closure(root, entry['showcase']) | set(entry['knowledge'])
    for dep in entry.get('depends_on', []):
        files |= scope_files(root, scopes, dep, visited)
    return files

def hashes(root, files):
    return {p: digest((root/p).read_bytes()) if (root/p).is_file() else None for p in sorted(files)}

def dependency_scopes(scopes, key):
    result = {key}
    for dep in scopes[key].get('depends_on', []):
        result |= dependency_scopes(scopes, dep)
    return result

def audit(root, wanted=None):
    mapping = read_json(SKILL/'references/file-map.json')
    scopes = mapping['scopes']
    selected = [wanted] if wanted else list(scopes)
    if wanted and wanted not in scopes:
        raise ValueError(f'Unknown scope {wanted}')
    result = subprocess.run(['node', str(SKILL/'scripts/inventory.cjs'), str(root)], capture_output=True, text=True)
    if result.returncode:
        raise ValueError('Static inventory failed (install showcase dependencies or update parser): '+result.stderr[-1500:])
    inventory = json.loads(result.stdout)
    catalog = {m['id']:m for m in inventory['catalog']}
    global_issues = []
    for id in catalog:
        if id not in scopes:
            global_issues.append(f'Unmapped catalog module: {id}')
    for route in inventory['routes']:
        if route['route'].split('/')[1] in ('dashboard','list','form','detail','examples') and 'page:'+route['route'] not in scopes:
            global_issues.append('Unmapped page route: '+route['route'])
    # Verify the current page route still renders the mapped entry, including .jsx wrappers.
    for key, entry in scopes.items():
        if entry['kind'] != 'page':
            continue
        actual = next((r for r in inventory['routes'] if r['route'] == entry['routes'][0]), None)
        if not actual:
            global_issues.append('Mapped route was removed: '+key)
            continue
        for comp in actual['components']:
            if comp.startswith('./pages/'):
                rel = resolve_import(root, root/'b-end-showcase/src/App.tsx', comp)
                if rel not in entry['showcase']:
                    global_issues.append(f'Route entry changed; update map: {key} → {rel}')
    issues = read_json(root/'.sync/known-issues.json', [])
    baseline = read_json(root/'.sync/baseline.json', {'files':{}})
    reviews = read_json(root/'.sync/reviews.json', {})
    output = {'schema_version':1, 'repo':str(root), 'global_issues':global_issues, 'scope_count':len(scopes), 'catalog_count':len(catalog), 'results':[]}
    for key in selected:
        entry = scopes[key]
        files = hashes(root, scope_files(root, scopes, key))
        blockers = [f'Missing file: {p}' for p,v in files.items() if v is None]
        deps = dependency_scopes(scopes, key)
        for dep in deps:
            d = scopes[dep]
            if d['kind'] == 'module':
                if dep not in catalog:
                    blockers.append(f'Missing catalog entry: {dep}')
                if dep not in inventory['previews']:
                    blockers.append(f'Missing preview registration: {dep}')
                if not any(s == dep or s.startswith(dep+' ') for s in inventory['spec_keys']):
                    blockers.append(f'Missing canonical Design Spec key: {dep}; legacy aliases do not prove equivalence')
        blockers += [f"{x['scope']}: {x['finding']}" for x in issues if x['scope'] in deps and x['status'] == 'open']
        # Include mapping and open-issue content so a mapping edit invalidates prior attestations.
        fingerprint = digest(json.dumps({'files':files,'mapping':{d:scopes[d] for d in sorted(deps)},'issues':[i for i in issues if i['scope'] in deps]},sort_keys=True,ensure_ascii=False).encode())
        review = reviews.get(key)
        evidence_valid = bool(review and (root/review['evidence']).is_file() and digest((root/review['evidence']).read_bytes()) == review['evidence_sha256'])
        status = 'blocked' if blockers or global_issues else 'unreviewed'
        if status != 'blocked' and review:
            status = 'verified' if review['fingerprint'] == fingerprint and evidence_valid else 'stale'
        changed = [p for p,v in files.items() if baseline['files'].get(p) != v]
        output['results'].append({'scope':key,'kind':entry['kind'],'status':status,'fingerprint':fingerprint,'blockers':sorted(set(blockers)),'changed_since_baseline':changed,'files':files})
    output['consistent'] = not global_issues and all(r['status']=='verified' for r in output['results'])
    return output

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('command', choices=['audit','record'])
    p.add_argument('--repo')
    p.add_argument('--scope', help='Module ID, page:/route, theme, shell, or D-ChartCard; omit for all')
    p.add_argument('--json', action='store_true')
    p.add_argument('--evidence', help='Repository-relative JSON review evidence (record only)')
    args = p.parse_args()
    root = repo_root(args.repo)
    report = audit(root,args.scope)
    if args.command == 'record':
        if not args.scope or not args.evidence:
            raise ValueError('record requires --scope and --evidence; no blanket certification')
        result = report['results'][0]
        if result['blockers'] or report['global_issues']:
            raise ValueError('Cannot attest while blockers remain: '+str(result['blockers']+report['global_issues']))
        evidence_path = (root/args.evidence).resolve()
        if not evidence_path.is_relative_to(root):
            raise ValueError('Evidence must live in the repository')
        e = read_json(evidence_path)
        checks = ['identity','variants','visual_tokens','behavior','copy_spec','validation']
        if not e or e.get('scope') != args.scope or e.get('fingerprint') != result['fingerprint'] or not e.get('reviewer') or not e.get('summary') or any(not isinstance(e.get('checks',{}).get(k),str) or not e['checks'][k].strip() for k in checks):
            raise ValueError('Evidence must include current scope/fingerprint, reviewer, summary, and nonempty evidence for six checks')
        reviews = read_json(root/'.sync/reviews.json',{})
        reviews[args.scope] = {'fingerprint':result['fingerprint'],'reviewed_at':datetime.now(timezone.utc).isoformat(),'evidence':evidence_path.relative_to(root).as_posix(),'evidence_sha256':digest(evidence_path.read_bytes())}
        (root/'.sync').mkdir(exist_ok=True)
        (root/'.sync/reviews.json').write_text(json.dumps(reviews,ensure_ascii=False,indent=2)+'\n')
        report = audit(root,args.scope)
    if args.json:
        print(json.dumps(report,ensure_ascii=False,indent=2))
    else:
        print('CONSISTENT' if report['consistent'] else 'NOT VERIFIED AS CONSISTENT')
        for issue in report['global_issues']:
            print('GLOBAL:',issue)
        for r in report['results']:
            print(f"{r['scope']}: {r['status']} | revision {r['fingerprint'][:12]} | changed files {len(r['changed_since_baseline'])}")
            for issue in r['blockers']:
                print('  -',issue)
        print('Hash equality records unchanged content, not semantic equivalence. Exit 1 means blocked, stale, or unreviewed.')
    return 0 if report['consistent'] else 1

if __name__ == '__main__':
    try:
        sys.exit(main())
    except (ValueError,OSError,KeyError,TypeError) as e:
        print('ERROR:',e,file=sys.stderr)
        sys.exit(2)
