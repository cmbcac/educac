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
var filtres = ["blur","brightness","contrast","grayscale","invert","opacity", "saturate", "sepia"];
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
					textC("Prem X per començar", innerHeight * .5 + 45, 15);
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
				g = 202.5 + (Math.sin(frameCount/100) * 100);

	
		//DRAW PER A CADA ESTAT DEL JOC
			
			
				if(tipo == "Opció múltiple"){
     
				background(50, 112, g);
				textSize(20);
				
				let half1 = innerWidth * .5
				let half2 = textWidth(p.gran) * .5;
				let height1 = innerHeight*.40;
				
				textC2(p.gran, half1, height1, 20);
      
				if(p.subpreguntes.length > 0){
					for(var i = 0; i < p.subpreguntes.length; i++){
						
						let e = p.subpreguntes[i];
							if( e == "") continue;
								
						let fontsize = 20;
						textSize(fontsize);
						let half3 = textWidth(e)*.5;
						let posx = half1 - 50;
						let posy = height1 + 40 * (i+1);
						let w =  textWidth(e)
						let h = fontsize;

						push();
		  
								if(mouseX > posx && mouseX < posx+w && mouseY > (posy-14) && mouseY < (posy-14+h)){

										fill(255,244, 123);
										if(mouseIsPressed){
			  
											preguntes[current].respostaUsuari.push(e);
											p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
											upTime(new Date());
											sleep(500);
											current++;
											
											 
										}
								}
		
						ellipse(posx - 10, posy - 5, 6, 6);
						text(e, posx, posy );
						pop();

					}
				}
			}

				else if(tipo == "Swipe"){
				
				background(255, 255, 255);
				
				try{
					if(p.numopcions != 2 && p.numopcions != 3) throw("El numero de opcions hauria de ser 2 o 3");

						push();
						textSize(14);
						text(p.opcions[0], quarterwidth, quarterheight2);
						text(p.opcions[2], quarterwidth3, quarterheight2);
						if(p.numopcions <= 3) text(p.opcions[1], innerWidth/2 - textWidth(p.opcions[1])/2, quarterheight3);
		  
						pop();
						let w = textWidth(p.subpreguntes[isubp]);
						let h = textHeight(p.subpreguntes[isubp], w);
						w+=40;
						h+=20;
		 
	
						let dinsw = entre(mouseX, quarterwidth2 - w*.5, quarterwidth2 + w*.5);
		 
						let dinsh = entre(mouseY, quarterheight2 - h*.5, quarterheight2 + h*.5);
	
	
							//AQUI DEFINIM ELS ESTATS DEL SWIPE SIGUIN TALS:
							//NOMIG = el quadrat es posiciona al mig sense interaccio del ratolí
							//MIGSENSE = el quadrat reacciona al ratolí quan li passa per sobre, pero no es mou
							//MIGAMB = el quadrat segueix el ratolí
							//esquerra, dreta i avall = posicions finals del quadrat, signifiquen que l'usuari ha respòs
	
					if(dinsw && dinsh && estatswipe == "nomig"){
						estatswipe = "migsense";
					}
					if(dinsw && dinsh && estatswipe == "migsense" && mouseIsPressed){
						estatswipe = "migamb";
					}		
					if((!dinsw || !dinsh ) && estatswipe == "migsense"){
						estatswipe = "nomig";
					}
					if(!mouseIsPressed && estatswipe == "migamb"){
						estatswipe="nomig";
					}
					if(entre(mouseX, 0, quarterwidth) && estatswipe == "migamb") {
						estatswipe = "esquerra";
					}
					if(entre(mouseX, quarterwidth3, innerWidth) && estatswipe == "migamb"){
						estatswipe = "dreta";
					}
					if(entre(mouseX, quarterwidth2, innerWidth)&&entre(mouseY,quarterheight3,innerHeight)&& estatswipe=="migamb"){
						estatswipe="avall";
					}
		  		  
							//AQUI DEFINIM EL QUÈ FA CADA ESTAT
		  
					if( estatswipe == "nomig"){
						
						rectC(quarterwidth2, quarterheight2, w , h );

						textC(p.subpreguntes[isubp], quarterheight2, 20);
					}
					if( estatswipe == "migsense"){
			  
						push();
						fill(200,200,234, 0.5*255);
						rectC(quarterwidth2, quarterheight2, w , h);
						pop();
						textC(p.subpreguntes[isubp], quarterheight2, 20);
					}		
					if( estatswipe == "migamb" || estatswipe == "dreta" || estatswipe == "esquerra"||estatswipe=="avall"){
        
						push();
						let c1, percent;
							from = color(255, 255, 255, 0.2 * 255);
								to = color(255, 0, 0, 0.2 * 255);
								to2 = color(0, 255, 0, 0.2 * 255);
								to3 = color(0, 0, 255, 0.2*255);
					
						if(p.numopcions>=3){
							if(mouseX < quarterwidth2&&mouseY <= innerHeight/2){
								percent = 10 - (mouseX - quarterwidth) / quarterwidth;
								c1 = lerpColor(from, to, percent);
							}
							if(mouseX > quarterwidth2&&mouseY <= innerHeight/2){
								percent = 10 + (mouseX - quarterwidth2) / quarterwidth;
								c1 = lerpColor(from, to2, percent);
							}
							if(mouseX == quarterwidth2&&mouseY <= innerHeight/2){
								c1 = color(255);
							}
							if(mouseY > innerHeight/2){
								percent = 10- (mouseY-quarterheight)/quarterheight;
								c1 = lerpColor(from,to3,percent);
							}
						}else{
					
							if(mouseX < quarterwidth2){
								percent = 10 - (mouseX - quarterwidth) / quarterwidth;
								c1 = lerpColor(from, to, percent);
							}
							if(mouseX > quarterwidth2){
								percent = 10 + (mouseX - quarterwidth2) / quarterwidth;
								c1 = lerpColor(from, to2, percent);
							}
							if(mouseX == quarterwidth2){
								c1 = color(255);
							}
						}
						
						
				background(c1);
				pop();
			}
					if( estatswipe == "migamb"){
						push();
						fill(150,150,150);
						rectC(mouseX, mouseY, w*0.01 , h*0.1);
						pop();
						
					}
					if( estatswipe == "esquerra"){
					
						preguntes[current].respostaUsuari.push(p.opcions[0]);
					}
					if( estatswipe == "dreta"){
						preguntes[current].respostaUsuari.push(p.opcions[2]);
					}
					if( estatswipe == "avall"){
						preguntes[current].respostaUsuari.push(p.opcions[1]);
					}
					if( estatswipe == "dreta" || estatswipe == "esquerra"||estatswipe=="avall"){
			  
						isubp+=1;
						estatswipe = "nomig";
						mouseX=innerWidth/2;
						mouseY=innerHeight/2;
						if(isubp == p.subpreguntes.length){
							isubp = 0;
							p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
							upTime(new Date());
							sleep(500);
							current+=1;
							 
						}
					}
		  
		 
				}		
				catch(error){
        console.log(error);
        missatgeerror = error;
        estatdelsistema = "error";
      }
				textC(p.gran, quarterheight , 23);
			}

				else if(tipo == "Drag-categories"){
     
					background(190, 210, 190);
					
						let numopcions = p.numopcions;
						textC("Organitza les opcions amb la categoria que més t'agradi", innerHeight*0.1,40);
						textC(p.subpreguntes[isubp2], quarterheight2, 23);
						try{
							if(numopcions == 2){
		
								var puntsx=[window.innerWidth*0.35,window.innerWidth*0.65];
								var puntsy=[window.innerHeight*0.5,window.innerHeight*0.5];

  
								for(var i = 0; i < puntsx.length; i++){
									let x = puntsx[i];
									let y = puntsy[i];
								let dins = dist(x, y, mouseX, mouseY) < 100;
									push()
								if(dins && mouseIsPressed && !lastframemouse){
									isubp2++;
										if(isubp2 == p.subpreguntes.length){
											preguntes[current].respostaUsuari.push(p.gran[i]);
											isubp2 = 0;
											p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
											upTime(new Date());
											sleep(500);
											current++;
											 
				
										}
								}
								if(dins && !mouseIsPressed && !lastframemouse){
									fill(100,200,200);
								}
								else{
									fill(255);
								}

						ellipse(x, y, 100);
						pop();
			
						textC2(p.gran[i], x, y, 11);
          }
		
		}
							else if(numopcions == 3){
		  
								var puntsx=[window.innerWidth*0.5,window.innerWidth*0.35,window.innerWidth*0.65];
								var puntsy=[window.innerHeight*0.25,window.innerHeight*0.65,window.innerHeight*0.65];
								push();
								ellipse(window.innerWidth*0.5, window.innerHeight*0.25,100);
								pop();
								push();
								ellipse(window.innerWidth*0.35, window.innerHeight*0.65,100);
								pop();
								push();
								ellipse(window.innerWidth*0.65, window.innerHeight*0.65,100);
								pop();
		  
		  
								for(var i = 0; i < puntsx.length; i++){
								
									let x = puntsx[i];
									let y = puntsy[i];
									let dins = dist(x, y, mouseX, mouseY) < 100;
									push()
									if(dins && mouseIsPressed && !lastframemouse){
									
										isubp2++;
										if(isubp2 == p.subpreguntes.length){
											preguntes[current].respostaUsuari.push(p.gran[i]);
											isubp2 = 0;
											p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
											upTime(new Date());
											sleep(500);
											current++;
											 
				
										}	
									}
									if(dins && !mouseIsPressed && !lastframemouse){
										fill(100,200,200);
									}
									else{
										fill(255);
									}

									ellipse(x, y, 100);
									pop();
			
									textC2(p.gran[i], x, y, 11);
								}
		
							}
							else if(numopcions == 4){
			
								var puntsx=[window.innerWidth*0.35,window.innerWidth*0.35,window.innerWidth*0.65,window.innerWidth*0.65];
								var puntsy=[window.innerHeight*0.25,window.innerHeight*0.65,window.innerHeight*0.25,window.innerHeight*0.65];
		  
		  
		  
								for(var i = 0; i < puntsx.length; i++){
									
									let x = puntsx[i];
									let y = puntsy[i];
									let dins = dist(x, y, mouseX, mouseY) < 100;
									push()
									if(dins && mouseIsPressed && !lastframemouse){
             
										isubp2++;
										if(isubp2 == p.subpreguntes.length){
											preguntes[current].respostaUsuari.push(p.gran[i]);
											isubp2 = 0;
											p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
											upTime(new Date());
											sleep(500);
											current++;
											 
										}
									}
									if(dins && !mouseIsPressed && !lastframemouse){
										fill(100,200,200);
									}
									else{
										fill(255);
									}

									ellipse(x, y, 100);
									pop();
			
									textC2(p.gran[i], x, y, 11);
								}
		  
							}
							else if(numopcions == 5){
          
								var posipunts;
								var rad = innerWidth*0.15;
								var radiusellipse = innerWidth*0.1;
								var angleinicial =0;
          
								posipunts = returnPointsInPolygon(quarterwidth2, quarterheight2, rad, numopcions, radiusellipse, angleinicial);
								for(var i = 0; i < posipunts.length; i++){
									
									let x = posipunts[i].x;
									let y = posipunts[i].y;
									let dins = dist(x, y, mouseX, mouseY) < radiusellipse/2;
									push()
									if(dins && mouseIsPressed && !lastframemouse){
										var rsp=p.gran[i];
										preguntes[current].respostaUsuari.push(rsp);
										isubp2++;
										if(isubp2 == p.subpreguntes.length){
											
											isubp2 = 0;
											p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
											upTime(new Date());
											current++;
											 
				
										}
									}
									if(dins && !mouseIsPressed && !lastframemouse){
										fill(100,200,200);
									}
									else{
										fill(255);
									}

									ellipse(x, y, radiusellipse);
									pop();
									textC2(p.gran[i], x, y, 11);

								}
							}
						}
						catch(error){
							console.log(error);
							missatgeerror = error;
							estatdelsistema = "error";
						}
					lastframemouse = mouseIsPressed;

			}
 
				else if(tipo == "Filtre"){
							
				background(50, 112, 255);
				
				
				var image1=new Image();
				image1.src = p.subpreguntes;
				ctx.drawImage(image1,innerWidth*0.15, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
				
				textSize(20);
		
					let half1 = innerWidth * .5
					let half2 = textWidth(p.gran) * .5;
					let height1 = innerHeight*.50;
      
					text(p.gran, half1-half2, height1-200);
					rect(innerWidth*0.53-25, innerHeight/2-25, innerWidth*0.07,innerHeight*0.07,15);
					textC2("RESET",innerWidth*0.55, innerHeight/2+8,20);
					rect(innerWidth*0.42-25, innerHeight/2-25, innerWidth*0.07,innerHeight*0.07,15);
					textC2("DONE",innerWidth*0.44, innerHeight/2+8,20);

					var puntsx=[];
				    var puntsy=[];
								
								for(var i=0;i<8;i++){
								
									if(i<4){
									
										puntsx.push(innerWidth*0.33+150*i);
										puntsy.push(innerHeight*0.7);
									
									}else{
									
										puntsx.push(innerWidth*0.33+150*(i-4));
										puntsy.push(innerHeight*0.85);
									}
								
								}
								for(var i = 0; i < puntsx.length; i++){
									let x = puntsx[i];
									let y = puntsy[i];
								let dins = dist(x, y, mouseX, mouseY) < 50;
									push()
								if(dins && mouseIsPressed){
									
									if(i==0){
										estat=0;
										opcions=0;
									}
									if(i==1){
										estat=1;
										opcions=0;
									}
									if(i==2){
										estat=2;
										opcions=0;
									}
									if(i==3){
										estat=3;
										opcions=0;
									}
									if(i==4){
										estat=4;
										opcions=0;
									}
									if(i==5){
										estat=5;
										opcions=0;
									}
									if(i==6){
										estat=6;
										opcions=0;
									}
									if(i==7){
										estat=7;
										opcions=0;
									}
									
								}
								if(dins && !mouseIsPressed){
									fill(100,200,200);
									
								}
								else{
									fill(255);
								}
								rectC(x, y, innerWidth*0.1,innerHeight*0.1);
								pop();
								textC2(filtres[i], x, y, 11);
								}
								
								if(estat==0){

									push();
										
										rectC(innerWidth*0.8, innerHeight*0.6,50,50);
										textC2("1px",innerWidth*0.8, innerHeight*0.6+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
										textC2("5px",innerWidth*0.8, innerHeight*0.6+100+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
										textC2("10px",innerWidth*0.8, innerHeight*0.6+200+5,15);
										
										
										
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6)-25, (innerHeight*0.6)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6,50,50);
												
												pop();
												textC2("1px",innerWidth*0.8, innerHeight*0.6+8,20);
												
												if(mouseIsPressed){
													opcions=1;
													
												
												}
									
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+100)-25, (innerHeight*0.6+100)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
											
												pop();
												textC2("5px",innerWidth*0.8, innerHeight*0.6+100+8,20);
												
												if(mouseIsPressed){
													opcions=2;
												
												}
												
												
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+200)-25, (innerHeight*0.6+200)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
											
												pop();
												textC2("10px",innerWidth*0.8, innerHeight*0.6+200+5,15);
												
												if(mouseIsPressed){
													opcions=3;;
												
												}
												
										}
										
										if(opcions==0){
											 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
											pop();
											
											
											
										}
										if(opcions==1){
													ctx.filter= 'blur(1px)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													
													resposta="blur, 1px";
										}
										if(opcions==2){
											ctx.filter= 'blur(5px)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="blur, 5px";
										}
										if(opcions==3){
											ctx.filter= 'blur(10px)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="blur, 10px";
										}
								}
								if(estat==1){
										push();
										rectC(innerWidth*0.8, innerHeight*0.6,50,50);
										textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
										textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
										textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
										
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6)-25, (innerHeight*0.6)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6,50,50);
												
												pop();
												textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
												
												if(mouseIsPressed){
													opcions=1;
													
												
												}
									
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+100)-25, (innerHeight*0.6+100)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
											
												pop();
												textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
												
												if(mouseIsPressed){
													opcions=2;
												
												}
												
												
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+200)-25, (innerHeight*0.6+200)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
											
												pop();
												textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
												
												if(mouseIsPressed){
													opcions=3;;
												
												}
												
										}
										
										if(opcions==0){
											 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
											pop();
										}
										if(opcions==1){
											ctx.filter= 'brightness(10%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="brightness, 10%";
										}
										if(opcions==2){
											ctx.filter= 'brightness(50%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="brightness, 50%";
										}
										if(opcions==3){
											ctx.filter= 'brightness(100%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="brightness, 100%";
										}
										
										
								}
								if(estat==2){
										push();
										rectC(innerWidth*0.8, innerHeight*0.6,50,50);
										textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
										textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
										textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
										
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6)-25, (innerHeight*0.6)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6,50,50);
												
												pop();
												textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
												
												if(mouseIsPressed){
													opcions=1;
													
												
												}
									
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+100)-25, (innerHeight*0.6+100)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
											
												pop();
												textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
												
												if(mouseIsPressed){
													opcions=2;
												
												}
												
												
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+200)-25, (innerHeight*0.6+200)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
											
												pop();
												textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
												
												if(mouseIsPressed){
													opcions=3;;
												
												}
												
										}
										
										if(opcions==0){
											 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
											pop();
										}
										if(opcions==1){
											ctx.filter= 'contrast(10%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="contrast, 10%";
										}
										if(opcions==2){
											ctx.filter= 'contrast(50%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="contrast, 50%";
										}
										if(opcions==3){
											ctx.filter= 'contrast(100%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="brightness, 100%";
										}
								}
								if(estat==3){
										push();
										rectC(innerWidth*0.8, innerHeight*0.6,50,50);
										textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
										textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
										textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
										
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6)-25, (innerHeight*0.6)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6,50,50);
												
												pop();
												textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
												
												if(mouseIsPressed){
													opcions=1;
													
												
												}
									
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+100)-25, (innerHeight*0.6+100)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
											
												pop();
												textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
												
												if(mouseIsPressed){
													opcions=2;
												
												}
												
												
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+200)-25, (innerHeight*0.6+200)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
											
												pop();
												textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
												
												if(mouseIsPressed){
													opcions=3;;
												
												}
												
										}
										
										if(opcions==0){
											 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
											pop();
										}
										if(opcions==1){
											ctx.filter= 'grayscale(10%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="grayscale, 10%";
										}
										if(opcions==2){
											ctx.filter= 'grayscale(50%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="grayscale, 50%";
										}
										if(opcions==3){
											ctx.filter= 'grayscale(100%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="grayscale, 100%";
										};	
								}
								if(estat==4){
										push();
										rectC(innerWidth*0.8, innerHeight*0.6,50,50);
										textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
										textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
										textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
										
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6)-25, (innerHeight*0.6)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6,50,50);
												
												pop();
												textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
												
												if(mouseIsPressed){
													opcions=1;
													
												
												}
									
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+100)-25, (innerHeight*0.6+100)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
											
												pop();
												textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
												
												if(mouseIsPressed){
													opcions=2;
												
												}
												
												
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+200)-25, (innerHeight*0.6+200)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
											
												pop();
												textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
												
												if(mouseIsPressed){
													opcions=3;;
												
												}
												
										}
										
										if(opcions==0){
											 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
											pop();
										}
										if(opcions==1){
											ctx.filter= 'invert(10%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="invert, 10%";
										}
										if(opcions==2){
											ctx.filter= 'invert(50%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="invert, 50%";
										}
										if(opcions==3){
											ctx.filter= 'invert(100%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="invert, 100%";
										}	
								}
								if(estat==5){
										push();
										rectC(innerWidth*0.8, innerHeight*0.6,50,50);
										textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
										textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
										textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
										
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6)-25, (innerHeight*0.6)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6,50,50);
												
												pop();
												textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
												
												if(mouseIsPressed){
													opcions=1;
													
												
												}
									
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+100)-25, (innerHeight*0.6+100)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
											
												pop();
												textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
												
												if(mouseIsPressed){
													opcions=2;
												
												}
												
												
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+200)-25, (innerHeight*0.6+200)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
											
												pop();
												textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
												
												if(mouseIsPressed){
													opcions=3;;
												
												}
												
										}
										
										if(opcions==0){
											 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
											pop();
										}
										if(opcions==1){
											ctx.filter= 'opacity(10%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="opacity, 10%";
										}
										if(opcions==2){
											ctx.filter= 'opacity(50%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="opacity, 50%";
										}
										if(opcions==3){
											ctx.filter= 'opacity(100%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="opacity, 100%";
										}
								}
								if(estat==6){
										push();
										rectC(innerWidth*0.8, innerHeight*0.6,50,50);
										textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
										textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
										textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
										
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6)-25, (innerHeight*0.6)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6,50,50);
												
												pop();
												textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
												
												if(mouseIsPressed){
													opcions=1;
													
												
												}
									
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+100)-25, (innerHeight*0.6+100)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
											
												pop();
												textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
												
												if(mouseIsPressed){
													opcions=2;
												
												}
												
												
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+200)-25, (innerHeight*0.6+200)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
											
												pop();
												textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
												
												if(mouseIsPressed){
													opcions=3;;
												
												}
												
										}
										
										if(opcions==0){
											 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
											pop();
										}
										if(opcions==1){
											ctx.filter= 'saturate(10%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="saturate, 10%";
										}
										if(opcions==2){
											ctx.filter= 'saturate(50%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="saturate, 10%";
										}
										if(opcions==3){
											ctx.filter= 'saturate(100%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="saturate, 100%";
										}
								}
								if(estat==7){
										push();
										rectC(innerWidth*0.8, innerHeight*0.6,50,50);
										textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
										textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
										rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
										textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
										
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6)-25, (innerHeight*0.6)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6,50,50);
												
												pop();
												textC2("10%",innerWidth*0.8, innerHeight*0.6+8,20);
												
												if(mouseIsPressed){
													opcions=1;
													
												
												}
									
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+100)-25, (innerHeight*0.6+100)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+100,50,50);
											
												pop();
												textC2("50%",innerWidth*0.8, innerHeight*0.6+100+8,20);
												
												if(mouseIsPressed){
													opcions=2;
												
												}
												
												
										}
										if(entre(mouseX, (innerWidth*0.8)-25, (innerWidth*0.8)+25)&&entre(mouseY, (innerHeight*0.6+200)-25, (innerHeight*0.6+200)+25)){
												push();
									
												fill(40,200,200);
												rectC(innerWidth*0.8, innerHeight*0.6+200,50,50);
											
												pop();
												textC2("100%",innerWidth*0.8, innerHeight*0.6+200+5,15);
												
												if(mouseIsPressed){
													opcions=3;;
												
												}
												
										}
										
										if(opcions==0){
											 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
											pop();
										}
										if(opcions==1){
											ctx.filter= 'sepia(10%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="sepia, 10%";
										}
										if(opcions==2){
											ctx.filter= 'sepia(50%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="sepia, 50%";
										}
										if(opcions==3){
											ctx.filter= 'sepia(100%)';
													 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
													pop();
													resposta="sepia, 100%";
										}	
								}
								if(estat==-1){ 
									 ctx.drawImage(image1,innerWidth*0.65, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
									 reposta="nothing";
								}
								if(estat==-2){
									preguntes[current].respostaUsuari.push(resposta);
									p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
									upTime(new Date());
									sleep(500);
									current++;
									 
									
								
								}
								if(entre(mouseX, innerWidth*0.53-25, innerWidth*0.53+75)&&entre(mouseY, innerHeight/2-25, innerHeight/2+25)){
									push();
									
									fill(40,200,200);
										rect(innerWidth*0.53-25, innerHeight/2-25, innerWidth*0.07,innerHeight*0.07,15);
									
									pop();
									textC2("RESET",innerWidth*0.55, innerHeight/2+8,20);
									
									if(mouseIsPressed){
									estat=-1;
									
									}
								}
								if(entre(mouseX, innerWidth*0.42-25, innerWidth*0.42+75)&&entre(mouseY, innerHeight/2-25, innerHeight/2+25)){
									push();
									
									fill(40,200,200);
									rect(innerWidth*0.42-25, innerHeight/2-25, innerWidth*0.07,innerHeight*0.07,15);
									
									
									pop();
									textC2("DONE",innerWidth*0.44, innerHeight/2+8,20);
									
									if(mouseIsPressed){
									estat=-2;
									
									}
								}
	
			}
					
				else if(tipo == "Relació"){
				
				background(50, 112, g);
				
				textC("Relaciona els conceptes", innerHeight*0.1,40);
				textSize(20);
				
				let half1 = innerWidth * .15
				let half2 = innerWidth * .85
				let height1 = innerHeight*.40;
				
				if(p.numopcions > 0){
					
						var e = p.subpreguntes[track];
								
						let fontsize = 20;
						textSize(fontsize);
						
						let x = half1 - 50;
						let y = innerHeight/2 ;
						let w =  textWidth(e)
						let h = fontsize;

						push();
		  
								if((mouseX > x && mouseX < x+w && mouseY > (y-14) && mouseY < (y-14+h))&&!mouseIsPressed){

										fill(255,244, 123);
										estat="noclick";
										
								}
								if(mouseIsPressed&&(mouseX > x && mouseX < x+w && mouseY > (y-14) && mouseY < (y-14+h))){
											
												estat="click";
											
											
								}
								if(!mouseIsPressed){
									estat="noclick";
								}
								if(estat=="click"){
									
									line(x+w , y, mouseX, mouseY);
									
								}
		
						ellipse(x + 10 + w, y - 5, 6, 6);
						text(e, x, y );
						
						pop();

				}
			
				if(p.gran.length > 0){
					for(var i = 0; i < p.gran.length; i++){
						
						let e = p.gran[i];
							if( e == "") continue;
								
						let fontsize = 20;
						textSize(fontsize);
						let half3 = textWidth(e)*.5;
						let x = half2-textWidth(e)/2;
						let y = height1 + 40 * (i+1);
						let w =  textWidth(e)
						let h = fontsize;
						
						push();
		  
								if(mouseX > x && mouseX < x+w && mouseY > (y-14) && mouseY < (y-14+h)){

										fill(255,244, 123);
									    
										if(mouseIsPressed&&estat=="click"){
											
											if(track<p.numopcions-1){
												preguntes[current].respostaUsuari.push(e);
												track++;
												estat="noclick";
											}else{
											
											preguntes[current].respostaUsuari.push(e);
											p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
											upTime(new Date());
											sleep(500);
											current++;
											 
											}
											
										}
										
								}
		
						ellipse(x - 10, y - 5, 6, 6);
						text(e, x, y );
						pop();

					}
				}
			
			}
		
				else if(tipo == "Ordenar"){
			
				background(50, 112, g);
				textSize(20);
			
				let half1 = innerWidth * .5
				let half2 = textWidth(p.gran) * .5;
				let height1 = innerHeight*.20;
				
				
				text(p.gran, half1-half2, height1);
				
				if(p.subpreguntes.length > 0){
					
					
					resp.setAttribute('style', 'display:initial');
					resp.style.position = 'absolute';
					resp.style.left = half1-80+'px';
					resp.style.top = height1+400+'px';
					rectC(half1,innerHeight*0.6,450,400);
					
					for(var i = 0; i < p.subpreguntes.length; i++){
						
						let e = ordre[i]+ p.subpreguntes[i];
							if( e == "") continue;
								
						let fontsize = 20;
						textSize(fontsize);
						let half3 = textWidth(e)*.5;
						let x = half1;
						let y = (height1+100) + 40 * (i+1);
						let w =  textWidth(e)
						let h = fontsize;
						
						text(e, x-textWidth(e)/2, y );

					}
						if(keyCode==13){
							resp.setAttribute("style", "display:none");
							respfin=resp.value;
							
							preguntes[current].respostaUsuari.push(respfin);
							p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
							upTime(new Date());
							
							sleep(500);
							current++;
							 	
						}
						
				}
			
			}
			
				
			}
			let dinsw = entre(mouseX, innerWidth*0.01, innerWidth*0.01+64);
		let dinsh = entre(mouseY, innerHeight*0.01, innerHeight*0.01+64);
		if(dinsw&&dinsh){
			if(mouseIsPressed){
				
				passar= confirm("Segur que vols passar de resposta? si passes no contarà com a vàlida");
				if(passar==true){
					boolpassar=true;
				}else{
					boolpassar=false;
				}
			}
		}
		
		if(boolpassar==true){
			preguntes[current].respostaUsuari.push("No s'ha respòs");
			p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
			upTime(new Date());
							
			sleep(500);
			mouseIsPressed=false;
			current++;
			boolpassar=false;
		}
		}

		//DRAW PER A SI HI HAGUES UN ERROR
		if(estatdelsistema == "submit"){
			document.getElementById("passar").setAttribute("style", "display:none");
			g = 255 + (Math.sin(frameCount/100) * 100);
			background(50, 255/g, g);
			sbmit=document.getElementById("foo");
			sbmit.setAttribute('style', 'display:inline');
			sbmit.style.position = 'absolute';
			sbmit.style.left = 40+'vw';
			sbmit.style.top = 20+'vh';
			
			 if(stateprint==true){
			
					for( var i = 0; i<preguntes.length; i++){
				   
						var newdiv= document.createElement("div");
						newdiv.id="Div"+i;
						document.getElementById("foo").appendChild(newdiv);
					
						
						namenewlabel= document.createElement("label");
						namenewlabel.innerHTML = "Resposta"+(i+1)+": ";
						document.getElementById(newdiv.id).appendChild(namenewlabel);
					
						newinput= document.createElement("input");
						
						newinput.name="resposta"+(i+1);
						newinput.value = preguntes[i].respostaUsuari;
						newinput.readOnly=true;
						document.getElementById(newdiv.id).appendChild(newinput);
						
						newdate= document.createElement("input");
						
						newdate.name="temps"+(i+1);
						newdate.value = preguntes[i].date;
						newdate.readOnly=true;
						document.getElementById(newdiv.id).appendChild(newdate);
						
						
						
					}
					
						newdiv= document.createElement("div");
						newdiv.id="Div"+i;
						document.getElementById("foo").appendChild(newdiv);
					
						namenewlabel= document.createElement("label");
						namenewlabel.innerHTML = "Temps total: ";
						document.getElementById(newdiv.id).appendChild(namenewlabel);
						
						totaldate= document.createElement("input");
						totaldate.name="Total";
						totaldate.value = document.getElementById("totalhours").innerHTML+" : "+document.getElementById("totalminutes").innerHTML+" : "+document.getElementById("totalseconds").innerHTML;
						totaldate.readOnly=true;
						document.getElementById(newdiv.id).appendChild(totaldate);
					
					var sbmit= document.createElement("button");
					sbmit.id="submit";		
					sbmit.type="submit";
					sbmit.innerHTML="Envia";
					document.getElementById("foo").appendChild(sbmit);
					stateprint=false;
			}
		}
		
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
  
  if(tip == "Swipe"){
		var gran, subpreguntes = [], numopcions, respostes = [];
		var left, down, right;
		left = e[g+'resposta1'].$t;
		down = e[g+'resposta3'].$t;
		right= e[g+'resposta2'].$t;
		if(left&&down&&right){ numopcions = 3;}
		else if(left&&right){ numopcions = 2;}
		if(!left && !right && ! down) return 0;
		for(var i = 0; i < list_gsx.length; i++){
			let current = list_gsx[i];
			let ecurrent = e[g+current].$t;
			if(current.includes("cat") && ecurrent){
				subpreguntes.push(ecurrent);
			}
			if(current.includes("enun") && ecurrent) gran = ecurrent;
			if(current.includes("corr") && ecurrent) respostes.push(ecurrent);
		}
		var p = new Pregunta(gran, subpreguntes, numopcions, Math.floor(random(100)));
		p.tipologia = tip;
		p.respostes = respostes;
		p.opcions = [left, down, right];
		preguntes.push(p);
	}

  if(tip == "Drag-categories"){
	 var numopcions=0;
		categories = [];
		categories.push(e[g+'resposta1'].$t);
		categories.push(e[g+'resposta2'].$t);
		categories.push(e[g+'resposta3'].$t);
		categories.push(e[g+'resposta4'].$t);
		categories.push(e[g+'resposta5'].$t);
	
		for(var i = 0;i<5;i++){
			if(categories[i]){
				numopcions++;
			}
		}
		
		elementos = [];
		
		for(var i = 1; i < 6; i++){
			if(e[g+'cat'+String(i)].$t){
			elementos.push(e[g+'cat'+String(i)].$t);
			}
		}
    
		respuestascorrectas = [];
		respuestascorrectas.push(e[g+'corr'].$t);
    
		var p = new Pregunta(categories, elementos, numopcions, Math.floor(random(100)));
		p.tipologia = tip;
		p.respostes = respuestascorrectas;
		preguntes.push(p);

  }

  if(tip == "Opció múltiple"){
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
	
	
		categories.push(e[g+'cat1'].$t);
		categories.push(e[g+'cat2'].$t);
		categories.push(e[g+'cat3'].$t);
		categories.push(e[g+'cat4'].$t);
		categories.push(e[g+'cat5'].$t);
		
	
				
			
		
		
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
	constructor(gran, subpreguntes, numopcions, nump, date){
		this.gran = gran;
		this.subpreguntes = subpreguntes;
		this.numopcions = numopcions;
		this.numero = nump;
		this.respostaUsuari = [];
		this.date=date;
	}
}
