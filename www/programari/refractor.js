class Ubicacio{
	constructor(pos){
		this.pos = pos;
		this.img;
	}
}

var canvas;

var categories = 4;
var categoriesLabels = ["Dinamismo", " Calma", "Incertidumbre", "Riesgo"];
var ts = 40;

// GRADIENT
var Y_AXIS = 1;
var X_AXIS = 2;
var c1, c2, c3, c4, c5, c6, c7, c8;



var cw, ch;
var q1, q2, q3, q4;
var im1, im2, im3, im4;
var av, bv, cv, dv;

//

var coleccio = [];
var ubiA, ubiB, ubiC, ubiD;
var current = 0;

// quadre 
var figx, figy;
var pintacuadre;
var grab = false;

function setup(){
	canvas = createCanvas(window.innerWidth, window.innerHeight);
	cw = window.innerWidth*0.5;
	ch = window.innerHeight*0.5;

	// Draw gray box
	stroke(153);
	line(cw, 0, cw, height);
	line(0 ,ch , width, ch);

	av = new p5.Vector(cw/2, ch/2);
	bv = new p5.Vector(cw*3/2, ch/2);
	cv = new p5.Vector(cw/2, ch*3/2);
	dv = new p5.Vector(cw*3/2, ch*3/2);
	
	ubiA = new Ubicacio(av);
	ubiB = new Ubicacio(bv);
	ubiC = new Ubicacio(cv);
	ubiD = new Ubicacio(dv);

	c1 = color(207, 252, 255);
	c2 = color(189, 253, 158);
	c3 = color(255, 226, 226);
	c4 = color(253, 251, 158);
	c5 = color(253, 207, 158);
	c6 = color(253, 158, 223);
	c7 = color(240, 153, 158);
	c8 = color(158, 235, 253);
	
	im1 = loadImage("img/circle.png"); 
	im2 = loadImage("img/explosion.png"); 
	im3 = loadImage("img/romb.png"); 
	im4 = loadImage("img/thunder.png"); 
	
	coleccio.push(im1);
	coleccio.push(im2);
	coleccio.push(im3);
	coleccio.push(im4);

	pintacuadre = true;
	
	figx = cw;
	figy = ch;
	
}


function draw(){
	
	// Draw white points

	setGradient(0, 0, cw, ch, c1, c2, Y_AXIS);
	setGradient(cw, 0, cw, ch, c3, c4, Y_AXIS );
	setGradient(0, ch, cw, ch, c6, c5, Y_AXIS);
	setGradient(cw, ch, cw, ch, c8, c7, Y_AXIS);
	
	push();
	stroke('#000000');
	strokeWeight(3);
	fill(255, 255, 255);
	textSize(ts);
	
	var center_text1 = textWidth("DINAMISMO") / 2;
	var center_text2 = textWidth("CALMA") / 2;
	var center_text3 = textWidth("INCERTIDUMBRE") / 2;
	var center_text4 = textWidth("RIESGO") / 2;
	
	text("DINAMISMO", av.x - center_text1, av.y);
	text("CALMA", bv.x - center_text2, bv.y);
	text("INCERTIDUMBRE", cv.x - center_text3, cv.y);
	text("RIESGO", dv.x - center_text4,dv.y);
	pop();
	
	
	if(pintacuadre){
		push();
		fill(255);
		rect(cw-150, ch-150, 300, 300, 20);
		pop();
	}


	if(mouseIsPressed){
		var inx = (mouseX > cw-150) && (mouseX < cw+150)
		var iny = (mouseY > ch-150) && (mouseX < ch+150)
		if(inx && iny){
			grab = true;
			
		}
	}
	
	if(grab){
		
		figx = mouseX;
		figy = mouseY;
	}
	
	
	if(current < coleccio.length)
		image(coleccio[current], figx-100, figy-100, 200, 200);
	
	if(ubiA.img != undefined){
		image(ubiA.img, ubiA.pos.x-100, ubiA.pos.y-100, 200, 200);
	}
	if(ubiB.img != undefined){
		image(ubiB.img, ubiB.pos.x-100, ubiB.pos.y-100, 200, 200);
	}
	if(ubiC.img != undefined){
		image(ubiC.img, ubiC.pos.x-100, ubiC.pos.y-100, 200, 200);
	}
	if(ubiD.img != undefined){
		image(ubiD.img, ubiD.pos.x-100, ubiD.pos.y-100, 200, 200);
	}
}




function mouseReleased(){
	grab = false;
	distcent = dist(av.x, av.y, cw, ch) / 2;
	if(dist(av.x, av.y, figx, figy) < distcent){
		console.log("a");
		//figx = av.x;
		//figy = av.y;
		ubiA.img = coleccio[current];
		current++;
	} else
	if(dist(bv.x, bv.y, figx, figy) < distcent){
		console.log("b");
		//figx = bv.x;
		//figy = bv.y;
		ubiB.img = coleccio[current];
		current++;
	} else
	if(dist(cv.x, cv.y, figx, figy) < distcent){
		console.log("c");
		//figx = cv.x;
		//figy = cv.y;
		ubiC.img = coleccio[current];
		current++;
	}else
	if(dist(dv.x, dv.y, figx, figy) < distcent){
		console.log("d");
		//figx = dv.x;
		//figy = dv.y;
		ubiD.img = coleccio[current];
		current++;
	}
	figx = cw;
	figy = ch;
	
	
	
	
	//if(dist(cw/2, ch/2, figx, figy))
	

}


window.addEventListener('resize', function(){
	canvas.size(window.innerWidth, window.innerHeight);
	cw = window.innerWidth*0.5;
	ch = window.innerHeight*0.5;
});


function setGradient(x, y, w, h, c1, c2, axis) {

  noFill();

  if (axis == Y_AXIS) {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == X_AXIS) {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y+h);
    }
  }
}

