//		INSTRUCCIONES DE MODIFICACION:
/*
		EN EL CASO DE HABER MODIFICADO LOS ELEMENTOS ID DE FICHEROS ANTERIORES,
		SE TENDRA QUE MODIFICAR LAS SIGUIENTES "function":
		
		1. function set_preguntes:
			
			1.1. En "- let tip = e['gsx$tipus'].$t -", se tiene que cambiar "tipus" por
				 el nuevo nombre del elemento ID correspondiente
			1.2. En "- let txtfot = e['gsx$disseny'].$t -", se tiene que cambiar "disseny" 	por el nuevo nombre del elemento ID correspondiente
			
		2. function afegir_pregunta:
			2.1. TODOS los elementos de tipo 'respostaX' que hayan sido modificados anteriormente
			
			2.2. TODOS los elementos de tipo 'catX' que hayan sido modificados anteriormente
			
			2.3. El elemento 'corr' si es que ha sido modificado anteriormente
			
			2.4. El elemento 'enun' si es que ha sido modificado anteriormente
			
			2.5. el elemento 'punt' si es que ha sido modificado anteriormente
			
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
var backdrag;
var isubp2 = 0;
var lastframemouse;
//vars para relacio
var lock1;
var lock2;
var respostarel="";
var estatmatch=false;
var track=0;
//vars para filtre
var filtres = ["Blur","Brightness","Contrast","Grayscale","Invert","Opacity", "Saturate", "Sepia"];
var estat=-1;
var opcions;
var resposta;
//vars para ordenar
var ordre=["A- ","B- ","C- ","D- ","E- "]
var resp;
var respfin;
//Vars para submit
var sbmit;
var newlabel;
var namenewlabel;
var passar;
var boolpassar=false;
var stateprint=true;
var end=false;
var start=true;
var SENDURL;
}
/*
function preload(){
  //carrega base de dades
  util_xmlhttp(id_drive, set_preguntes,{}, function(){} )
  
}
*/
function setup(){
	canvas = createCanvas(window.innerWidth*0.8, window.innerHeight*0.85);
	canvas.position(window.innerWidth*0.1,window.innerHeight*0.1);
	canvas = document.getElementById("defaultCanvas0");
	canvas.style.border = "2px solid";
	canvas.style.borderRadius = "15px";
	
	ctx=canvas.getContext('2d');
	backswipe =  color(144, 145, 232, 0.2);
	lastframemouse = mouseIsPressed;	
	ctx.font = "30px Arial" 
}
function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	resp=document.getElementById("respostaescrita");
	resp.setAttribute('style', 'display:none');
	//DRAW QUAN EL SISEMA ESTA EN INICI
	if(estatdelsistema == "inici" ){
		var g = 202.5 + (Math.sin(frameCount/100) * 52.5);
		
		if(start==true){
			document.getElementById("defaultCanvas0").style.border="2px solid black";
			createStart();
		}
		rectC(innerWidth/2.5,innerHeight/1.5,100,50);
		textC("Empezar",innerHeight/1.48,20);
		let dinsX=entre(mouseX, innerWidth/2.5-50, innerWidth/2.5 + 50);
		let dinsY=entre(mouseY, innerHeight/1.5-25, innerHeight/1.5 + 25);				
		if(dinsX&&dinsY){
			push();
			fill(100,200,200);
			rectC(innerWidth/2.5,innerHeight/1.5,100,50);
			pop();
			textC("Empezar",innerHeight/1.48,20);					
			if(mouseIsPressed){							
				if(document.getElementById("url").value!="" && document.getElementById("sendurl").value !=""){
					util_xmlhttp(document.getElementById("url").value, set_preguntes,{}, function(){} );						
					$( ".loader" ).css( "display", "inline" );
					document.getElementById("StartingDiv").setAttribute("style", "display:none");
					ctx.clearRect(0, 0, width, height);
					upTime(new Date());
					totalupTime(new Date());
					SENDURL=document.getElementById("sendurl").value;
					estatdelsistema="playing";
				}
			}		
		}		
	}
	//DRAW QUAN EL SISTEMA ESTIGUI EN PAUSA
	if(estatdelsistema == "pause"){
		$( ".loader" ).css( "display", "none" );
		
		textC("Pausa", innerHeight * .5, 30);
		textC("Pulsa espacio o enter para seguir", innerHeight * .5 + 45, 15);
		if(preguntes.length > 0){
			textC("PREGUNTA: " + (current+1), innerHeight * .5 + 100, 20);		
		}
	}		
	//DRAW QUAN EL SISTEMA ESTA JUGANT
	if(preguntes.length > 0 && estatdelsistema == "playing"){
		document.getElementById("defaultCanvas0").style.border="2px solid black";
		document.getElementById("totalcountup").setAttribute("style","display:block");
		document.getElementById("passar").setAttribute("style", "display:inline");
		if(current>=preguntes.length){	
			estatdelsistema="submit";
		}
		else{
			$( ".loader" ).css( "display", "none" );
			var p = preguntes[current];
			var tipo = p.tipologia;
			g = Math.cos(frameCount/70)*100;
			ctx.fillStyle = "#999999";	
			//DRAW PER A CADA ESTAT DEL JOC
			if(tipo == "Opció múltiple"){
				p.disseny=="Text" ? opcio_multiple(p,g) : fotomultop(p,g);
				//opcio_multiple(p, g)
			}
			else if(tipo == "Swipe"){
				p.disseny=="Text"? swipe(p,g) : fotoswipe(p,g);
				//swipe(p,g);
			}
			else if(tipo == "Drag-categories"){
				p.disseny=="Text"? drag(p,g) : fotodrag(p,g);
				//drag(p,g);
			}
			else if(tipo == "Filtre"){			
				filtre(p,g);
			}	
			else if(tipo == "Relació"){
				p.disseny=="Text"? relacio(p,g) : fotorelacio(p,g);
				//relacio(p,g);
			}
			else if(tipo == "Ordenar"){
				ordenar(p,g);
			}
			else if(tipo == "Busca"){
				buscador(p,g);
			}
			else if(tipo == "Youtube"){
				Youtube(p,g);
			}
			else if( tipo == "RespuestaLibre"){
				RespLibr( p , g );
			}
		}
		document.getElementById("passar").onmouseover=function(){
			 $("#infopass").toggle("slow");
			 $("#txtpassar").toggle("slow");		 
		};
		document.getElementById("passar").onmouseout=function(){
			 $("#infopass").toggle("fast");
			 $("#txtpassar").toggle("fast");
		};
		document.getElementById("passar").onmousedown=function(){
			preguntes[current].respostaUsuari.push("NS/NC");
			p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
			upTime(new Date());				
			sleep(500);
			current++;		
			}
	}
	//CONTADOR D'ERROR EN CAS DE NO PODER LLEGIR PREGUTNES
	if(document.getElementById("totalseconds").innerHTML=="5"&&preguntes.length<=0){
		document.getElementById("totalcountup").setAttribute("style", "display:none");
		ctx.clearRect(0, 0, width, height);
		document.getElementById("defaultCanvas0").style.border="2px solid black";
		estatdelsistema="error";
	}
	//DRAW PER A QUAN L'USUARI VULGUI ENVIAR
	if(estatdelsistema == "submit"){
		$( ".loader" ).css( "display", "none" );
		stateprint=creaSubmit(stateprint);
	}
	//DRAW PER A SI HI HAGUES UN ERROR
	if(estatdelsistema == "error"){
		$( ".loader" ).css( "display", "none" );
		document.getElementById("passar").setAttribute("style", "display:none");
		
		ctx.clearRect(0, 0, width, height);
		fill(255, 255, 0);
		textC("Error", innerHeight * .4, 30);
		textC("Algo no funciona bien", innerHeight * .5 + 45, 15);
		var bgImg = new Image();
		bgImg.onload = function(){
	    document.getElementById("defaultCanvas0").style.backgroundImage="url('"+bgImg.src+"')";
		};
		bgImg.src = "img/error.gif";	
	}
	push()
	fill(0+g*0.1, 204, 102);
	pop();
}
function mouseReleased(){
  mouseout = true;
}
//EVENTS
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
		let tip = e['gsx$tipus'].$t;
		let txtfot = e['gsx$disseny'].$t;
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
	var punt;  
	if(tip == "Swipe"){
		subpreguntes=[];
		categories=[];
		var left, down, right;	
		left = e[g+'resposta1'].$t;
		down = e[g+'resposta3'].$t;
		right= e[g+'resposta2'].$t;		
		if(left&&down&&right){ numopcions = 3;}		
		else if(left&&right){ numopcions = 2;}				
		if(!left && !right && ! down) return 0;					
		multichoice_gsx.forEach(element => {
			if(element.includes("resp")){
				if(e[g+element].$t!=""){
					subpreguntes.push(e[g+element].$t);
				}
			}
			if(element.includes("corr")){
				if(e[g+element].$t!=""){
					resp = e[g+element].$t;
				}
			}
			if(element.includes("cat")){
				if(e[g+element].$t!=""){
					categories.push(e[g+element].$t);
				}
			}
			if(element.includes("enun")){
				if(e[g+element].$t!=""){
					gran=e[g+element].$t;
				}
			}
			if(element.includes("punt")){
				if(e[g+element].$t!=""){
					punt=parseInt(e[g+element].$t, 10);
				}
			}
		});
		subpreguntes = [left, down, right];
		var p = new Pregunta(gran, subpreguntes, categories, numopcions, punt);
		p.tipologia = tip;
		p.disseny=txtfot;
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
			if(element.includes("corr")){
				if(e[g+element].$t!=""){
				resp = e[g+element].$t;
				}
			}
			if(element.includes("cat")){
				if(e[g+element].$t!=""){
				categories.push(e[g+element].$t);
				}
			}
			if(element.includes("enun")){
				if(e[g+element].$t!=""){
				gran=e[g+element].$t;
				}
			}
			if(element.includes("punt")){
				if(e[g+element].$t!=""){
					punt=parseInt(e[g+element].$t, 10);
				}
			}
		});
		respuestascorrectas = [];
		respuestascorrectas.push(e[g+'corr'].$t);
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, punt);
		p.tipologia = tip;
		p.disseny=txtfot;
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
			if(element.includes("corr")){
				if(e[g+element].$t!=""){
					resp = e[g+element].$t;
				}
			}
			if(element.includes("puntatje")){
				if(e[g+element].$t!=""){
					punt=parseInt(e[g+element].$t, 10);
				}
			}
		});
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, punt);
		p.tipologia = tip;
		p.respostes = resp;
		p.disseny=txtfot;
		preguntes.push(p);
	}
	if(tip == "Filtre" || tip == "Youtube"){
		var gran, subpreguntes = [], resp;
		gran="Funciona";
		subpreguntes="FuncionaSubP";
		resp="FuncionaResp";
		for(var i = 0; i < list_gsx.length; i++){
			let current = list_gsx[i];
			let ecurrent = e[g+current].$t;
			
			if(current.includes("enun") && ecurrent) gran = ecurrent;
			if(current.includes("punt")&& ecurrent) punt=ecurrent;
			subpreguntes = e[g+'url'].$t;
		}
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, punt);
		p.tipologia = tip;
		p.respostes = resp;
		preguntes.push(p);
		p.disseny=txtfot;
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
			if(element.includes("corr")){
				if(e[g+element].$t!=""){
					resp = e[g+element].$t;
				}
			}
			if(element.includes("cat")){
				if(e[g+element].$t!=""){
					categories.push(e[g+element].$t);
				}
			}
			if(element.includes("enun")){
				if(e[g+element].$t!=""){
					gran=e[g+element].$t;
				}
			}
			if(element.includes("punt")){
				if(e[g+element].$t!=""){
					punt=parseInt(e[g+element].$t, 10);
				}
			}
		});
		var p = new Pregunta(gran,subpreguntes, categories, numopcions, punt);
		p.tipologia = tip;
		p.respostes = resp;
		preguntes.push(p);
		p.disseny=txtfot;
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
			if(element.includes("corr")){
				resp = e[g+element].$t;
			}
			if(element.includes("punt")){
				if(e[g+element].$t!=""){
					punt=parseInt(e[g+element].$t, 10);
				}
			}
		});
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, punt);
		p.tipologia = tip;
		p.respostes = resp;
		preguntes.push(p);
		p.disseny=txtfot;
	}
	if(tip == "Busca"){
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
			if(element.includes("corr")){
				if(e[g+element].$t!=""){
					resp = e[g+element].$t;
				}
			}
			if(element.includes("puntatje")){
				if(e[g+element].$t!=""){
					punt=parseInt(e[g+element].$t, 10);
				}
			}
			
		});
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, punt);
		p.tipologia = tip;
		p.respostes = resp;
		preguntes.push(p);
		p.disseny=txtfot;
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
			if(element.includes("corr")){
				if(e[g+element].$t!=""){
					resp = e[g+element].$t;
				}
			}
			if(element.includes("puntatje")){
				if(e[g+element].$t!=""){
					punt=parseInt(e[g+element].$t, 10);
				}
			}
			
		});
		var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, punt);
		p.tipologia = tip;
		p.respostes = resp;
		preguntes.push(p);
		p.disseny=txtfot;
	}
}
//ELEMENTO QUE NOS PERMITE LEER LOS APARTADOS DE LOS DATOS DE TIPO JSON
//EN CASO DE AÑADIR UN NUEVO TIPO DE ELEMENTO, TAMBIEN SE TENDRA QUE AÑADIR ESE ELEMENTO AL MULTICHOICE
var multichoice_gsx = [
"enunciat",
"resposta1",
"resposta2",
'resposta3',
'resposta4',
'resposta5',
'cat1',
'cat2',
'cat3',
'cat4',
'cat5',
'url',
'corr',
'puntatje'];
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
