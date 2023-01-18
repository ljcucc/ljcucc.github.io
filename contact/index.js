const URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeVpspjCzkVe-3qGlN75SP6ifsnk1eGQOKLz7S116XMow0f4w/formResponse";

(()=>{
  let form = document.querySelector("form");

  form.addEventListener("submit", e=>{
//https://docs.google.com/forms/u/0/d/e/1FAIpQLSeVpspjCzkVe-3qGlN75SP6ifsnk1eGQOKLz7S116XMow0f4w/formResponse
    e.preventDefault();

    let formData = new FormData(form);
    console.log(new URLSearchParams(formData).toString());
    fetch(URL+`?${new URLSearchParams(formData).toString()}`, {
      body: formData,
      method: "post",
      mode: 'no-cors',
      redirect: 'follow', 
      referrer: 'no-referrer',
    }).then(() => {
      document.body.classList.add("hide");
      setTimeout(() => form.style.display = "invisible", 500);
    });

  });
})();