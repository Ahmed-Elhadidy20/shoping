window.addEventListener ("scroll", () =>{
if(window.scrollY > 100) {
    head.classList.add ("fixed")
  
}
else {
    head.classList.remove("fixed")
}
})