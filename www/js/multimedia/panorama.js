// global
var canvas, color_background, input, img, img2, img3, img4;

//Rectangle

const W = 500, H = 250;

function preload(){
  img = loadImage("img/1.gif");
  img2 = loadImage("img/1 2.gif");
  img3 = loadImage("img/1 3.gif");
  img4 = loadImage("img/1 4.gif");
}
function setup(){
  canvas = createCanvas(innerWidth, innerHeight-30);
  color_background = color(244, 232, 234);
  input = createSlider(0, 255, 234);
}
function draw(){
  background(color_background);
  image(img3,  (window.innerWidth*2/10) - img.width/8, window.innerHeight*.5 - window.innerWidth/8, img.width/4, img.height/4);
  image(img2, (window.innerWidth*4/10) - img.width/8, window.innerHeight*.5 - window.innerWidth/8, img.width/4, img.height/4);
  image(img4, (window.innerWidth*6/10) - img.width/8, window.innerHeight*.5 - window.innerWidth/8, img.width/4, img.height/4);
  image(img, (window.innerWidth*8/10) - img.width/8, window.innerHeight*.5 - window.innerWidth/8, img.width/4, img.height/4);

}
