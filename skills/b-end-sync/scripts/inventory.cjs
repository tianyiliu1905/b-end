// Read TypeScript syntax without executing application code.
const fs = require('fs'), path = require('path');
const root = path.resolve(process.argv[2] || '.');
const ts = require(path.join(root, 'b-end-showcase/node_modules/typescript'));
function parse(rel) { return ts.createSourceFile(rel, fs.readFileSync(path.join(root, rel), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX); }
function variable(file, name) {
  let found;
  function visit(n) { if (ts.isVariableDeclaration(n) && n.name.getText(file) === name) found = n.initializer; ts.forEachChild(n, visit); }
  visit(file); if (!found) throw new Error(`Missing variable ${name}`); return found;
}
function literal(n) {
  if (!n) return null;
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
  if (ts.isArrayLiteralExpression(n)) return n.elements.map(literal);
  if (ts.isObjectLiteralExpression(n)) return Object.fromEntries(n.properties.filter(ts.isPropertyAssignment).map(p => [p.name.text || p.name.getText(), literal(p.initializer)]));
  return null;
}
function keys(file, name) { const n = variable(file, name); if (!ts.isObjectLiteralExpression(n)) throw new Error(`${name} is no longer a literal object; update inventory parser`); return n.properties.filter(ts.isPropertyAssignment).map(p => p.name.text || p.name.getText(file)); }
const catalog = literal(variable(parse('b-end-showcase/src/data/l2Modules.ts'), 'L2_MODULES'));
if (!Array.isArray(catalog) || catalog.some(m => !m?.id)) throw new Error('Catalog structure unsupported');
const previews = parse('b-end-showcase/src/components/modulePreviews.tsx');
const app = parse('b-end-showcase/src/App.tsx'), imports = {};
for (const n of app.statements) if(ts.isImportDeclaration(n) && n.importClause?.name) imports[n.importClause.name.text] = n.moduleSpecifier.text;
const routes = [];
function visit(n) {
  if ((ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) && n.tagName.getText(app) === 'Route') {
    const attr = n.attributes.properties.find(a => a.name?.text === 'path');
    const route = attr?.initializer?.text;
    if (route) {
      const element = n.attributes.properties.find(a => a.name?.text === 'element');
      const components = [];
      function collect(e) { if ((ts.isJsxSelfClosingElement(e) || ts.isJsxOpeningElement(e)) && imports[e.tagName.getText(app)]) components.push(imports[e.tagName.getText(app)]); ts.forEachChild(e, collect); }
      if(element) collect(element);
      routes.push({route, components});
    }
  }
  ts.forEachChild(n, visit);
}
visit(app);
console.log(JSON.stringify({catalog, previews: [...new Set(['modulePreviews','modulePreviewVariants','modulePreviewSubGroups'].flatMap(n=>keys(previews,n)))], spec_keys:keys(parse('b-end-showcase/src/data/designSpecs.ts'),'designSpecs'), routes}, null, 2));
