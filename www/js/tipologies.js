var uncop=0;
var lockfil=-1;

function opcio_multiple(p,g){
	
	background(0, 255-g, 255+2*g);
				
				
				let half1 = innerWidth * .4
				let half2 = textWidth(p.gran) * .5;
				let height1 = innerHeight*.40;
				ctx.lineWidth="2";
				ctx.strokeStyle="black";
				ctx.fillStyle = "white";
				ctx.fill();
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

function drag(p,g){
	
	background(0, 255-g, 255+2*g);
					
						let numopcions = p.numopcions;
						
						
						textC(p.gran, quarterheight-40,20);
						textC(p.categories[isubp2], quarterheight2, 23);
						try{
							
          
								var posipunts;
								var rad = innerWidth*0.1;
								var radiusellipse = innerWidth*0.06;
								var angleinicial =120;
          
								posipunts = returnPointsInPolygon(quarterwidth2, quarterheight2, rad, numopcions, radiusellipse, angleinicial);
								for(var i = 0; i < posipunts.length; i++){
									
									let x = posipunts[i].x;
									let y = posipunts[i].y;
									let dins = dist(x, y, mouseX, mouseY) < radiusellipse/2;
									push()
									if(dins && mouseIsPressed && !lastframemouse){
										var rsp=p.subpreguntes[i];
										preguntes[current].respostaUsuari.push(rsp);
										
										
										isubp2++;
										if(isubp2 == p.categories.length){
											
											isubp2 = 0;
											p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
											upTime(new Date());
											current++;
											 
				
										}
									}
									if(dins && !mouseIsPressed && !lastframemouse){
										ctx.scale(2,2);
										ctx.translate(-x/2,-y/2);
										
										fill(100,200,200);
									}
									else{
										fill(255);
									}
									
									ellipse(x, y, radiusellipse);
									fill(0);
									textC2(p.subpreguntes[i], x, y, 11);
									pop();

								}
							
						}
						catch(error){
							console.log(error);
							missatgeerror = error;
							estatdelsistema = "error";
						}
					lastframemouse = mouseIsPressed;
	
}

function swipe(p,g){
	
	background(255,255,255);
	
				try{
					if(p.numopcions != 2 && p.numopcions != 3) throw("El numero de opcions hauria de ser 2 o 3");

						
						let w = textWidth(p.categories[isubp]);
						if(w>=innerWidth){ w=w*0.4;}
						let h = textHeight(p.categories[isubp], w);
						var pregunta=[];
						var lines = []
						w+=80;
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
					if(entre(mouseX, quarterwidth2, innerWidth)&&entre(mouseY,quarterheight3,innerHeight)&& estatswipe=="migamb"&&p.numopcions==3){
						estatswipe="avall";
					}
		  		  
							//AQUI DEFINIM EL QUÈ FA CADA ESTAT
		  
					if( estatswipe == "nomig"){
						
						rectC(quarterwidth2, quarterheight2, w , h );

						if(p.categories[isubp].length>=Math.ceil(innerWidth*0.02)){
							
								for(var i=0;i<=p.categories[isubp].length-1;i++){
									pregunta+=p.categories[isubp][i];
									if(i==Math.ceil(p.categories[isubp].length/2)){
										pregunta+=' / ';
									}
								}
									lines=pregunta.split('/');
								
								for (var i = 0; i<lines.length; i++){
									textC(lines[i], quarterheight2+(i*20),20 );
								}
							
						}else{
								lines=p.categories[isubp];
								textC(lines, quarterheight2,20 );
						}
					}
					if( estatswipe == "migsense"){
			  
						push();
						fill(200,200,234, 0.5*255);
						rectC(quarterwidth2, quarterheight2, w , h);
						pop();
						if(p.categories[isubp].length>=Math.ceil(innerWidth*0.02)){
							
								for(var i=0;i<=p.categories[isubp].length-1;i++){
									pregunta+=p.categories[isubp][i];
									if(i==Math.ceil(p.categories[isubp].length/2)){
										pregunta+=' / ';
									}
								}
									lines=pregunta.split('/');
								
								for (var i = 0; i<lines.length; i++){
									textC(lines[i], quarterheight2+(i*20),20 );
								}
							
						}else{
								lines=p.categories[isubp];
								textC(lines, quarterheight2,20 );
						}
					}		
					if( estatswipe == "migamb" || estatswipe == "dreta" || estatswipe == "esquerra"||estatswipe=="avall"){
        
						push();
						let c1, percent;
							from = color(255, 255, 255, 0.2 * 255);
								to = color(0, 255, 0, 0.2 * 255);
								to2 = color(255, 0, 0, 0.2 * 255);
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
						ellipse(mouseX, mouseY, innerWidth*0.05 , innerWidth*0.05);
						textSize(14);
						ctx.fillStyle = "black";
						text(p.subpreguntes[0], quarterwidth, quarterheight2);
						text(p.subpreguntes[2], quarterwidth3, quarterheight2);
						if(p.numopcions <= 3) text(p.subpreguntes[1], innerWidth*0.4 - textWidth(p.subpreguntes[1])/2, quarterheight3);
		  
						pop();
						
					}
					if( estatswipe == "esquerra"){
					
						preguntes[current].respostaUsuari.push(p.subpreguntes[0]);
					}
					if( estatswipe == "dreta"){
						preguntes[current].respostaUsuari.push(p.subpreguntes[2]);
					}
					if( estatswipe == "avall"){
						preguntes[current].respostaUsuari.push(p.subpreguntes[1]);
					}
					if( estatswipe == "dreta" || estatswipe == "esquerra"||estatswipe=="avall"){
			  
						isubp+=1;
						estatswipe = "nomig";
						mouseX=innerWidth*0.25;
						mouseY=innerHeight/2;
						if(isubp == p.categories.length){
							
							p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
							upTime(new Date());
							sleep(500);
							isubp = 0;
							current+=1;
							 
						}
					}
		  
		 
				}		
				catch(error){
					console.log(error);
					missatgeerror = error;
					estatdelsistema = "error";
				}
				textC(p.gran, quarterheight+40 , 20);
	
}

function filtre(p,g){
	
	background(0, 255-g, 255+2*g);
				
				var opcions=["red","green","blue","white","black"];
				var image1=new Image();
				image1.src = p.subpreguntes;
				
				
								
								textSize(20);
			
								let half1 = innerWidth * .4
								let half2 = textWidth(p.gran) * .5;
								let height1 = innerHeight*.50;
								
								ctx.lineWidth="2";
								ctx.strokeStyle="black";
								ctx.fillStyle = "#999999";
								ctx.fill();
								
								rect(innerWidth*0.30, innerHeight*0.249,innerWidth*0.202,innerHeight*0.203); 
								
								ctx.drawImage(image1,innerWidth*0.301, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2); 
								
								text(p.gran, half1-half2, window.innerHeight*0.1);
								
								rect(innerWidth*0.25-25, innerHeight/2-25, innerWidth*0.07,innerHeight*0.07,15);

								rect(innerWidth*0.51-25, innerHeight/2-25, innerWidth*0.07,innerHeight*0.07,15);
								
								textC2("DONE",innerWidth*0.27-5, innerHeight/2+8,20);
								textC2("RESET",innerWidth*0.53-5, innerHeight/2+8,20);
								
								//FOR DE DIBUIXAR
								for(var i = 0; i < 5 ; i++){
								
									let x= innerWidth*(0.8*i/5)+100;
									let y= innerHeight*0.7;
									
									let dinsx = entre(mouseX, x, x+100);
									let dinsy = entre(mouseY, y, y+50);
									

									if(dinsx&&dinsy){
										push();
										fill(255, 255, 204);
									if(mouseIsPressed){
										
										fill(255, 255, 102);
										lockfil=i;
									}
									}else{
										push();
										fill(255,255,255);
									
									}
									
									rect(x,y,100,50,15);
									pop();
									textC2(opcions[i],x+40,y+35,24);
									
								}
								var imageData = ctx.getImageData(innerWidth*0.301, innerHeight*0.25,innerWidth*0.2,innerHeight*0.2);
								var data = imageData.data;
								
								if(lockfil==0){
										
									for (var i = 0; i < data.length; i += 4) {
										var red = data[i]; // red
										var green = data[i + 1]; // green
										var blue = data[i + 2]; // blue
										
										data[i] = 200;
										data[i + 1] = green;
										data[i + 2] = blue;
									}

									
									ctx.putImageData(imageData,innerWidth*0.301, innerHeight*0.25);
									
								}
								
								else if(lockfil==1){
								
								for (var i = 0; i < data.length; i += 4) {
										var red = data[i]; // red
										var green = data[i + 1]; // green
										var blue = data[i + 2]; // blue
										
										data[i] = red;
										data[i + 1] = 200;
										data[i + 2] = blue;
									}

									
									ctx.putImageData(imageData,innerWidth*0.301, innerHeight*0.25);
								
								}
								
								else if(lockfil==2){
								
								for (var i = 0; i < data.length; i += 4) {
										var red = data[i]; // red
										var green = data[i + 1]; // green
										var blue = data[i + 2]; // blue
										
										data[i] = red;
										data[i + 1] = green;
										data[i + 2] = 200;
									}

									
									ctx.putImageData(imageData,innerWidth*0.301, innerHeight*0.25);
								
								}
								
								else if(lockfil==3){
								
									for (var i = 0; i < data.length; i += 4) {
										
										data[i] += 100;
										data[i + 1] += 100;
										data[i + 2] += 100;
									}

									ctx.putImageData(imageData,innerWidth*0.301, innerHeight*0.25);
								
								}
								
								else if(lockfil==4){
								
									for (var i = 0; i < data.length; i += 4) {
										var red = data[i]; // red
										var green = data[i + 1]; // green
										var blue = data[i + 2]; // blue
										
										var v = 0.2126*red + 0.7152*green + 0.0722*blue;
										data[i] = data[i+1] = data[i+2] = v
									}

									
									ctx.putImageData(imageData,innerWidth*0.301, innerHeight*0.25);
								
								}
	
}

function relacio(p,g){
	
	background(0, 255-g, 255+2*g);
				
				textSize(innerWidth*0.03);
				text(p.gran,innerWidth*0.4-textWidth(p.gran)/2, quarterheight2-40);
				
				for(var i=0;i<p.subpreguntes.length;i++){
					
				
									
									let fontsize = innerWidth*0.01;
										textSize(fontsize);
									let x = innerWidth*0.15;
									let y = quarterheight2+40*(i+1)+fontsize;
									let w =  textWidth(p.subpreguntes[i]);	
									let dinsx = entre(mouseX, x, x+w);
									let dinsy = entre(mouseY, y-fontsize, y+fontsize);

									push()
									
									if(dinsx && dinsy && !mouseIsPressed){
										fill(255, 255, 102);
									}else if(dinsx && dinsy && mouseIsPressed){
										lock1=i;
									}else{
										fill(0);
									}
									
									
									text(p.subpreguntes[i],	x, y);
									pop();
									if(p.subpreguntes[i]!=""){
										ellipse(x+w+10, y-5, 6, 6);
									}
				}
				
				for(var i=0;i<p.categories.length;i++){
					
				
									
									let fontsize = innerWidth*0.01;
										textSize(fontsize);
									let w =  textWidth(p.categories[i]);
									let x = quarterwidth3-w;
									let y = quarterheight2+40*(i+1)+fontsize;
										
									let dinsx = entre(mouseX, x, x+w);
									let dinsy = entre(mouseY, y-fontsize, y+fontsize);

									push()
									
									if(dinsx && dinsy && !mouseIsPressed){
										fill(255, 255, 102);
									}else if(dinsx && dinsy && mouseIsPressed){
										lock2=i;
									}else{
										fill(0);
									}
									
									
									text(p.categories[i],	x, y);
									pop();
									if(p.categories[i]!=""){
										ellipse(x-10, y-5, 6, 6);
									}
				}
					
				if(lock1!=undefined && lock2 != undefined){
					
							respostarel=(lock1+1)+"-"+(lock2+1);
							line(quarterwidth+textWidth(p.subpreguntes[lock1])+10, quarterheight2+40*(lock1+1)+9, quarterwidth3-textWidth(p.categories[lock2])-10, quarterheight2+40*(lock2+1)+9);
							
							rect(quarterwidth2-50, quarterheight-25, 100 ,50,15);
							text("Confirmar",quarterwidth2-textWidth("Confirmar")/2,quarterheight);
					
								if(dist(quarterwidth2, quarterheight-25, mouseX, mouseY) < 50){
									push();
									fill(179, 179, 179);
									rect(quarterwidth2-50, quarterheight-25, 100 ,50,15);
									pop();
									text("Confirmar",quarterwidth2-textWidth("Confirmar")/2,quarterheight);
										if(mouseIsPressed){
											if(track<p.subpreguntes.length-1){
												p.respostaUsuari.push(respostarel);
												p.subpreguntes[lock1]="";
												p.categories[lock2]="";
												lock1=undefined;
												lock2=undefined;
												sleep(200);
												track++;
												
											}else if(track>=p.subpreguntes.length-1){
												p.respostaUsuari.push(respostarel);
												p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
												upTime(new Date());
												sleep(500);
												current++;
											}
										}
								}
				}
					
					
					
}

function ordenar(p,g){
	
	background(0, 255-g, 255+2*g);
				textSize(20);
			
				let half1 = innerWidth * .4
				let half2 = textWidth(p.gran) * .5;
				let height1 = innerHeight*.25;
				
				
				text(p.gran, half1-half2, height1);
				
				if(p.subpreguntes.length > 0){
					
					
					resp.setAttribute('style', 'display:initial');
					resp.style.position = 'absolute';
					resp.style.left = half1-80+'px';
					resp.style.top = innerHeight*0.8+'px';
					ctx.lineWidth="2";
					ctx.strokeStyle="black";
					ctx.fill();
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

function buscador(p,g){

	background(0, 255-g, 255+2*g);
	if(uncop==0){
		
		var newdiv=document.createElement("div");
			
			newdiv.src="prova1.html";
			newdiv.id="formdiv";
			newdiv.style.left=50+"%";
			newdiv.style.top=50+"%";
			newdiv.style.width=30+"%";
			newdiv.style.height=25+"%";
			newdiv.style.position="absolute";
			document.body.appendChild(newdiv);
		
		var newform=document.createElement("from");
			newform.id="formsearch";
			newform.action="https://google.com/search";
			newform.method="get";
			document.getElementById("formdiv").appendChild(newform);
		
		var input=document.createElement("input");
			input.type="text";
			input.name="q";
			input.required=true;
			input.autofocus=true;
			document.getElementById("formsearch").appendChild(input);
			
		input=document.createElement("input");
			input.type="submit";
			input.value="Buscador";
			document.getElementById("formsearch").appendChild(input);
		
		uncop++;
		
	}
}
