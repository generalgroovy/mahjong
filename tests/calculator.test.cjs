const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {readFileSync}=require('node:fs');
const html=readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
function setup(){const elements=new Map();const qs=id=>{if(!elements.has(id))elements.set(id,{value:0,appendChild(){},addEventListener(k,f){this[k]=f;}});return elements.get(id);};const context=vm.createContext({qs,localStorage:{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},document:{documentElement:{dataset:{}},createElement:()=>({})}});vm.runInContext(html.slice(html.indexOf('    function factorialRatioCombFail'),html.indexOf('    function calcEv')),context);vm.runInContext(html.slice(html.indexOf('    function initTheme'),html.indexOf('    function init()')),context);return {qs,context,run:code=>vm.runInContext(code,context)};}
test('exact without-replacement probability for small enumerable wall',()=>{const app=setup();assert.ok(Math.abs(app.run('hitProbability(4,1,2)')-.5)<1e-12);assert.equal(app.run('hitProbability(4,0,2)'),0);assert.equal(app.run('hitProbability(4,4,1)'),1);});
test('impossible tile counts show input guidance rather than misleading probability',()=>{const app=setup();for(const [n,u,d] of [[4,5,1],[4,1,5],[4,1,1.5],[0,0,0]]){app.qs('#liveTiles').value=n;app.qs('#outs').value=u;app.qs('#draws').value=d;app.run('calcUkeire()');assert.equal(app.qs('#ukeireResult').textContent,'—');}});
test('theme remains usable when storage is blocked',()=>{const app=setup();app.run('initTheme()');app.qs('#themeToggle').click();assert.equal(app.context.document.documentElement.dataset.theme,'dark');});
