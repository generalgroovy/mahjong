const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const source=require('node:fs').readFileSync(require('node:path').join(__dirname,'..','challenges.js'),'utf8');
function setup(blocked=false){
  const elements=new Map(),handlers=[];
  const node=()=>({dataset:{},children:[],classList:{add(){},contains(){return false;},toggle(){}},replaceChildren(){this.children=[];},appendChild(n){this.children.push(n);},addEventListener(k,fn){this[k]=fn;},setAttribute(k,v){this[k]=v;},focus(){this.focused=true;},click(){}});
  const qs=selector=>{if(!elements.has(selector))elements.set(selector,node());return elements.get(selector);};
  const modes=['discard','wait','value','safety','call'].map(mode=>Object.assign(node(),{dataset:{mode}}));
  const context=vm.createContext({qs,qsa:selector=>selector==='.challenge-mode'?modes:selector==='[data-practice]'?[]:[...qs('#challengeHand').children,...qs('#challengeOptions').children],document:{createElement(tag){return Object.assign(node(),{tagName:tag.toUpperCase()});}},sessionStorage:{getItem(){return null;},setItem(){if(blocked)throw Error('blocked');}}});
  vm.runInContext(source.replace('(() => {','').replace(/\}\)\(\);\s*$/,''),context);
  return {context,elements,modes,run:s=>vm.runInContext(s,context)};
}
test('all recovered drills have a reachable answer and no impossible tile counts',()=>{
  const app=setup();
  assert.equal(app.run('Object.values(CHALLENGES).flat().length'),15);
  assert.equal(app.run('Object.values(CHALLENGES).flat().every(c=>(c.options||c.hand).includes(c.answer))'),true);
  assert.equal(app.run('Object.values(CHALLENGES).flat().every(c=>(c.hand||[]).every(tile=>c.hand.filter(t=>t===tile).length<=4))'),true);
});
test('answers count once, explain the decision and move focus to the next action',()=>{
  const app=setup(true);app.run('selectPractice("wait")');
  app.run('answerChallenge("3m or 6m",qs("#challengeOptions").children[0])');
  assert.equal(app.run('challengeState.correct'),1);
  assert.match(app.elements.get('#challengeFeedback').innerHTML,/ryanmen/);
  assert.equal(app.elements.get('#challengeNext').focused,true);
  app.run('answerChallenge("wrong",qs("#challengeOptions").children[1])');
  assert.equal(app.run('challengeState.played'),1);
  app.elements.get('#challengeNext').click();
  assert.equal(app.run('challengeState.indexes.wait'),1);
  assert.match(app.elements.get('#challengeContext').textContent,/two sequences/);
  assert.equal(app.elements.get('#challengePrompt').focused,true);
});
test('topic selection preserves progress in other drills and has pressed semantics',()=>{
  const app=setup();
  app.run('challengeState.indexes.wait=2;selectPractice("wait");selectPractice("value");selectPractice("wait")');
  assert.equal(app.run('challengeState.indexes.wait'),2);
  assert.equal(app.modes.find(m=>m.dataset.mode==='wait')['aria-pressed'],'true');
  assert.equal(app.modes.find(m=>m.dataset.mode==='discard')['aria-pressed'],'false');
  app.run('selectPractice("__proto__")');
  assert.equal(app.run('challengeState.mode'),'wait');
});
