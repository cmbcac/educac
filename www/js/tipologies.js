var uncop=0;
var lockfil=[];
var lock=0;
var estatdrag=false;
var once=0;
//COMO DIBUJAR LAS PREGUNTAS DE OPCION MULTIPLE
/*CONSTA DE UN ENUNCIADO ESCRITO ENCIMA Y X OPCIONES PARA QUE EL USUARIO ESCOJA
A LA QUE EL USUARIO HAGA CLICK EN UNA DE LAS OPCIONES, LA RESPUESTA SE ACTUALIZARÀ Y
EL USUARIO PASARA A LA SIGUIENTE PREGUNTA*/
function opcio_multiple(p,g){
	
	try{
		let half1 = halfcanvas;
		let half2 = textWidth(p.gran) * .5;
		let height1 = innerHeight*.40;
		ctx.lineWidth="2";
		ctx.strokeStyle="black";
		ctx.fillStyle = "white";
		ctx.fill();
		enunciat(p.gran, height1,20);
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
	catch(error){
			console.log(error);
			missatgeerror = error;
			estatdelsistema = "error";
	}
}

//COMO DIBUJAR LAS PREGUNTAS DE TIPO DRAG
/*DRAG CONSISTE EN SER UNA MEZCLA ENTRE UNA PREGUNTA DE OPCION MULTIPLE Y UNA PREGUNTA DE TIPO SWIPE.
SU FUNCIONAMIENTO ES MUY SIMILAR A LA DE OPCION MULTIPLE POR AHORA*/
function drag(p,g){
	
	let numopcions = p.numopcions;
	enunciat(p.gran, quarterheight*0.3,20);
	
		textC(p.categories[isubp2], halfheightcanvas, 23);
		try{
			var posipunts;
			var rad = innerWidth*0.1;
			var radiusellipse = innerWidth*0.06;
			var angleinicial =120;  
			posipunts = returnPointsInPolygon(halfcanvas, halfheightcanvas, rad, numopcions, radiusellipse, angleinicial);
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

//COMO DIBUJAR LAS PREGUNTAS DE TIPO SWIPE
/*SWIPE CONSTA DE UN ENUNCIADO Y UN RECUADRO AL CENTRO CON EL ELEMENTO A CLASIFICAR. A LA QUE EL USUARIO HAGA
CLICK ENCIMA DEL RECUADRO, EL RECUADRO SE MINIMIZARA Y NOS PERMITIRA VER LAS POSIBLES RESPUESTAS PARA ESCOJER.
EL COLOR DEL FONDO CAMBIA DEPENDIENDO DE LA POSICION DEL RECUADRO Y ESTE SOLO SE MOVERA SI EL USUARIO MANTIENE
PULSADO EL RATON*/
function swipe(p,g){
	background(255,255,255);
	try{
		if(p.numopcions != 2 && p.numopcions != 3) throw("El numero de opcions hauria de ser 2 o 3");
			let w = textWidth(p.categories[isubp]);
			if(w>=innerWidth*0.8){ w=w*0.6;}
			let h = textHeight(p.categories[isubp], w);
			var pregunta=[];
			var lines = []
			w+=80;
			h+=20;
			let dinsw = entre(mouseX, halfcanvas - w*.5, halfcanvas + w*.5);
			let dinsh = entre(mouseY, halfheightcanvas - h*.5, halfheightcanvas + h*.5);
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
			if(entre(mouseX, halfcanvas, innerWidth)&&entre(mouseY,quarterheight3,innerHeight)&& estatswipe=="migamb"&&p.numopcions==3){
				estatswipe="avall";
			}
			//AQUI DEFINIM EL QUÈ FA CADA ESTAT
			if( estatswipe == "nomig"){
				rectC(halfcanvas, halfheightcanvas, w , h );
				if(p.categories[isubp].length>=Math.ceil(innerWidth*0.02)){
					for(var i=0;i<=p.categories[isubp].length-1;i++){
						pregunta+=p.categories[isubp][i];
						if(i==Math.ceil(p.categories[isubp].length/2)){
							pregunta+=' / ';
						}
					}
					lines=pregunta.split('/');
					for (var i = 0; i<lines.length; i++){
						textC(lines[i], halfheightcanvas+(i*20),20 );
					}
				}
				else{
					lines=p.categories[isubp];
					textC(lines, halfheightcanvas,20 );
				}
			}
			if( estatswipe == "migsense"){
				push();
				fill(200,200,234, 0.5*255);
				rectC(halfcanvas, halfheightcanvas, w , h);
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
						textC(lines[i], halfheightcanvas+(i*20),20 );
					}
				}
				else{
					lines=p.categories[isubp];
					textC(lines, halfheightcanvas,20 );
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
					if(mouseX < halfcanvas&&mouseY <= innerHeight/2){
						percent = 10 - (mouseX - quarterwidth) / quarterwidth;
						c1 = lerpColor(from, to, percent);
					}
					if(mouseX > halfcanvas&&mouseY <= innerHeight/2){
						percent = 10 + (mouseX - halfcanvas) / quarterwidth;
						c1 = lerpColor(from, to2, percent);
					}
					if(mouseX == halfcanvas&&mouseY <= innerHeight/2){
						c1 = color(255);
					}
					if(mouseY > innerHeight/2){
						percent = 10- (mouseY-quarterheight)/quarterheight;
						c1 = lerpColor(from,to3,percent);
					}
				}
				else{
					if(mouseX < halfcanvas){
						percent = 10 - (mouseX - quarterwidth) / quarterwidth;
						c1 = lerpColor(from, to, percent);
					}
					if(mouseX > halfcanvas){
						percent = 10 + (mouseX - halfcanvas) / quarterwidth;
						c1 = lerpColor(from, to2, percent);
					}
					if(mouseX == halfcanvas){
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
				text(p.subpreguntes[0], quarterwidth, halfheightcanvas);
				text(p.subpreguntes[2], quarterwidth3, halfheightcanvas);
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
	enunciat(p.gran, quarterheight+40,20);
}

//COMO DIBUJAR LAS PREGUNTAS DE TIPO FILTRO
/*LAS PREGUNTAS DE FILTRO CONSISTEN EN UNA IMAGEN QUE SERA LEIDA A TRAVES DE SU URL Y UN CONJUNTO DE OPCIONES.
CADA OPCION PINTARA UNA CAPA DE OPACIDAD INFIMA ENCIMA DE LA IMAGEN QUE PERMITIRA AL USUARIO TENER LA SENSACION DE ESTAR
MODIFICANDOLA.
CUANDO EL USUARIO ACABE. PODRA DECIDIR SI ENVIAR LA RESPEUSTA, BORRAR-LA O SEGUIR MODIFICANDOLA EN CASO DE QUE NO LE GUSTE*/
function filtre(p,g){
	try{
		var opcions=["Rojo","Verde","Azul","Blanco","Negro"];
		var image1=new Image();
		image1.src = p.subpreguntes;
		textSize(20);
		let half1 = innerWidth * .45
		let half2 = textWidth(p.gran) * .5;
		let height1 = innerHeight*.50;
		ctx.lineWidth="2";
		ctx.strokeStyle="black";
		ctx.fillStyle = "#999999";
		ctx.fill();
		ctx.drawImage(image1,innerWidth*0.25, innerHeight*0.25,innerWidth*0.3,innerHeight*0.4); 
		enunciat(p.gran, innerHeight*0.15,15);
		let dinsDonex = entre(mouseX,innerWidth*0.1, innerWidth*0.1+innerWidth*0.07 ); 
		let dinsDoney = entre(mouseY,innerHeight/2-25,innerHeight/2+innerHeight*0.07); 
		let dinsResx = entre(mouseX,innerWidth*0.65, innerWidth*0.65+innerWidth*0.07 ); 
		let dinsResy = entre(mouseY,innerHeight/2-25,innerHeight/2+innerHeight*0.07); 
		if(dinsDonex&&dinsDoney){
			push();
			fill(255, 255, 204);
			rect(innerWidth*0.1, innerHeight/2, innerWidth*0.07,innerHeight*0.07,15);
			pop();
			if(mouseIsPressed){
				for(var i=0; i<lockfil.length;i++){
					p.respostaUsuari.push(opcions[lockfil[i]]);
				}
				p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
				upTime(new Date());
				sleep(500);
				current++;
			}
		}
		else{
			rect(innerWidth*0.1, innerHeight/2, innerWidth*0.07,innerHeight*0.07,15);
		}
		if(dinsResx&&dinsResy){
			push();
			fill(255, 255, 204);
			rect(innerWidth*0.65, innerHeight/2, innerWidth*0.07,innerHeight*0.07,15);
			pop();
			if(mouseIsPressed){
				lockfil=[];
				lock=0;
			}
		}
		else{
			rect(innerWidth*0.65, innerHeight/2, innerWidth*0.07,innerHeight*0.07,15);
		}
		textC2("Acabar",innerWidth*0.13, innerHeight/2+35,20);
		textC2("Reset",innerWidth*0.68, innerHeight/2+35,20);
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
					lockfil[lock]=i;
					sleep(300);
					lock++;
				}
			}
			else{
				push();
				fill(255,255,255);
			}
			rect(x,y,100,50,15);
			pop();
			textC2(opcions[i],x+40,y+35,24);
		}
		for( var i=0; i<lockfil.length;i++){
		if(lockfil[i]==0){
			ctx.beginPath();
			ctx.rect(innerWidth*0.25, innerHeight*0.25,innerWidth*0.3,innerHeight*0.4);
			ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
			ctx.fill();
		}
		else if(lockfil[i]==1){
			ctx.beginPath();
			ctx.rect(innerWidth*0.25, innerHeight*0.25,innerWidth*0.3,innerHeight*0.4);
			ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
			ctx.fill();
		}
		else if(lockfil[i]==2){
			ctx.beginPath();
			ctx.rect(innerWidth*0.25, innerHeight*0.25,innerWidth*0.3,innerHeight*0.4);
			ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
			ctx.fill();
		}
		else if(lockfil[i]==3){
			ctx.beginPath();
			ctx.rect(innerWidth*0.25, innerHeight*0.25,innerWidth*0.3,innerHeight*0.4);
			ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
			ctx.fill();
		}
		else if(lockfil[i]==4){
			ctx.beginPath();
			ctx.rect(innerWidth*0.25, innerHeight*0.25,innerWidth*0.3,innerHeight*0.4);
			ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
			ctx.fill();
		}
	}	
	}
	catch(error){
			console.log(error);
			missatgeerror = error;
			estatdelsistema = "error";
	}
	
}

//COMO DUNUJAR LAS PREGUNTAS DE RELACION
/*LAS PREGUNTAS DE RELACION CONSISTEN EN DOS COLUMNAS DE TEXTO CON OPCIONES A RELACIONAR PARA EL USUARIO.
EL USUARIO SIMPLEMENTE TENDRA QUE HACER CLICK EN UNA OPCION EN CADA COLUMNA PERA UNIRLAS Y HACER QUE DESAPAREZCAN.
AUN ASI EL SISTEMA CONSTA DE UN SEGURO PARA EVITAR QUE EL USUARIO ENVIE RESPUESTAS SIN TENER QUE REVISARLAS */
function relacio(p,g){	
	try{
		textSize(innerWidth*0.03);
		enunciat(p.gran,halfheightcanvas-100, 20);
		for(var i=0;i<p.subpreguntes.length;i++){
			let fontsize = innerWidth*0.01;
			textSize(fontsize);
			let x = innerWidth*0.15;
			let y = halfheightcanvas+40*(i+1)+fontsize;
			let w =  textWidth(p.subpreguntes[i]);	
			let dinsx = entre(mouseX, x, x+w);
			let dinsy = entre(mouseY, y-fontsize, y+fontsize);
			push()
			if(dinsx && dinsy && !mouseIsPressed){
				fill(255, 255, 102);
			}
			else if(dinsx && dinsy && mouseIsPressed){
				lock1=i;
			}
			else{
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
			let x = innerWidth*0.8-w;
			let y = halfheightcanvas+40*(i+1)+fontsize;
			let dinsx = entre(mouseX, x, x+w);
			let dinsy = entre(mouseY, y-fontsize, y+fontsize);
			push()
			if(dinsx && dinsy && !mouseIsPressed){
				fill(255, 255, 102);
			}
			else if(dinsx && dinsy && mouseIsPressed){
				lock2=i;
			}
			else{
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
			line(quarterwidth+textWidth(p.subpreguntes[lock1])+10, halfheightcanvas+40*(lock1+1)+9, quarterwidth3-textWidth(p.categories[lock2])-10, halfheightcanvas+40*(lock2+1)+9);
			rect(halfcanvas-50, quarterheight-25, 100 ,50,15);
			text("Confirmar",halfcanvas-textWidth("Confirmar")/2,quarterheight);
			if(dist(halfcanvas, quarterheight-25, mouseX, mouseY) < 50){
				push();
				fill(179, 179, 179);
				rect(halfcanvas-50, quarterheight-25, 100 ,50,15);
				pop();
				text("Confirmar",halfcanvas-textWidth("Confirmar")/2,quarterheight);
				if(mouseIsPressed){
					if(track<p.subpreguntes.length-1){
						p.respostaUsuari.push(respostarel);
						p.subpreguntes[lock1]="";
						p.categories[lock2]="";
						lock1=undefined;
						lock2=undefined;
						sleep(200);
						track++;
					}
					else if(track>=p.subpreguntes.length-1){
						p.respostaUsuari.push(respostarel);
						p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
						upTime(new Date());
						sleep(500);
						track=0;
						lock1=undefined;
						lock2=undefined;
						current++;
					}
				}
			}	
		}
	}
	catch(error){
			console.log(error);
			missatgeerror = error;
			estatdelsistema = "error";
		}
}

//COMO DIBUJAR LAS PREGUNTAS DE ORDENACION
/*LAS RPREGUNTAS DE ORDENACION CONSISTEN EN UN ENUNCIADO Y UN CONJUNTO DE ELEMENTOS QUE EL USUARIO TENDRA QUE ORDENAR.
PARA ORDENARLOS SIMPLEMENTE TENDRA QUE ESCRIBIR EN EL CUADRO DE TEXTO EL ORDNEN EN EL QUE LE PAREZA CORRECTO.
(EL ESTILO DE RESPUESTA QUEDA A MANOS DEL CREADOR DEL CUESTIONARIO Y LA COMUNICACION CON LOS QUE VAN A REALIZARLO LOS USUARIOS)*/
function ordenar(p,g){
	try{
		textSize(20);
		let half1 = innerWidth * .45
		let half2 = textWidth(p.gran) * .5;
		let height1 = innerHeight*.25;
		enunciat(p.gran, height1, 20);
		if(p.subpreguntes.length > 0){
			resp.setAttribute('style', 'display:initial');
			resp.style.left = innerWidth*0.45+'px';
			resp.style.top = innerHeight*0.45+'px';
			ctx.lineWidth="2";
			ctx.strokeStyle="black";
			push();
			fill(242);
			rectC(half1,halfheightcanvas,450,350);
			pop();
			for(var i = 0; i < p.subpreguntes.length; i++){
				let e = ordre[i]+ p.subpreguntes[i];
				if( e == "") continue;
				let fontsize = 20;
				textSize(fontsize);
				let half3 = textWidth(e)*.5;
				let x = half1;
				let y = (height1+150) + 40 * (i+1);
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
	catch(error){
			console.log(error);
			missatgeerror = error;
			estatdelsistema = "error";
		}
}

//COM DIBUIXAR LES PREGUNTES DE BUSCADOR
/*WORK IN PROGRESS*/
function buscador(p,g){
	enunciat(p.gran, innerWidth*0.1, 20);

	textC("PULSA ENTER PARA BUSCAR", innerHeight*0.8, 12);
	for(uncop; uncop<1; uncop++){
	var newButton = document.createElement("input");
		newButton.type="text";
		newButton.id="search";
		newButton.style.top="48%";
		newButton.style.left="43%";
		newButton.style.position="absolute";
		newButton.style.zIndex=9999;
		newButton.style
		document.body.appendChild(newButton);				
	}	
			
	
	  var q = document.getElementById("search").value;
		if(keyCode==13){
			window.open('http://google.com/search?q='+q);
			keyCode=undefined;
			p.respostaUsuari.push(q);
		}
		
	
	let dinsX= entre(mouseX, halfcanvas-80, halfcanvas+20);
	let dinsY= entre(mouseY, innerHeight*0.5-30, innerHeight*0.5+20);
	if( dinsX && dinsY ) {
		
		push();
		fill(0,255,0);
		rect(halfcanvas-80, innerHeight*0.5-30, 100, 50, 10);
		pop();
		if(mouseIsPressed){
			current++;
			document.getElementById("search").style.display="none";
		}
	}
		rect(halfcanvas-80, innerHeight*0.5-30, 100, 50, 10);
		
		textSize(14);
		text("He acabado", halfcanvas-70, innerHeight*0.5);
		
}
//COMO DIBUJAR LAS PREGUNTAS QUE MUESTRAN VIDEOS
/* LAS PREGUNTAS QUE MUESTRAN VIDEOS DE YOUTUBE SIMPLEMENTE CARGAN LA URL DE LA PREGUNTA Y LA MUESTRAN COMO UN VIDEO DENTRO DE
UN IFRAME. CUANDO EL USUARIO HAYA ACABADO DE VER EL VIDEO, SE PASA A LA SIGUIENTE PREGUNTA	*/
function Youtube(p,g){

	enunciat(p.gran, innerHeight*0.2,20);
	document.getElementById("passar").setAttribute("style", "display:none");
	
	for(once; once<1; once++){
		
		var iframe= document.createElement("iframe");
			iframe.src=p.subpreguntes;
			iframe.id="youtube";
			iframe.style.position="absolute";
			iframe.style.width=30+'vw';
			iframe.style.height=30+'vh';
			iframe.style.top= 40+'vh';
			iframe.style.left=45+'vw';
			iframe.style.marginLeft=-10+'vw';
			iframe.style.zIndex=1000;
			document.body.appendChild(iframe);	
			
	}
	let w = textWidth("Ya he visto el video");
	let x = halfcanvas-50-w/4;
	let y= halfheightcanvas + innerHeight*0.2-25;
	
	
	text("Ya he visto el video", x, y);
	let dinsEndX = entre(mouseX, x-10, x+w+20);
	let dinsEndY = entre(mouseY, y-30, y+20);
	if(dinsEndX && dinsEndY){
		push();
		fill(255, 255, 102);
		rect(x-10,y-30,w+20,50,15);
		pop();
		if(mouseIsPressed){
			document.getElementById("youtube").remove();
			p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
			upTime(new Date());
			sleep(500);
			once=0;
			current++;
		}
	}else{
		rect(x-10,y-30,w+20,50,15);
	}
	
	text("Ya he visto el video", x, y);
}

function RespLibr( p , g ){
	
	enunciat(p.gran, innerHeight*0.2,20);
	for(once; once<1; once++){
		
		var txtbx= document.createElement("textarea");
			
			txtbx.id="txtbx";
			txtbx.style.position="absolute";
			txtbx.style.width=30+'vw';
			txtbx.style.height=30+'vh';
			txtbx.style.top= 40+'vh';
			txtbx.style.left=45+'vw';
			txtbx.style.marginLeft=-10+'vw';
			txtbx.style.zIndex=1000;
			document.body.appendChild(txtbx);	
			
	}
		let w = textWidth("Confirmar");
	let x = halfcanvas-50-w/4;
	let y= halfheightcanvas + innerHeight*0.2-25;
	
	
	text("Confirmar", x, y);
	let dinsEndX = entre(mouseX, x-10, x+w+20);
	let dinsEndY = entre(mouseY, y-30, y+20);
	if(dinsEndX && dinsEndY){
		push();
		fill(255, 255, 102);
		rect(x-10,y-30,w+20,50,15);
		pop();
		if(mouseIsPressed){
			p.respostaUsuari=document.getElementById("txtbx").value;
			document.getElementById("txtbx").remove();
			p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
			upTime(new Date());
			sleep(500);
			once=0;
			current++;
		}
	}else{
		rect(x-10,y-30,w+20,50,15);
	}
	
	text("Confirmar", x, y);
	
}