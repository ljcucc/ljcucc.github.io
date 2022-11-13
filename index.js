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
  const link = (title, link, new_blank)=>`<a href="${link}" ${new_blank? 'target="_blank"' : ""}>${title}</a>`;
  const img = (link, width=500, height=500, style="")=>`<img src="${link}" width="${width}" height="${height}" style="${style}"/> <div class="hint">${link}</div>`
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
    console.log(this)
    this.global_variables[name] = value;
    console.log("set", name, value);
  };

  const native_func_call = {
    "joinl": (...list)=>list.slice(0,-1).join(list.slice(-1)),
    "join": (...list)=>list.slice(0,-1).join(list.slice(-1)),

    print,
    clear,

    box,
    link,
    img,
    hint,

    l: (...list)=>list,

    set,

    padding,
  }

  var intergate_func_call = {
    def: function(...list){
      console.log("creating function...")
      return function(...args){
        print(list)
      }
    }
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

  async function parse(code, index=0, global_variables={}, intergrate_call=false) {
    let param_count = 0;

    var func_call = native_func_call.l;
    var params = [];

    for (; index < code.length; index++, param_count++) {
      let cur = code[index];

      // console.log(cur, index);
      if (cur == "(") {
        var { index, value } = await parse(code, index + 1, global_variables, intergrate_call);
        // console.log("returned", index, value, "to", func_name);
        params.push(value);
        continue;
      } 

      if (cur == ")") {
        // console.log("calling", func_name, params);
        // console.log(func_call.bind({x: 10}));
        return {
          index: index,
          value: func_call.bind({
            global_variables
          })(...params)
        };
      }

      if (param_count == 0 && !is_val(cur) && !intergrate_call) {
        let func_name = cur;
        
        var {func_call, intergrate_call} = func_execution(func_name, native_func_call, intergate_func_call, global_variables);

        continue;
      } else if(param_count == 0){
        global_variables = Object.assign({}, global_variables);
      }
      
      params.push(con_value(cur, global_variables));
      console.log(param_count, cur);
    }

    return intergrate_call?params:{index: index+1, value: null, params, global_variables};
  }

  function func_execution(func_name, native_func_call, intergate_func_call, global_variables) {
    let func_call, intergrate_call;
    if (func_name in native_func_call) {
      func_call = native_func_call[func_name];
    }
    else if (func_name in intergate_func_call) {
      func_call = intergate_func_call[func_name];
      intergrate_call = true
    } else if (func_name in global_variables) {
      func_call = global_variables[func_name];
      console.log("var func")
    }
    return {func_call, intergrate_call};
  }

  function is_val(val){
    return (val[0] == '"' || val[0] == "$" || !isNaN(val));
  }

  function con_value(val, global_variables){
    console.log("con_val", val);
    if(val[0] == "\"" && val[val.length-1] == "\""){
      return val.slice(1, -1);
    }

    if(val[0] == "$"){
      console.log("get", val, val.slice(1));
      return global_variables[val.slice(1)] || "";
    }

    if(!isNaN(val)){
      return Number(val);
    }

    return val;
  }

  let vars = {};

  function init(){
    parse(tokenize(`

    ( set title "ljcucc" )

    ( set iconStyle "border-radius: 100%;")
    ( set iconSize 200)

    ( set hello 
      (def () 
        (print "hello world")) ;def
    ) ;set

    (print 
      (img "./icon.png" $iconSize $iconSize $iconStyle))
    (print (joinl
      (link "Twitter" "https://github.com/ljcucc" 1)
      (link "Fedi (misskey)" "https://social.ljcu.cc" 1)
      (link "Wiki" "https://wiki.ljcu.cc" 1)
      (link "Github" "https://github.com/ljcucc" 1)
      (link "Unsplash" "https://unsplash.com/@ljcucc")
      "<div style=\\"height:4px;\\"></div>"
      ))
    (print (hint "hint: type \"help\" to get all command, type \"tutor\" to enter tutorial."))
    `, undefined, vars)).then(e => {
      let { global_variables } = e;
      vars = global_variables
      console.log(vars);
    });

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

    parse(tokenize(`(${code})`), undefined, vars).then((e)=>{
      const {params} = e;
      const printData = (p)=>`(${typeof p == "array"?printData(p):p})`
      print(hint(`returned: ${printData(params)}`))
    });
  });
})();