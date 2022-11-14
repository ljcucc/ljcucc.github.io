// Copyright 2022 ljcucc
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function(){
  const padding = (px)=>`padding: ${px}px`;

  const box = (str, width="auto", height="auto", style)=>`<div style="${style}">${str}</div>`;
  const link = (title, link, new_blank)=>`<a href="${link}" target="_blank">${title}</a>`;
  const img = (link, width=500, height=500, style="")=>`<img src="${link}" width="${width}" height="${height}" style="${style}"/>`
  const hint = (content)=>`<div class="hint">${content}</div>`

  const token = (t=3)=> t>0?token(t-1)+Math.random().toString(36).substr(2):"";

  var printBuffer = "";
  const print = function(str){
    printBuffer += str;
  }
  function endOfPrint(){
    const str = printBuffer;
    printBuffer = "";
    console.log(str);
    const canvas = document.querySelector("#terminal");
    canvas.innerHTML += `<div class="block">${str}</div>`;
  }
  
  const clear = ()=>{
    const canvas = document.querySelector("#terminal");
    canvas.innerHTML = '<div class="block"><div class="hint"> All contents cleared</div></div>';
  }
  const set = function( name, value ){
    console.log(this, [value])
    this.vars[name] = convertValue(value, this.vars);
    console.log("set", name, value);
  };

  const valueConvertedFunctions = {
    "joinl": (...list)=>list.slice(0,-1).join(list.slice(-1)),
    "join": (...list)=>list.slice(0,-1).join(list.slice(-1)),

    if: function(...list){
      if(list.length < 2) throw "error";
      let elseCon  = list.length%2 == 1 ? list.pop() : [];
      console.log(elseCon)
      for(;list.length > 0;){
        let con = list.shift(),
        thenAct = list.shift();

        if(convertValue(con)){
          console.log("con", con, thenAct, list)
          return convertValue(thenAct, this.vars);
        }
      }
      return convertValue(elseCon);
    },

    "+": (...list)=>list.map(Number).reduce((pre, cur)=> pre + cur),
    "-": (...list)=>list.reduce((pre, cur)=> pre - cur),
    "*": (...list)=>list.reduce((pre, cur)=> pre * cur),
    "/": (...list)=>list.reduce((pre, cur)=> pre / cur),

    print,
    clear,
    pprint: endOfPrint,
    pclear: ()=> printBuffer="",

    box,
    link,
    img,
    hint,

    // l: (...list)=>list,

    padding,


    notes: function (...notePattern) {
      var soundLoop,
      p5js = new p5(function (p) {
        p.setup = function () {
          p.noCanvas();
          let synth = new p5.MonoSynth();
          let soundLoop = new p5.SoundLoop((timeFromNow) => {
            let noteIndex = (soundLoop.iterations - 1) % notePattern.length;
            let note = p.midiToFreq(notePattern[noteIndex]);
            synth.play(note, 0.5, timeFromNow);
            // background(noteIndex * 360 / notePattern.length, 50, 100);
          },0.2);
          soundLoop.start();
        }
      });
      return {soundLoop, p5js};
    },
  }

function defun(...l){
      console.log("creating function...")
      return function(...args){
        console.log("run func start")
        let listStore = JSON.stringify(l);
        console.log(listStore)
        let list = JSON.parse(listStore);
        var childVars = Object.assign({}, this.vars);

        for(let i in Object.keys(list[0]).map(Number)){
          console.log("t1", args[i], this.vars);
          childVars[list[0][i]] = convertValue(args[i] || "",this.vars);
        }

        let result = execute(list[1].map(e=>e), childVars);
        Object.assign(childVars, this.vars);
        Object.assign(this.vars, childVars);
        return result;
      }.bind(this);
    }
    

  var nonConvertFunctions = {
    def: defun,
    defun,
    set,
  }

  // var global_variables = {};
  
  function tokenize(code){
    return code.replace(/\\\"/g, "!!ESC_STR!!").split("\"")
    .map(
      (item, index)=> index%2==1 ? 
        item.replace(/\ /g, "!!WHITESPACE!!").replace(/!!ESC_STR!!/g, "\"") :
        item.replace(/\(/g, " ( ").replace(/\)/g, " ) ").replace(/;.+/g, ""))
    .join("\"").replace(/!!ESC_STR!!/g, '\\"')
    .split(" ").map(item=>item.trim()).filter(item=>item.length > 0)
    .map(item=>item[0]=="\""?item.replace(/!!WHITESPACE!!/g, " "): item);
  }

  function parse(code) {
    var stack = [];
    for (; code.length > 0; stack.push(code.shift())) {
      // console.log(code[0], stack)
      if (code[0] == "(") {
        code.shift(); // remove (
        code.unshift(parse(code));
        continue;
      }
      if (code[0] == ")") {
        code.shift()
        return stack;
      }
    }
    return stack;
  }

  function execute(ast, vars={}) {
    console.log(ast);
    let isVal = (val)=>(val[0] == '"' || val[0] == "$" || !isNaN(val) || val instanceof Array);
    var head;

    if(isVal((head = ast.shift() || ""))){
      ast.unshift(head)
      let result = convertValues(ast, vars);
      // console.log(result);
      return result;
    }else{
      // console.log("isn't value")
    }

    // head is function name
    // console.log(head)
    if( head in valueConvertedFunctions){
      return valueConvertedFunctions[head](...execute(ast, vars));
    }else if(head in nonConvertFunctions){
      return nonConvertFunctions[head].bind({vars})(...ast);
    }else if(head in vars){
      return vars[head](...execute(ast, vars));
    }
    console.error("function not found: ", head, vars);
  }

  function convertValue(val, vars){
      if (val[0] == "\"" && val[val.length - 1] == "\"") {
        return val.slice(1, -1);
      }
      if(!isNaN(val)){
        return Number(val);
      }
      if (val[0] == "$") {
        console.log("get", val, val.slice(1), vars);
        return (vars[val.slice(1)] || "");
      }
      if(val instanceof Array){
        return (execute(val, vars));
      }

    return val;
  }

  function convertValues(arr, vars){
    var stack = [];
    for (;arr.length > 0; stack.push(arr.shift())) {
      let val = arr.shift();
      let ret = convertValue(val, vars);
      if(val != ret)
        arr.unshift(ret);
      else
        arr.unshift(val);
    }
    return stack;
  }

  let vars = {};

  async function init(){
   const tokens = tokenize(await (await fetch("./main.lisp")).text());

    execute(parse(tokens), vars);
    console.log(vars);
    endOfPrint();
  }

  window.addEventListener("load", init);


  let promptInput; 
  (promptInput = document.querySelector("#prompt>input")).addEventListener("keydown", e=>{
    if(e.ctrlKey == true){
      if(e.key == "l"){
        // promptInput.value = "";
        clear();
      }
      if (e.key == "u") {
        promptInput.value = "";
      }
      return;
    }

    if(e.key != "Enter") return;

    let code = promptInput.value;
    promptInput.value = "";

    const result = execute(parse(tokenize(`(${code})`), undefined, vars), vars);
    const printData = (p) => `(${typeof p == "array" ? printData(p) : p})`
    if(!vars["_NRTN"])
      print(hint(`returned: ${printData(result)}`))
    if(!vars["_NO"])
      endOfPrint();
  });
})();