var ample= window.innerWidth*2/6;
var limesq = window.innerWidth * 0.5 - ample*0.5;
var limdret = (window.innerWidth * 0.5) +ample*0.5;
var col, colordefons;
var misil, rmisil;
var mousein, lastframefora = false, started = false;

function setup(){
	canvas = createCanvas(window.innerWidth, window.innerHeight);
	colordefons = color(150,245, 200);
	color_esquerra = color(243,100, 50);
	color_dreta = color(50,243, 100);
}


function draw(){
	background(colordefons);
	if(started){
		col = color(255,255,255);
		mousein = entre(mouseX, limesq, limdret);
		if(mousein){
			var pos, prov;
			pos = window.innerWidth * .5;
			prov = new Rectangle(pos, window.innerHeight*.5, 90);
			prov.color = (244,114,22);
			prov.draw();
		}
		else{
			col = (mouseX < limesq) ? color_esquerra:color_dreta;
			if(misil == undefined && !lastframefora){
				misil = new Bola(window.innerWidth*.5, window.innerHeight*.5, 90);
				rmisil = new Rectangle(window.innerWidth*.5, window.innerHeight*.5, 90);
				misil.color = col;
				rmisil.color = col;
				rmisil.colortext = color(255,255,255);
			}
		}
		
		updatemisil();
		lastframefora = !mousein;	
	}
}

function keyPressed(){
	let enter = keyCode === ENTER; 
	let dinslimit = mouseX > limesq && mouseX < limdret;
	started  = enter && dinslimit;
}

function updatemisil(){
	if(misil != undefined){
		misil.draw();
		if( !entre(misil.x, 0, window.innerWidth) || entre(misil.y, 0, window.innerHeight)){
			misil = undefined;
		}
	}
	if(rmisil != undefined){
		rmisil.draw();
		if(rmisil.x < 0 || rmisil.x > window.innerWidth || rmisil.y < 0 || rmisil.y > window.innerHeight){
			rmisil = undefined;
		}
	}
}


window.onresize = function(){
	canvas.size(window.innerWidth, window.innerHeight);
	
}