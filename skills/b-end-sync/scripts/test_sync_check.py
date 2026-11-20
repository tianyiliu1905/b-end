#!/usr/bin/env python3
"""Integration checks in a disposable copy; never attest the real repository."""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

source = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
with tempfile.TemporaryDirectory(prefix='b-end-sync-test-') as folder:
    repo = Path(folder)
    for name in ['b-end-page','b-end-showcase/src','skills/b-end-sync','.sync']:
        shutil.copytree(source/name,repo/name,ignore=shutil.ignore_patterns('__pycache__'))
    for name in ['package.json','package-lock.json']:
        shutil.copy2(source/'b-end-showcase'/name,repo/'b-end-showcase'/name)
    (repo/'b-end-showcase/node_modules').symlink_to(source/'b-end-showcase/node_modules',target_is_directory=True)
    script = repo/'skills/b-end-sync/scripts/sync_check.py'
    def run(command='audit',scope='Form9',extra=()):
        result = subprocess.run([sys.executable,str(script),command,'--repo',str(repo),'--scope',scope,'--json',*extra],capture_output=True,text=True)
        return result, json.loads(result.stdout) if result.stdout else None
    def status(expected):
        r,j=run();assert j['results'][0]['status']==expected,(r.stdout,r.stderr);return j['results'][0]
    initial=status('unreviewed')
    evidence=repo/'.sync/evidence/test.json';evidence.parent.mkdir(exist_ok=True)
    e={'scope':'Form9','fingerprint':initial['fingerprint'],'reviewer':'isolated automated fixture','summary':'TEST ONLY, not a real semantic review','checks':{k:'Synthetic test evidence in disposable repository' for k in ['identity','variants','visual_tokens','behavior','copy_spec','validation']}}
    evidence.write_text(json.dumps(e))
    r,j=run('record',extra=('--evidence','.sync/evidence/test.json'));assert r.returncode==0,r.stderr
    status('verified')
    css=repo/'b-end-showcase/src/components/TagGroupEditorPreview.css';original=css.read_text();css.write_text(original+'\n/* test drift */\n')
    status('stale');css.write_text(original);status('verified')
    evidence.write_text(json.dumps(e)+' ');status('stale');evidence.write_text(json.dumps(e));status('verified')
    knowledge=repo/'b-end-page/references/L2-modules/Form9-tag-group-editor.md';original_knowledge=knowledge.read_bytes();knowledge.unlink();status('blocked');knowledge.write_bytes(original_knowledge)
    catalog=repo/'b-end-showcase/src/data/l2Modules.ts';original_catalog=catalog.read_text();catalog.write_text(original_catalog.replace('export const L2_MODULES: L2Module[] = [',"export const L2_MODULES: L2Module[] = [\n{id:'Form99',name:'test',category:'test',description:'test'},"))
    r,j=run();assert any('Unmapped catalog module: Form99' in x for x in j['global_issues']);catalog.write_text(original_catalog)
    app=repo/'b-end-showcase/src/App.tsx';original_app=app.read_text();app.write_text(original_app.replace('<Route path="/form/basic" element={<DealFormPage />} />','<Route path="/form/basic" element={<ModalFormPage />} />'))
    r,j=run();assert any('Route entry changed' in x for x in j['global_issues']);app.write_text(original_app)
    r,j=run('record',scope='W-4',extra=('--evidence','.sync/evidence/test.json'));assert r.returncode==2 and 'Cannot attest' in r.stderr
    status('verified')
    print('PASS: unreviewed → verified; CSS drift; evidence tampering; deleted knowledge; new unmapped module; changed route entry; blocked attestation. Real repository unchanged.')
