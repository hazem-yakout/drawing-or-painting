const canvas = document.querySelector("canvas");
const toolbtns = document.querySelectorAll(".tool");
const fill = document.querySelector("#fill-color");
const size = document.querySelector("#size-slider");
const color = document.querySelectorAll(".colors .option");
const colorpicker = document.querySelector("#color-picker");
const clear = document.querySelector(".clear-canvas");
const save = document.querySelector(".save-img");
const ctx = canvas.getContext("2d");
let isdraw = false;
let prevmousex;
let prevmousey;
let brushwidth = 5;
let selectedcolor = "#000";
let selectedtool = "brush";
const setbackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillstyle = selectedcolor; // setting fillstyle to selectedcolor , it will be the brush color
};
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setbackground();
});
const drawrect = (e) => {
  if (!fill.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevmousex - e.offsetX,
      prevmousey - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevmousex - e.offsetX,
    prevmousey - e.offsetY
  );
};
const drawcircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevmousex - e.offsetX, 2) + Math.pow(prevmousey - e.offsetY, 2) // getting radius of the circle
  );
  ctx.arc(prevmousex, prevmousey, radius, 0, 2 * Math.PI);
  fill.checked ? ctx.fill() : ctx.stroke();
};
const drawtri = (e) => {
  ctx.beginPath(); //create new path
  ctx.moveTo(prevmousex, prevmousey); //move triangle to mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); // create first line acc to mouse pointer
  ctx.lineTo(prevmousex * 2 - e.offsetX, e.offsetY); // create bottom line of triangle
  ctx.closePath();
  fill.checked ? ctx.fill() : ctx.stroke();
};
const startdraw = (e) => {
  isdraw = true;
  prevmousex = e.offsetX; //current mousex pos as prevmousex pos
  prevmousey = e.offsetY; //current mousey pos as prevmousey pos
  ctx.beginPath(); //create new path to draw
  ctx.lineWidth = brushwidth; //pathing brushwidth is line width
  ctx.fillStyle = selectedcolor; // pass selectedcolor as stroke style
  ctx.strokeStyle = selectedcolor; // pass selectedcolor as stroke style
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); // copying data & pass it as snapshot value.. this avoids dragging image
};
const drawing = (e) => {
  if (!isdraw) return;
  ctx.putImageData(snapshot, 0, 0); // adding copied canvas data
  if (selectedtool === "brush" || selectedtool === "eraser") {
    ctx.strokeStyle = selectedtool === "eraser" ? "#fff" : selectedcolor;
    ctx.lineTo(e.offsetX, e.offsetY); ///create line acc to mouse pointer
    ctx.stroke(); //drawing line with color
  } else if (selectedtool === "rectangle") {
    drawrect(e);
  } else if (selectedtool === "circle") {
    drawcircle(e);
  } else if (selectedtool === "triangle") {
    drawtri(e);
  }
};
toolbtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedtool = btn.id;
  });
});
size.addEventListener("change", () => (brushwidth = size.value)); //pass sizeslider as brush
color.forEach((btn) => {
  btn.addEventListener("click", () => {
    //add color
    btn.classList.add("selected");
    selectedcolor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});
colorpicker.addEventListener("change", () => {
  colorpicker.parentElement.style.background = colorpicker.value;
  colorpicker.parentElement.click();
});
clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear whole canvas
  setbackground();
});
save.addEventListener("click", () => {
  const link = document.createElement("a"); //create <a> element
  link.download = `${Date.now()}.jpg`; //pass current date as link download value
  link.href = canvas.toDataURL();
  link.click(); // click on link to download image
});
canvas.addEventListener("mousedown", startdraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isdraw = false));
canvas.addEventListener("touchstart", startdraw);
canvas.addEventListener("touchmove", drawing);
canvas.addEventListener("touchend", stopdraw);
