window.addEventListener("load", load);

function load(){
  let bg = document.querySelector(".background");
  let scrollable = document.querySelector(".scrollable");

  function backgroundUpdate(){
    let progress = Math.min(scrollable.scrollHeight - scrollable.clientHeight, Math.max(scrollable.scrollTop,0)) / (scrollable.scrollHeight - scrollable.clientHeight);
    bg.style.setProperty("--pt", `${progress*window.innerWidth}pt`);
    if(window.innerWidth > window.innerHeight){
      bg.style.setProperty("--width", `${Math.abs(window.innerWidth - window.innerHeight) * (progress)}px`);
      bg.style.setProperty("--height", `${Math.abs(window.innerWidth - window.innerHeight) * (progress) * 0.4}px`);
    }else{
      bg.style.setProperty("--width", `${Math.abs(window.innerWidth - window.innerHeight) * (progress) * 0.4}px`);
      bg.style.setProperty("--height", `${Math.abs(window.innerWidth - window.innerHeight) * (progress)}px`);
      // bg.style.setProperty("--height", `0px`);
    }
  }

  // function pointerUpdate(e){
  //   console.log({x: e.screenX, y: e.screenY});
  // }

  window.addEventListener("resize", backgroundUpdate);
  scrollable.addEventListener("scroll", backgroundUpdate);

  // window.addEventListener("mousemove", pointerUpdate);

  backgroundUpdate();
}