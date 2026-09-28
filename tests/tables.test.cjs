const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {readFileSync}=require('node:fs');
const html=readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
function node(tag){return {tag,get textContent(){return this._text ?? this.children.map(child=>child.textContent).join('');},set textContent(value){this._text=String(value);},children:[],dataset:{},style:{},classList:{add(){}},setAttribute(k,v){this[k]=v;},addEventListener(k,v){this[k]=v;},appendChild(child){this.children=this.children.filter(x=>x!==child);this.children.push(child);},append(...children){children.forEach(child=>this.appendChild(child));},get rows(){return this.children;},get cells(){return this.children;}};}
function setup(){
  const root=node('root'),search={value:''},feedback={};
  const getTable=()=>root.children[0].children[0];
  const context=vm.createContext({document:{getElementById:()=>root,createElement:node},qs(selector,table){if(selector==='#tableSearch')return search;if(selector==='#tableFeedback')return feedback;if(selector==='.tab-panel.active table')return getTable();return table.children.find(x=>x.tag==='tbody');},qsa(selector,table){return selector==='thead th'?table.children[0].children[0].children:table.children[1].children;}});
  vm.runInContext(html.slice(html.indexOf('    function pctToNum('),html.indexOf('    function factorialRatioCombFail(')),context);
  vm.runInContext(`renderTable('test',{columns:['Score'],rows:[[10],[2]]})`,context);
  return {table:getTable(),search,feedback,run:code=>vm.runInContext(code,context)};
}
test('sortable headers use native buttons and report ascending/descending state',()=>{
  const app=setup(),header=app.table.children[0].children[0].children[0],button=header.children[0];
  assert.equal(button.tag,'button');
  assert.equal(button['aria-label'],'Sort by Score');
  button.click();
  assert.equal(header['aria-sort'],'ascending');
  assert.deepEqual(app.table.children[1].rows.map(row=>row.cells[0].textContent),['2','10']);
  button.click();
  assert.equal(header['aria-sort'],'descending');
});
test('empty filtered tables explain recovery and clear their message after reset',()=>{
  const app=setup();
  app.table.children[1].rows.forEach(row=>row.textContent=String(row.cells[0].textContent));
  app.search.value='missing';app.run('filterActiveTable()');
  assert.match(app.feedback.textContent,/No matching rows/);
  assert.ok(app.table.children[1].rows.every(row=>row.style.display==='none'));
  app.search.value='';app.run('filterActiveTable()');
  assert.equal(app.feedback.textContent,'');
  assert.ok(app.table.children[1].rows.every(row=>row.style.display===''));
});
