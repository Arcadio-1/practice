console.log("hi");
const intravelId = setInterval(() => {
  console.log(`setintravel is runing`);
}, 1000);
const startScriptBnt = document.getElementById("show-script");
startScriptBnt.addEventListener("click", () => {
  clearTimeout(intravelId);
});
