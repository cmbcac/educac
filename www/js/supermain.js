{
var canvas;
var ctx;
var estats = ["inici", "playing", "pause", "error", "submit"], estatdelsistema = "inici", missatgeerror = "";
var id_drive = "1nLZVoUA49YiSmf0ylFuOaTtB1V57yRrbDQO7pvr1TDs";   
//var id_drive = "1-mffQ9q0im5VIm7gukacIjUI4Hps-3-n9vmeMj42d_k";

var ESC = 27;
var SPACE = 32;
var ESQUERRA = 37;
var DRETA = 39;

var preguntes = [];
var current = 0;


// vars pel swipe
var backswipe;
var estatswipe = "nomig", estats_swipe = ["nomig", "migsense", "migamb", "dreta", "esquerra", "avall"];
var isubp = 0;

//vars pel drag;
var backdrag;
var isubp2 = 0;
var lastframemouse;


//vars per relacio
var estat="noclick";
var track=0;

//vars per filtre
var filtres = ["Blur","Brightness","Contrast","Grayscale","Invert","Opacity", "Saturate", "Sepia"];
var estat=-1;
var opcions;
var resposta;

//vars per ordenar
var ordre=["A- ","B- ","C- ","D- ","E- "]
var resp;
var respfin;

var sbmit;

var newlabel;
var namenewlabel;
var passar;
var boolpassar=false;;
var stateprint=true;


}

function preload(){
  //carrega base de dades
  util_xmlhttp(id_drive, set_preguntes,{}, function(){} )
  
}

function setup(){
  
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas = document.getElementById("defaultCanvas0");
  ctx=canvas.getContext('2d');
  backswipe =  color(144, 145, 232, 0.2*255);
  lastframemouse = mouseIsPressed;
  upTime(new Date());
  totalupTime(new Date());
  ctx.font = "30px Arial"
  
}

function draw(){

		//DRAW QUAN EL SISEMA ESTA EN INICI
		resp=document.getElementById("respostaescrita");
			
		resp.setAttribute('style', 'display:none');
		
		if(estatdelsistema == "inici" ){

			var g = 202.5 + (Math.sin(frameCount/100) * 52.5);
			background(10, g, 255);
			textC("Inici", innerHeight * .5, 30);
				if(((preguntes.length == 0) || (preguntes == undefined))){
					textC("No hi ha preguntes disponibles", innerHeight * .5 + 45, 15);
				}
				else{
					textC("Clica o prem X per començar", innerHeight * .5 + 45, 15);
				}
				
				if(mouseIsPressed){
					estatdelsistema="playing";
				}
		}

			//DRAW QUAN EL SISTEMA ESTIGUI EN PAUSA
		
		if(estatdelsistema == "pause"){
    
			background(199, 233, 222);
			textC("Pausa", innerHeight * .5, 30);
			textC("Prem espai o enter per seguir", innerHeight * .5 + 45, 15);

				if(preguntes.length > 0){
					textC("PREGUNTA: " + (current+1), innerHeight * .5 + 100, 20);
					
				}
	
	
		}

		if(preguntes.length > 0 && estatdelsistema == "playing"){
			
			if(current>=preguntes.length){
				estatdelsistema="submit";
			}
			else{

				document.getElementById("passar").setAttribute("style", "display:inline");
				
				var p = preguntes[current];
				var tipo = p.tipologia;
				g = Math.cos(frameCount/70)*100;

				
		//DRAW PER A CADA ESTAT DEL JOC
			
				if(tipo == "Opció múltiple"){
     
					opcio_multiple(p, g)
				}

				else if(tipo == "Swipe"){
				
				swipe(p,g);
			
			    }

				else if(tipo == "Drag-categories"){
     
					drag(p,g);

				}
 
				else if(tipo == "Filtre"){
							
				filtre(p,g);
				
				}
					
				else if(tipo == "Relació"){
				
					relacio(p,g);
				
				}
		
				else if(tipo == "Ordenar"){
			
					ordenar(p,g);
				
				}
			
				
			}
			
			document.getElementById("passar").onmouseover=function(){
				 $("#infopass").toggle("slow");
				 $("#txtpassar").toggle("slow");
				 
			};
			document.getElementById("passar").onmousedown=function(){
		
				preguntes[current].respostaUsuari.push("No s'ha respòs");
				p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
				upTime(new Date());
							
				sleep(500);
				
				current++;
				
				
			}
		}
		


		//DRAW PER A QUAN L'USUARI VULGUI ENVIAR
		if(estatdelsistema == "submit"){
			stateprint=creaSubmit(stateprint);
		}
		//DRAW PER A SI HI HAGUES UN ERROR
		if(estatdelsistema == "error"){
			document.getElementById("passar").setAttribute("style", "display:none");
			background(199, 100, 100);
	
				textC("Error", innerHeight * .5, 30);
				textC("Clica espai o enter per anar a pausa i canviar de pregunta", innerHeight * .5 + 45, 15);
				textC(missatgeerror, innerHeight * .5 + 125, 13);
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
    let list_gsx = multichoice_gsx;
    afegir_pregunta(tip, e, list_gsx);
  }

}

function afegir_pregunta(tip, e,list_gsx){
  var g = 'gsx$';
  var gran;
  var subpreguntes;
  var categories;
  var numopcions;
  var resp;
  
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
		});
		
		subpreguntes = [left, down, right];
		
		var p = new Pregunta(gran, subpreguntes, categories, numopcions, Math.floor(random(100)));
		
		p.tipologia = tip;
		
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
		});
    
		respuestascorrectas = [];
		respuestascorrectas.push(e[g+'corr'].$t);
    
		var p = new Pregunta(gran, subpreguntes, categories, 5, Math.floor(random(100)));
		p.tipologia = tip;
		
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
      if(element.includes("resp")){
		  if(e[g+element].$t!=""){
				resp = e[g+element].$t;
		  }
      }
    });
    var p = new Pregunta(gran, subpreguntes, subpreguntes.length, Math.floor(random(100)));
    p.tipologia = tip;
    p.respostes = resp;
    preguntes.push(p);

  }

  if(tip == "Filtre"){
	var gran, subpreguntes = [], resp;
    gran="Funciona";
	subpreguntes="FuncionaSubP";
	resp="FuncionaResp";

	for(var i = 0; i < list_gsx.length; i++){
			let current = list_gsx[i];
			let ecurrent = e[g+current].$t;
			
			if(current.includes("enun") && ecurrent) gran = ecurrent;
			subpreguntes = e[g+'url'].$t;
	}
    var p = new Pregunta(gran, subpreguntes, subpreguntes.length, Math.floor(random(100)));
    p.tipologia = tip;
    p.respostes = resp;
    preguntes.push(p);
	

  }
 
  if(tip== "Relació"){
	var numopcions=0;
	var subpreguntes = [], resp;
	categories = [];
		
		
		
		multichoice_gsx.forEach(element => {
			if(element.includes("resp")){
					if(e[g+element].$t!=""){
					subpreguntes.push(e[g+element].$t);
					numopcions++;
					}
			}
			if(element.includes("corr")){
				resp = e[g+element].$t;
			}
			if(element.includes("cat")){
				categories.push(e[g.element].$t);
			}
    });
    var p = new Pregunta(categories, subpreguntes, numopcions, Math.floor(random(100)));
    p.tipologia = tip;
    p.respostes = resp;
    preguntes.push(p);
  
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
      if(element.includes("resp")){
        resp = e[g+element].$t;
      }
    });
    var p = new Pregunta(gran, subpreguntes, subpreguntes.length, Math.floor(random(100)));
    p.tipologia = tip;
    p.respostes = resp;
    preguntes.push(p);

  }
 }

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
'corr'];

function sleep(milliseconds) {
 
  var start = new Date().getTime();
  
  for (var i = 0; i < 1e7; i++) {
	  
    if ((new Date().getTime() - start) > milliseconds){
	 
      break;
    }
	
  }
}

class Pregunta{
	constructor(gran, subpreguntes, categories, numopcions, nump, date){
		this.gran = gran;
		this.subpreguntes = subpreguntes;
		this.categories = categories
		this.numopcions = numopcions;
		this.numero = nump;
		this.respostaUsuari = [];
		this.date=date;
	}
}
