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
  canvas.style.borderRadius = "15px";
  canvas.style.border="2px solid";
  ctx=canvas.getContext('2d');
  backswipe =  color(144, 145, 232, 0.2);
  lastframemouse = mouseIsPressed;
 
  ctx.font = "30px Arial"
  
}

function draw(){

		resp=document.getElementById("respostaescrita");
		resp.setAttribute('style', 'display:none');
		
		//DRAW QUAN EL SISEMA ESTA EN INICI
		if(estatdelsistema == "inici" ){

			var g = 202.5 + (Math.sin(frameCount/100) * 52.5);
			background(255,255,255,0.5);
			
						if(start==true){
						var newdiv= document.createElement("div");
						newdiv.id="StartingDiv";
						document.body.appendChild(newdiv);
					
						newinput= document.createElement("input");
						newinput.id="url"
						newinput.type="url";
						newinput.classList.add('ginput');
						newinput.placeholder="URL del cuestionario: ";
						document.getElementById(newdiv.id).appendChild(newinput);
						
						newinput= document.createElement("input");
						newinput.id="sendurl"
						newinput.classList.add('ginput');
						newinput.placeholder="Dónde guardar las respuestas: ";
						document.getElementById(newdiv.id).appendChild(newinput);
						
						
						start=false;
						
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
					
						
							document.getElementById("StartingDiv").setAttribute("style", "display:none");
							background(10, g, 255);
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
    
			background(199, 233, 222);
			textC("Pausa", innerHeight * .5, 30);
			textC("Pulsa espacio o enter para seguir", innerHeight * .5 + 45, 15);

				if(preguntes.length > 0){
					textC("PREGUNTA: " + (current+1), innerHeight * .5 + 100, 20);
					
				}
	
	
		}
		
		//DRAW QUAN EL SISTEMA ESTA JUGANT
		if(preguntes.length > 0 && estatdelsistema == "playing"){
			
			document.getElementById("totalcountup").setAttribute("style","display:block");
			if(current>=preguntes.length){
				
				estatdelsistema="submit";
			}
			else{

				document.getElementById("passar").setAttribute("style", "display:inline");
				
				var p = preguntes[current];
				
				var tipo = p.tipologia;
				g = Math.cos(frameCount/70)*100;
				ctx.fillStyle = "#999999";
				
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
			
				else if(tipo == "Busca"){
				
					buscador(p,g);
				
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
			estatdelsistema="error";
		
		}
		
		//DRAW PER A QUAN L'USUARI VULGUI ENVIAR
		if(estatdelsistema == "submit"){
			stateprint=creaSubmit(stateprint);
		}
		
		//DRAW PER A SI HI HAGUES UN ERROR
		if(estatdelsistema == "error"){
			document.getElementById("passar").setAttribute("style", "display:none");
			
				textC("Error", innerHeight * .4, 30);
				textC("Algo no funciona bien", innerHeight * .5 + 45, 15);
				document.getElementById("defaultCanvas0").style.backgroundImage="url('img/error.gif')";
			
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

//LA FUNCIÓ D'AFEGIR PREGUNTA ES LLEGIR ELS ELEMENTS DE TIPUS JSON QUE ESTEM REBENT I TRANSFORMAR-LOS EN STRINGS A DINS
//DE LA ESTRUCTURA DE PERGUNTES DE LA MANERA QUE VOLGUEM, EN CAS D'AFEGIR UN NOU TIPUS DE PREGUNTA NECESSITARÁ SER ESPECIFICAT
//A DINS D'AQUESTA FUNCIÓ
function afegir_pregunta(tip, e,list_gsx){
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
			if(current.includes("punt")&& ecurrent) punt=ecurrent;
			subpreguntes = e[g+'url'].$t;
	}
    var p = new Pregunta(gran, subpreguntes, categories, subpreguntes.length, punt);
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
  
  }
 }

//ELEMENT QUE ENS PERMET LLEGIR ELS APARTATS DE LES DADES TIPUS JSON
//EN CAS D'AFEGIR UN NOU TIPUS D'ELEMENT, TAMBÉ S'HAURÀ D'AFEGIR EN AQUEST ELEMENT MULTICHOICE
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

//NO ES RECOMANABLE, PERO AQUESTA FUNCIÓ OCUPA A L'ORDINADOR X MILISEGONS PER A PERMETRE QUE ELS EVENTS COM MOUSEISPRESSED O KEYPRESSED S'ACTUALITZIN CORRECTAMENT
function sleep(milliseconds) {
 
  var start = new Date().getTime();
  
  for (var i = 0; i < 1e7; i++) {
	  
    if ((new Date().getTime() - start) > milliseconds){
	 
      break;
    }
	
  }
}

//STRUCT DE TIPUS PREGUNTES
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
