
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
  ctx.fillStyle = selectedcolor; // Corrected fillStyle to selectedcolor for brush color
};

const getOffsetX = (e) => (e.touches ? e.touches[0].clientX - canvas.offsetLeft : e.offsetX);
const getOffsetY = (e) => (e.touches ? e.touches[0].clientY - canvas.offsetTop : e.offsetY);

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setbackground();
});

const drawrect = (e) => {
  const offsetX = getOffsetX(e);
  const offsetY = getOffsetY(e);
  if (!fill.checked) {
    return ctx.strokeRect(offsetX, offsetY, prevmousex - offsetX, prevmousey - offsetY);
  }
  ctx.fillRect(offsetX, offsetY, prevmousex - offsetX, prevmousey - offsetY);
};

const drawcircle = (e) => {
  ctx.beginPath();
  const offsetX = getOffsetX(e);
  const offsetY = getOffsetY(e);
  let radius = Math.sqrt(Math.pow(prevmousex - offsetX, 2) + Math.pow(prevmousey - offsetY, 2)); // getting radius of the circle
  ctx.arc(prevmousex, prevmousey, radius, 0, 2 * Math.PI);
  fill.checked ? ctx.fill() : ctx.stroke();
};

const drawtri = (e) => {
  ctx.beginPath(); // create new path
  const offsetX = getOffsetX(e);
  const offsetY = getOffsetY(e);
  ctx.moveTo(prevmousex, prevmousey); // move triangle to mouse pointer
  ctx.lineTo(offsetX, offsetY); // create first line according to mouse pointer
  ctx.lineTo(prevmousex * 2 - offsetX, offsetY); // create bottom line of triangle
  ctx.closePath();
  fill.checked ? ctx.fill() : ctx.stroke();
};

const startdraw = (e) => {
  isdraw = true;
  prevmousex = getOffsetX(e); // current mousex pos as prevmousex pos
  prevmousey = getOffsetY(e); // current mousey pos as prevmousey pos
  ctx.beginPath(); // create new path to draw
  ctx.lineWidth = brushwidth; // setting brush width as line width
  ctx.fillStyle = selectedcolor; // pass selected color as fill style
  ctx.strokeStyle = selectedcolor; // pass selected color as stroke style
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); // copying data & pass it as snapshot value to avoid dragging image
};

const drawing = (e) => {
  if (!isdraw) return;
  ctx.putImageData(snapshot, 0, 0); // adding copied canvas data
  const offsetX = getOffsetX(e);
  const offsetY = getOffsetY(e);
  if (selectedtool === "brush" || selectedtool === "eraser") {
    ctx.strokeStyle = selectedtool === "eraser" ? "#fff" : selectedcolor;
    ctx.lineTo(offsetX, offsetY); // create line according to mouse pointer
    ctx.stroke(); // drawing line with color
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

size.addEventListener("change", () => (brushwidth = size.value)); // pass size slider as brush width

color.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".colors .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedcolor = window.getComputedStyle(btn).getPropertyValue("background-color");
  });
});

colorpicker.addEventListener("change", () => {
  colorpicker.parentElement.style.background = colorpicker.value;
  colorpicker.parentElement.click();
});

clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear whole canvas
  setbackground();
});

save.addEventListener("click", () => {
  const link = document.createElement("a"); // create <a> element
  link.download = `${Date.now()}.jpg`; // pass current date as link download value
  link.href = canvas.toDataURL();
  link.click(); // click on link to download image
});

const stopdraw = () => (isdraw = false);

canvas.addEventListener("mousedown", startdraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopdraw);

canvas.addEventListener("touchstart", startdraw);
canvas.addEventListener("touchmove", drawing);
canvas.addEventListener("touchend", stopdraw);
