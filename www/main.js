//MENU
//CANVAS

	var canvas;

	// FONTS

	var fontTitol;
	var htext;
	var menu_locked = false;


	var preguntes = [];
	var id_drive = '1zgbpqe7rz29bWPg2Qw7AAwPrftHGUyrJHJd9_NXdGKA';
	var ip, isp;

// SWIPE

	var color_background;
	var centre;

	var rectangle;
	var rectecentre, rectpos, rectw, recth, arrodoniment;

	var missatgePregunta, missatgeSubP;

	var distcentre;
	var lastposmouse;

	var counterR, counterG, counterB;

	var andeerson;
	var paramsvid;
	var duracioVideo;

//SWIPE 2

	var ample= window.innerWidth*2/6;
	var limesq = window.innerWidth * 0.5 - ample*0.5;
	var limdret = (window.innerWidth * 0.5) +ample*0.5;
	var col, colordefons, color_esquerra, color_dreta;
	var prov, misil, rmisil;
	var mousein, lastframefora = false, started = false, paused = true;


function preload(){
	preloadMenu();
}

function setup(){
	canvas = createCanvas(window.innerWidth, window.innerHeight);

	setupSwipe();
	setupVideo();
	setupSwipe2();
	setupMenu();

}
function draw(){
	drawSwipe();
	drawMenu();

}

function setupSwipe2(){
	color_esquerra = color(243,100, 50);
	color_dreta = color(50,243, 100);
}

function setupSwipe(){
	lastposmouse = new p5.Vector(mouseX, mouseY);
	centre = new p5.Vector(width/2, height/2);


	color_background = color(255,255,255);//color(233,233,184);

	rectecentre = centre;
	rectw = width * height * 0.0003;
	recth = rectw;
	rectepos = new p5.Vector(centre.x - rectw/2, centre.y - recth/2);
	arrodoniment = 50;

	rectangle = new Rectangle(centre.x, centre.y, rectw);
	rectangle.arrodoniment = arrodoniment;

	counterR = 0;
	counterG = 0;
	counterB = 0;

	andeerson = createVideo(['vid/Penrose.mp4']);

}

function drawSwipe(){
	background(color_background);

	if(preguntes[ip].subpreguntes.length == 0 && isp > 0){
		ip = (ip+1)%  preguntes.length;
		isp = 0;
	}
	if(preguntes[ip].subpreguntes.length > 0 && isp == preguntes[ip].subpreguntes.length){
		ip = (ip+1)%  preguntes.length;
		isp = 0;
	}

	missatgePregunta = preguntes[ip].gran;
	missatgeSubP = preguntes[ip].subpreguntes.length > 0 ? preguntes[ip].subpreguntes[isp] : "";
	var posicioPregunta = new p5.Vector(centre.x, centre.y * 0.2);
	var posicioSubP = new p5.Vector(centre.x, centre.y * 0.3);

	rectangle.text = missatgeSubP;



	push();
	var si = 40;
	textSize(si);
	while(textWidth(missatgePregunta) >= 1.25 * innerWidth){
		si--;
		textSize(si);
	}

	posicioPregunta = centraText(missatgePregunta, posicioPregunta);
	text(missatgePregunta, posicioPregunta.x, posicioPregunta.y);
	pop();



	if(preguntes[ip].numero != 13){
		if(started && !paused){
			drawSwipe2();
		}

	}
	if(preguntes[ip].numero == 13){
		//drawVideo();
	}
}

function keyPressed(){
	let enter = keyCode === ENTER;
	let dinslimit = entre(mouseX, limesq,limdret);
	started  = enter && dinslimit;
}

function drawSwipe2(){
	mousein = entre(mouseX, limesq, limdret);
	if(mousein){
		var pos;
		pos = window.innerWidth * .5;
		prov = new Rectangle(pos, window.innerHeight*.5, 90);
		prov.text = missatgeSubP;
		prov.draw();
	}
	else{
		col = (mouseX < limesq) ? color_esquerra : color_dreta;
		if(rmisil == undefined && !lastframefora){
			rmisil = new Rectangle(window.innerWidth*.5, window.innerHeight*.5, 90);
			rmisil.color = col;
			rmisil.colortext = color(255,255,255);
			rmisil.text = missatgeSubP;
		}
	}
	updatemisil();
	lastframefora = !mousein;
}


function updatemisil(){
	if(rmisil != undefined){
		rmisil.draw();
		if(!entre(rmisil.x, 0, window.innerWidth)  || !entre(rmisil.y, 0,window.innerHeight)){
			rmisil = undefined;
			isp = isp+1;
		}
	}
}

document.ontouchmove = function (e) {
  //e.preventDefault();
}


function mousePressed(){
	if(dist(mouseX, mouseY, width*0.1, htext) < 30){
		ip = ip -1;
		if(ip < 0){
			ip = preguntes.length -1;
			isp = 0;
		}
	}
	if(dist(mouseX, mouseY, width*0.9, htext) < 30){
		ip = (ip+1)%  preguntes.length;
		isp = 0;
	}
}

