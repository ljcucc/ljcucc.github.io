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

  function init(){
   const tokens = tokenize(`

    ( set title "ljcucc" )

    ( set iconStyle "border-radius: 100%;")
    ( set iconSize 200)

    ( set webNL "<br>")

    ( set blod 
      (def (content) (joinl "<strong>" $content "</strong>" ""))
    )

    ( set div 
      (def (body) (joinl "<div>" $body "</div>" ""))
    )

    (set version (def () (print "version: wolf_lisp v0.1.0")))

    (set help (def () (
      (set li (def (cont) (joinl "<li>" $cont "</li>" "")))
      (set ul (def (cont) (joinl "<ul>" $cont "</ul>" "")))
      (print (joinl 
        "<div>"
        "[ helper ]"
        ""
        "\\"Wolf interactive terminal\\""
        "is a terminal powered by custom scripting language which simular to lisp syntax."
        ""
        "functions/commands:"
        ""
        (ul
          (joinl (li "( intro ) - print intro")
          (li "( clear ) - clear screen" )
          (li "( print ) - append HTML strings to terminal" )
          (li "( hint ) - generate hint HTML string" )
          (li "( img ) - generate img tag HTML string" )
          (li "( join (*list) *string ) - add string between items" )
          (li "( joinl ...*list *string ) - inline version of (join) " )
          (li "( set name value ) - set scoped variable" )
          (li "( if ...*con_or_then *else) - value in (then) will be returned. etc. (if con (then)) (if con (then) (else)) (if con (then) con (then) ... *(else is optinoal)) " )
          (li "( def (...args) (todo)) - define a function object, will return a function object")
          (li "( help ) - diplay help" )
          (li "( version ) - display version" ) "" )
        )
        ""
        "shortcuts: (keyboard only)"
        ""
        (ul (joinl 
          (li "Ctrl+L - Clear screen")
          (li "Ctrl+U - Clear line")
        ""))
        "</div>"
        $webNL
      )) ; print joinl
    )))

    ( set intro 
      (def () (
        (set limitedBox (def ( width height content) (joinl "<div style=\\"max-width:" $width ";height:" $height ";box-sizing:border-box;\\">" $content "</div>" "")))
        (print 
          ( div (joinl
            (div (joinl 
              (blod "@ljcucc") " = " (blod "l") "injason + "(blod "j") "ason + cucc" "")
            )

            ""
            (limitedBox "1000px" "auto" "Hi, I'm <stron>IT. Wolf</strong> welcome to my home site. here's some of my linktree or just look around... feel free to typing some commands under the page ;)" )
            "<br>"
          )))

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
    print(hint(`returned: ${printData(result)}`))
  });
})();