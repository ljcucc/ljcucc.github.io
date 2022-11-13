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

  const print = function(str){
    console.log(str);
    const canvas = document.querySelector("#terminal");
    canvas.innerHTML += `<div class="block">${str}</div>`;
  }
  const clear = ()=>{
    const canvas = document.querySelector("#terminal");
    canvas.innerHTML = '<div class="hint">All contents cleared</div>';
  }
  const set = function( name, value ){
    console.log(this, [value])
    this.vars[name] = convertValue(value, this.vars);
    console.log("set", name, value);
  };

  const valueConvertedFunctions = {
    "joinl": (...list)=>list.slice(0,-1).join(list.slice(-1)),
    "join": (...list)=>list.slice(0,-1).join(list.slice(-1)),

    print,
    clear,

    box,
    link,
    img,
    hint,

    // l: (...list)=>list,

    padding,
  }

  var nonConvertFunctions = {
    def: function(...l){
      console.log("creating function...")
      return function(...args){
        let listStore = JSON.stringify(l);
        console.log(listStore)
        let list = JSON.parse(listStore);
        var childVars = Object.assign({}, this.vars);
        execute(list[1].map(e=>e), childVars);
        Object.assign(childVars, this.vars);
        Object.assign(this.vars, childVars);
      }.bind(this);
    },
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
      console.log(result);
      return result;
    }else{
      console.log("isn't value")
    }

    // head is function name
    console.log(head)
    if( head in valueConvertedFunctions){
      return valueConvertedFunctions[head](...execute(ast, vars));
    }else if(head in nonConvertFunctions){
      return nonConvertFunctions[head].bind({vars})(...ast);
    }else if(head in vars){
      return vars[head](...execute(ast));
    }
    console.error("function not found");
  }

  function convertValue(val, vars){
      if (val[0] == "\"" && val[val.length - 1] == "\"") {
        return val.slice(1, -1);
      }
      if(!isNaN(val)){
        return (val);
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
      if(val != ret){
        arr.unshift(ret);
      }
    }
    return stack;
  }

  let vars = {};

  function init(){
   const tokens = tokenize(`

    ( set title "ljcucc" )

    ( set iconStyle "border-radius: 100%;")
    ( set iconSize 200)

    ( set webNL "<br>")

    (set version (def () (print "version: wolf_lisp v0.1.0")))

    (set help (def () (
      (print (joinl 
        "<div>"
        "[ helper ]"
        ""
        "\\"Wolf interactive terminal\\""
        "is a terminal powered by custom scripting language which simular to lisp syntax."
        ""
        "functions/commands:"
        ""
        "* ( intro ) - reprint intro"
        "* ( clear ) - clear screen"
        "* ( print ) - append HTML strings to terminal"
        "* ( hint ) - generate hint HTML string"
        "* ( img ) - generate img tag HTML string"
        "* ( join (*list) *string ) - add string between items"
        "* ( joinl ...*list *string ) - inline version of (join) "
        "* ( set name value ) - set scoped variable"
        "* ( reload ) - reload page"
        "* ( help ) - diplay help"
        "* ( version ) - display version"
        ""
        "shortcuts: (keyboard only)"
        ""
        "* Ctrl+L - Clear screen"
        "</div>"
        $webNL
      )) ; print joinl
    )))

    ( set intro 
      (def () (
      
        (print "<strong>IT. Wolf</strong>")

    (print 
      (img "./icon.png" $iconSize $iconSize $iconStyle))

    (print (joinl
      (link "Twitter" "https://github.com/ljcucc")
      (link "Wiki" "https://wiki.ljcu.cc")
      (link "Github" "https://github.com/ljcucc")
      (link "Unsplash" "https://unsplash.com/@ljcucc")
      "<div style=\\"height:4px;\\"></div>"
      ))
    (print (hint "hint: type \\"help\\" to get all commands."))

      ))
    ) ;set

    (intro)

    `);

    execute(parse(tokens), vars);
    console.log(vars)

  }

  window.addEventListener("load", init);


  let promptInput; 
  (promptInput = document.querySelector("#prompt>input")).addEventListener("keydown", e=>{
    if(e.ctrlKey == true && e.key == "l"){
      promptInput.value = "";
      clear();
      return;
    }

    if(e.key != "Enter") return;

    let code = promptInput.value;
    promptInput.value = "";

    const { params } = execute(parse(tokenize(`(${code})`), undefined, vars), vars);
    const printData = (p) => `(${typeof p == "array" ? printData(p) : p})`
    print(hint(`returned: ${printData(params)}`))
  });
})();