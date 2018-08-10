//MENU
	//CANVAS

	var canvas;

	// FONTS

	var fontTitol;
	var htext;
	var menu_locked = false;


	var preguntes = [];
	var ip, isp;

// SWIPE

	var color_background;
	var c1, c2, c3, c4;
	var m1, m2, m3, m4;
	var a, b, c, d;
	var centre;

	var rectangle;
	var rectecentre, rectpos, rectw, recth, arrodoniment;

	var distcentre;
	var lastposmouse;

	var counterR, counterG, counterB;	

	var andeerson;
	var duracioVideo;
	

function preload(){
	preloadMenu();
}	
	
function setup(){
	canvas = createCanvas(window.innerWidth, window.innerHeight);
	
	setupSwipe();
	
	
	setupMenu();
	
}
function draw(){
	drawSwipe();
	drawMenu();
	
}

function setupSwipe(){
	lastposmouse = new p5.Vector(mouseX, mouseY);
	
	mig_w = width / 2;
	mig_h = height /2;
	c1 = new p5.Vector(0,0)
	c2 = new p5.Vector(width,0)
	c3 = new p5.Vector(0, height)
	c4 = new p5.Vector(width, height)
	m1 = new p5.Vector(width/2, 0);
	m2 = new p5.Vector(0, height/2);
	m3 = new p5.Vector(width, height/2);
	m4 = new p5.Vector(width/2, height);
	a = new p5.Vector(width*.25, height*.25);
	b = new p5.Vector(width*.75, height*.25);
	c = new p5.Vector(width*.25, height*.75);
	d = new p5.Vector(width*.75, height*.75);
	centre = new p5.Vector(width/2, height/2);
	
	
	color_background = (255);//color(233,233,184);
	
	rectecentre = centre;
	rectw = width * height * 0.0003;
	recth = rectw;
	rectepos = new p5.Vector(centre.x - rectw/2, centre.y - recth/2);
	arrodoniment = 50;
	
	rectangle = new Rectangle(centre, rectw, recth);
	rectangle.arrodoniment = arrodoniment;
	
	counterR = 0;
	counterG = 0;
	counterB = 0;
	
	andeerson = createVideo(['vid/Penrose.mp4']);
	
}

function drawSwipe(){
	background(color_background);
	//rectangle.centre = centre;
	
	if(preguntes[ip].subpreguntes.length == 0 && isp > 0){
		ip = (ip+1)%  preguntes.length;
		isp = 0;
	}
	if(preguntes[ip].subpreguntes.length > 0 && isp == preguntes[ip].subpreguntes.length){
		ip = (ip+1)%  preguntes.length;
		isp = 0;
	}
	
	var missatgePregunta = preguntes[ip].gran;
	var missatgeSubP = preguntes[ip].subpreguntes.length > 0 ? preguntes[ip].subpreguntes[isp] : "";
	var posicioPregunta = new p5.Vector(centre.x, centre.y * 0.2);
	var posicioSubP = new p5.Vector(centre.x, centre.y * 0.3);
	var amplevid = andeerson.width;
	var ratio = rectw / amplevid;
	var altvid = andeerson.height * ratio;
	rectangle.text = missatgeSubP;
	
	push();
	textSize(40);
	posicioPregunta = centraText(missatgePregunta, posicioPregunta);
	text(missatgePregunta, posicioPregunta.x, posicioPregunta.y);
	pop();
	push();
	textSize(20);
		posicioPregunta = centraText(missatgeSubP, posicioSubP);
		text(missatgeSubP, posicioSubP.x, posicioSubP.y);
	pop();
	if(preguntes[ip].numero != 13){
		
		rectangle.update();
		rectangle.draw();
	}
	if(preguntes[ip].numero == 13){
		if(andeerson.time() >= andeerson.duration()){
			rectangle.update();
			rectangle.draw();
		}
		else{
			image(andeerson, centre.x - rectw/2, centre.y - recth/4, rectw, altvid );
			if(keyIsPressed){
					andeerson.play();
			}
		}
	}
	

	
	lastposmouse.x = mouseX;
	lastposmouse.y = mouseY;
	
}

function centraText(t, pos){
	pos.x = pos.x - textWidth(t)/2;
	return pos;
}

document.ontouchmove = function (e) {
  //e.preventDefault();
}

function preloadMenu(){
	fontTitol = loadFont('fonts/Bubblegum.ttf');
}
function setupMenu(){
	menu_locked = false;
	ip = 0;
	isp = 0;
	pushPreguntes();
}


function drawMenu(){
	push(); 

	// sobre pantalla, bloqueja si quasi fora
	
	if(mouseY < height*0.1 &&  !menu_locked){
		var rat = mouseY / height;
		var comp01 = 0.1 - rat;
		var com25 = comp01*height;
		htext = com25*2.5;
		if(mouseY <= 0){menu_locked = true;}
		if(mouseY < height*0.05){htext = height*.25; menu_locked =true;}
	}
	// pinta fora 
	else if(menu_locked && mouseY > height*.25 + textSize()/2){
		menu_locked = false;
		htext = -20
	}
	
	// titol menu
	
	fill('#ED225D');
	textFont(fontTitol);
	textSize(100);
	
	text("Pregunta: " + preguntes[ip].numero, width/2-textWidth("Pregunta: " + preguntes[ip].numero)/2, htext );
	pop();
	push();
	fill(255, 0, 255);
	ellipse(width*0.1, htext, 30, 30);
	pop();
	push();
	fill(0, 255, 255);
	ellipse(width*0.9, htext, 30, 30);
	pop();

	
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

class Pregunta{
	constructor(gran, subpreguntes, numopcions, nump){
		this.gran = gran;
		this.subpreguntes = subpreguntes;
		this.numopcions;
		this.numero = nump;
	}
}

function pushPreguntes(){
	var gran, subpreguntes, numopcions;
	gran = "He denunciado algún programa de televisión por alguna falta";
	subpreguntes = [
	"Mi perfil de alguna red social",
	"La cuenta del medio en alguna red social",
	"El organismo público competente",
	"Un organismo privado"];
	numopcions = 2;
	nump = 2;
	preguntes.push(new Pregunta(gran, subpreguntes, numopcions, nump));
	
	gran = "Internet está menos manipulado que las televisiones porque no se mueve por los intereses de sus propietarios"
	subpreguntes = [];
	numopcions = 3;
	nump = 3;
	preguntes.push(new Pregunta(gran, subpreguntes, numopcions, nump));
	
	gran = "Marca si estás de acuerdo o no con las siguientes afirmaciones";
	
	subpreguntes = [
	"Si hago un producto audiovisual y lo cuelgo en internet puedo utilizarlegalmente cualquier imagen o música sólo si no obtengo un beneficio económico.",
	"Si hago un remix y lo subo a Youtube yo soy el autor."
	];
	numopcions = 3;
	nump=4;
	preguntes.push(new Pregunta(gran, subpreguntes, numopcions, nump));
	
	gran = "¿Qué te parece este anuncio?"
	
	nump = 3;
	nump = 13;
	preguntes.push(new Pregunta(gran, [], numopcions, nump));
	
	
}


class Rectangle{
	
	constructor(centre, w, h){
		this.centre = centre;
		this.w = w;
		this.h = h;
		this.centre2pos = function(){
			return new p5.Vector(this.centre.x - this.w/2, this.centre.y - this.h/2);
		}
		this.pos = this.centre2pos();
		this.arrodoniment = 0;
		this.dragging = false;
		this.speed = 15;
		this.dir = new p5.Vector(0,0);
		this.text = "";
		this.update = function(){
			//this.pos = this.centre2pos();
			if(mouseIsPressed){
				var centre = this.centre;
				var w = this.w;
				var h = this.h;
				var dinsw = (mouseX > centre.x - w/2) && (mouseX < centre.x + w/2);
				var dinsh = (mouseY > centre.y - h/2) && (mouseY < centre.y + h/2);
				if(dinsw && dinsh){
					this.dragging = true;
				}
			}
			else{
				this.dragging =false;
				
				// LLUNY CENTRE  --> IMPULSA FORA
				var distancia_centre = dist(this.centre.x, this.centre.y, rectecentre.x, rectecentre.y);
				if(distancia_centre > 100){
					
					// NO HA CONFIGURAT LA DIRECCIÓ -> CONFIGURAR
					
					if(this.dir.x == 0 && this.dir.y == 0){
						this.dir = new p5.Vector(mouseX - lastposmouse.x, mouseY - lastposmouse.y);
						if(this.dir.x == 0 && this.dir.y == 0){
							this.dir = new p5.Vector(this.centre.x - rectecentre.x, this.centre.y - rectecentre.y);
						}
							
						this.dir.normalize();
					}
					
					//  HA CONFIGURAT -> AVANÇAR
					
					else{
						this.centre.x = this.centre.x + this.dir.x * this.speed;
						this.centre.y = this.centre.y + this.dir.y * this.speed;
					}
					
					// ESTA FORA ? TORNA AL CENTRE
					
					var foraesquerra =(this.centre.x + this.w/2)  < 0;
					var foradreta = (this.centre.x - this.w/2) > width;
					var foradalt =  (this.centre.y + this.h/2) < 0 ;
					var forabaix = (this.centre.y - this.h/2) > height;
					var fora = foraesquerra || foradreta || foradalt || forabaix;
					if( fora ) {
						console.log("out " + foradreta+ " " + foraesquerra+ " " + forabaix + " " +foradalt);
						if(foradreta)  counterG ++;
						if(foraesquerra)  counterR ++;
						if(forabaix)  counterB ++;
						this.dir.x = 0;
						this.dir.y = 0;
						this.centre.x = rectecentre.x;
						this.centre.y = rectecentre.y;
						if(!foradalt){
							isp = isp+1;
						}
						
						
					}
				}
				
				// PROP -> TORNA A POSICIÓ INICIAL
				else{
					this.centre.x = rectecentre.x;
					this.centre.y = rectecentre.y;	
				}

			}
			if(this.dragging){ 
				this.centre = new p5.Vector(mouseX,mouseY);
				//this.centre = new p5.Vector( this.centre.x + (mouseX - lastposmouse.x), this.centre.y + //(mouseY -lastposmouse.y));
			}
			
			
		}
		this.draw = function(){
			
			// VERMELL
			
			var r = 255 * ( 1 - (this.centre.x/ (width/2)));
			var g = 255*((this.centre.x - width/2) * 2 / width);
			var b = 255*((this.centre.y - height/2) * 2 / height);0;
			this.pos = this.centre2pos();
			push();
			r > b ? b = 0 :  r = 0;
			g > b ? b = 0 : g = 0;
			if(r == 0 && g == 0 && b == 0){
				r = 255;
				g = 255;
				b = 255;
			}
			
			
			
			//text("r: "+ r + " g: "+ g +" b "+b, 20, 20);
			//text("r: "+ counterR + " g: "+ counterG +" b "+ counterB, 20, 40);
			
			//text(dist(this.centre.x, this.centre.y, rectecentre.x, rectecentre.y), 60, 60);
			
			fill(r, g, b);
			rect(this.pos.x, this.pos.y, this.w, this.h, this.arrodoniment);	
			pop();
			text("", this.centre.x - textWidth(this.text)/2, this.centre.y);
		}
	}
	

}