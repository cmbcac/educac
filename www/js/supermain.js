//		INSTRUCCIONES DE MODIFICACION:
/*
		EN EL CASO DE HABER MODIFICADO LOS ELEMENTOS ID DE FICHEROS ANTERIORES,
		SE TENDRA QUE MODIFICAR LAS SIGUIENTES "function":
		
		1. function set_preguntes:
			
			1.1. En "- let tip = e['gsx$tipo'].$t -", se tiene que cambiar "tipo" por
				 el nuevo nombre del elemento ID correspondiente
			1.2. En "- let txtfot = e['gsx$diseño'].$t -", se tiene que cambiar "diseño" 	por el nuevo nombre del elemento ID correspondiente
			
		2. function afegir_pregunta:
			2.1. TODOS los elementos de tipo 'respostaX' que hayan sido modificados anteriormente
			
			2.2. TODOS los elementos de tipo 'catX' que hayan sido modificados anteriormente
			
			2.3. El elemento 'respostacorrecta' si es que ha sido modificado anteriormente
			
			2.4. El elemento 'enun' si es que ha sido modificado anteriormente
			
			2.5. el elemento 'puntuació' si es que ha sido modificado anteriormente
			
			2.6. el elemento 'url' si es que ha sido modificado anteriormente

		3. var multichoice_gsx:
			MODIFICAR TODOS LOS ELEMENTOS QUE CONTENGAN LOS VALORES DE TEXTO IGUALES A LOS VALORES ANTERIORES DE LAS ID
*/

{
var canvas;
var ctx;
var estats = ["inici", "playing", "pause", "error", "submit"], estatdelsistema = "inici", missatgeerror = "";
var ESC = 27;
var SPACE = 32;
var ESQUERRA = 37;
var DRETA = 39;
var preguntes = [];
var current = 0;
// vars para swipe
var backswipe;
var estatswipe = "nomig", estats_swipe = ["nomig", "migsense", "migamb", "dreta", "esquerra", "avall"];
var isubp = 0;
//vars para drag;
var isubp2 = 0;
var lastframemouse;
//vars para relacio
var lock1;
var lock2;
var respostarel="";
var track=0;
//vars para filtre
var estat=-1;
var opcions;
var resposta;
//vars para ordenar
var ordre=["A- ","B- ","C- ","D- ","E- "]
var resp;
var respfin;
//Vars para submit
var sbmit;
var passar;
var stateprint=true;
var start=true;
var SENDURL;
}

function setup(){
	canvas = createCanvas(window.innerWidth*0.9, window.innerHeight*0.85);
	canvas.position(window.innerWidth*0.05,window.innerHeight*0.1);
	canvas = document.getElementById("defaultCanvas0");
	canvas.style.border = "2px solid";
	canvas.style.borderRadius = "15px";
	ctx=canvas.getContext('2d');
	backswipe =  color(144, 145, 232, 0.2);
	lastframemouse = mouseIsPressed;	
}

function draw(){
	
	textFont('Helvetica');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	resp=document.getElementById("respostaescrita");
	resp.setAttribute('style', 'display:none');
	var g = 202.5 + (Math.sin(frameCount/100) * 52.5);
	if(estatdelsistema == "inici" ){
		inici();		
	}

	if(estatdelsistema == "pause"){
		pause();
	}		

	if(preguntes.length > 0 && estatdelsistema == "playing"){
		
		playing();
		
	}

	if(document.getElementById("totalseconds").innerHTML=="5"&&preguntes.length<=0){
		document.getElementById("totalcountup").setAttribute("style", "display:none");
		ctx.clearRect(0, 0, width, height);
		document.getElementById("defaultCanvas0").style.border="2px solid black";
		estatdelsistema="error";
	}

	if(estatdelsistema == "submit"){
		sbmit();
	}

	if(estatdelsistema == "error"){
		error();	
	}
	
	push()
	fill(0+g*0.1, 204, 102);
	pop();	
}

function mouseReleased(){
  mouseout = true;
}

function keyPressed(){
	event.stopImmediatePropagation();
	//console.log(keyCode);
	//on inici
	if(keyCode === 88 && estatdelsistema == "inici" && preguntes.length > 0){
		estatdelsistema = "playing";
		return;
	}
	//on playing
	if(keyCode ===  SPACE &&  (estatdelsistema == "playing"||estatdelsistema == "submit")){
		estatdelsistema = "pause";
		return;
	}
	if(keyCode === ESC && (estatdelsistema == "playing"||estatdelsistema == "submit")){
		estatdelsistema = "pause";
		return;
	}
	//on pause
	if((keyCode === SPACE || keyCode === 88) && estatdelsistema == "pause"){
		if(current>=preguntes.length){
			estatdelsistema="submit";
		}else{
			estatdelsistema = "playing";
		}
		return;
	}
	if(keyCode === ESC && estatdelsistema == "pause"){
		estatdelsistema = "inici";
		return;
	}
	//on error
	if((keyCode === SPACE || keyCode === ENTER) && estatdelsistema == "error"){
		estatdelsistema = "pause";
		return;
	}
}

function set_preguntes(data, params){
	data = text_a_JSON(data);
	console.log(data);
	entry = data.feed.entry
	for(var i = 0; i < entry.length; i++){
		
		let e = entry[i];
		
		if(i==0){
			SENDURL = e['gsx$linkderespuesta'].$t;
		}
		
		let tip = e['gsx$tipo'].$t;
		let txtfot = e['gsx$diseño'].$t;
		let list_gsx = multichoice_gsx;
		afegir_pregunta(tip, txtfot, e, list_gsx);
	}
}

//LA FUNCION DE "AFEGIR_PREGUNTA" CONSISTE EN LEER LOS ELEMENTOS DE TIPO JSON QUE ESTAMOS RECIBIENDO Y TRANSFORMARLOS EN STRINGS
//DENTRO DE LA ESTRUCTURA DE PREGUNTAS DE LA MANERA QUE NOS CONVENGA, EN CASO DE AÑADIR UN NUEVO TIPO DE PREGUNTA, SE PRECISARA
//DE ESPEDCIFICAR COMO SE RECIBE LA INFORMACION JSON DENTRO DE ELLA
function afegir_pregunta(tip, txtfot, e,list_gsx){
	var g = 'gsx$';
	var gran;
	var subpreguntes;
	var categories;
	var numopcions;
	var resp;
	var puntuació;  
	if(tip == "Swipe"){
		subpreguntes=[];
		categories=[];
		var left, down, right;	
		left = e[g+'respuesta1'].$t;
		down = e[g+'respuesta2'].$t;
		right= e[g+'respuesta3'].$t;		
		if(left&&down&&right){ numopcions = 3;}		
		else if(left&&right){ numopcions = 2;}				
		if(!left && !right && ! down) return 0;					
		multichoice_gsx.forEach(element => {
			if(element.includes("resp")){
				if(e[g+element].$t!=""){
					subpreguntes.push(e[g+element].$t);
				}
			}
			if(element.includes("respuestacorrecta")){
				if(e[g+element].$t!=""){
					resp = e[g+element].$t;
				}
			}
			if(element.includes("apar")){
				if(e[g+element].$t!=""){
					categories.push(e[g+element].$t);
				}
			}
			if(element.includes("enun")){
				if(e[g+element].$t!=""){
					gran=e[g+element].$t;
				}
			}
			if(element.includes("puntuacion")){
				if(e[g+element].$t!=""){
					puntuació=parseInt(e[g+element].$t, 10);
				}
			}
		});
		subpreguntes = [left, down, right];
		var p = new Pregunta(gran, subpreguntes, categories, numopcions, puntuació);
		p.tipologia = tip;
		p.diseño=txtfot;
		p.respostes = resp;
		preguntes.push(p);
	}
	if(tip == "Drag-categories"){		
		numopcions=5;
		categories = [];
		subpreguntes = [];		
		multichoice_gsx.forEach(element => {
			if(element.includes("resp")){
				if(e[g+element].$t!=""){
					subpreguntes.push(e[g+element].$t);
				}
			}
			if(element.includes("respuestacorrecta")){
				if(e[g+element].$t!=""){
				resp = e[g+element].$t;
				}
			}
			if(element.includes("apar")){
				if(e[g+element].$t!=""){
				categories.push(e[g+element].$t);
				}
			}
			if(element.includes("enun")){
				if(e[g+element].$t!=""){
				gran=e[g+element].$t;
				}
			}
			if(element.includes("puntuacion")){
				if(e[g+element].$t!=""){
					puntuació=parseInt(e[g+element].$t, 10);
				}
			}
		});
		respuestascorrectas = [];
		respuestascorrectas.push(e[g+'respostacorrecta'].$t);
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, puntuació);
		p.tipologia = tip;
		p.diseño=txtfot;
		p.respostes = respuestascorrectas;
		preguntes.push(p);
	}
	if(tip == "Opció múltiple"){
		var gran, subpreguntes = [], resp;
		multichoice_gsx.forEach(element => {
			if(element.includes("enun")){
				if(e[g+element].$t!=""){
					gran = e[g+element].$t
				}
			}
			if(element.includes("resp")){
				if(e[g+element].$t!=""){ 
					subpreguntes.push(e[g+element].$t);
				}
			}
			if(element.includes("apar")){
				if(e[g+element].$t!=""){
					resp = e[g+element].$t;
				}
			}
			if(element.includes("puntuacion")){
				if(e[g+element].$t!=""){
					puntuació=parseInt(e[g+element].$t, 10);
				}
			}
		});
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, puntuació);
		p.tipologia = tip;
		p.respostes = resp;
		p.diseño=txtfot;
		preguntes.push(p);
	}
	if(tip == "Filtre" || tip == "Youtube"){
		var gran, subpreguntes = [], resp;

		for(var i = 0; i < list_gsx.length; i++){
			let current = list_gsx[i];
			let ecurrent = e[g+current].$t;
			
			if(current.includes("enun") && ecurrent) gran = ecurrent;
			if(current.includes("puntuacion")&& ecurrent) puntuació=ecurrent;
			subpreguntes = e[g+'url'].$t;
		}
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, puntuació);
		p.tipologia = tip;
		p.respostes = resp;
		preguntes.push(p);
		p.diseño=txtfot;
	}
	if(tip== "Relació"){
		var numopcions=0;
		var subpreguntes = [], resp;
		categories = [];
		multichoice_gsx.forEach(element => {
			if(element.includes("resp")){
				if(e[g+element].$t!=""){
					subpreguntes.push(e[g+element].$t);
				}
			}
			if(element.includes("respuestacorrecta")){
				if(e[g+element].$t!=""){
					resp = e[g+element].$t;
				}
			}
			if(element.includes("apar")){
				if(e[g+element].$t!=""){
					categories.push(e[g+element].$t);
				}
			}
			if(element.includes("enun")){
				if(e[g+element].$t!=""){
					gran=e[g+element].$t;
				}
			}
			if(element.includes("puntuacion")){
				if(e[g+element].$t!=""){
					puntuació=parseInt(e[g+element].$t, 10);
				}
			}
		});
		var p = new Pregunta(gran,subpreguntes, categories, numopcions, puntuació);
		p.tipologia = tip;
		p.respostes = resp;
		preguntes.push(p);
		p.diseño=txtfot;
	}
	if(tip == "Ordenar"){
		var gran, subpreguntes = [], resp;
		multichoice_gsx.forEach(element => {
			if(element.includes("enun")){
				gran = e[g+element].$t
			}
			if(element.includes("resp")){
				subpreguntes.push(e[g+element].$t);
			}
			if(element.includes("apar")){
				resp = e[g+element].$t;
			}
			if(element.includes("puntuacion")){
				if(e[g+element].$t!=""){
					puntuació=parseInt(e[g+element].$t, 10);
				}
			}
		});
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, puntuació);
		p.tipologia = tip;
		p.respostes = resp;
		preguntes.push(p);
		p.diseño=txtfot;
	}
	if(tip == "Buscador"){
		var gran, subpreguntes = [], resp;
		multichoice_gsx.forEach(element => {
			if(element.includes("enun")){
				if(e[g+element].$t!=""){
					gran = e[g+element].$t
				}
			}
			if(element.includes("resp")){
				if(e[g+element].$t!=""){ 
					subpreguntes.push(e[g+element].$t);
				}
			}
			if(element.includes("respuestacorrecta")){
				if(e[g+element].$t!=""){
					resp = e[g+element].$t;
				}
			}
			if(element.includes("puntuacion")){
				if(e[g+element].$t!=""){
					puntuació=parseInt(e[g+element].$t, 10);
				}
			}
			
		});
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, puntuació);
		p.tipologia = tip;
		p.respostes = resp;
		preguntes.push(p);
		p.diseño=txtfot;
	}
	if(tip == "RespuestaLibre"){
		var gran, subpreguntes = [], resp;
		multichoice_gsx.forEach(element => {
			if(element.includes("enun")){
				if(e[g+element].$t!=""){
					gran = e[g+element].$t
				}
			}
			if(element.includes("resp")){
				if(e[g+element].$t!=""){ 
					subpreguntes.push(e[g+element].$t);
				}
			}
			if(element.includes("respuestacorrecta")){
				if(e[g+element].$t!=""){
					resp = e[g+element].$t;
				}
			}
			if(element.includes("puntuacion")){
				if(e[g+element].$t!=""){
					puntuació=parseInt(e[g+element].$t, 10);
				}
			}
			
		});
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, puntuació);
		p.tipologia = tip;
		p.respostes = resp;
		preguntes.push(p);
		p.diseño=txtfot;
	}
}
//ELEMENTO QUE NOS PERMITE LEER LOS APARTADOS DE LOS DATOS DE TIPO JSON
//EN CASO DE AÑADIR UN NUEVO TIPO DE ELEMENTO, TAMBIEN SE TENDRA QUE AÑADIR ESE ELEMENTO AL MULTICHOICE
var multichoice_gsx = [
"enunciado",
"respuesta1",
"respuesta2",
'respuesta3',
'respuesta4',
'respuesta5',
'apartado1',
'apartado2',
'apartado3',
'apartado4',
'apartado5',
'url',
'respuestacorrecta',
'puntuacion'];
//NO ES RECOMENDABLE PERO ESTA FUNCION OCUPA AL ORDENADOR X MILISEGUNDOS PARA PERMITIR QUE LOS EVENTOS COMO MOUSEISPRESSED O KEYPRESSED SE ACTUALIZEN CORRECTAMENTE
function sleep(milliseconds) {
  var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}
//ESQUELETO DE COMO ESTAN FORMADAS LAS PREGUNTAS EN GENERAL
class Pregunta{
	constructor(gran, subpreguntes, categories, numopcions, puntatje, date){
		this.gran = gran;
		this.subpreguntes = subpreguntes;
		this.categories = categories
		this.numopcions = numopcions;
		this.puntatje = puntatje;
		this.respostaUsuari = [];
		this.date=date;
	}
}
