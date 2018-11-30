function fotodrag(p,g){
	background(255);
	let numopcions = p.numopcions;
	ajustaTextC(p.gran, quarterheight*0.3,20);	
	try{
		var posipunts;
		var rad = innerWidth*0.1;
		var radiusellipse = innerWidth*0.06;
		var angleinicial =120;  
		posipunts = returnPointsInPolygon(halfcanvas/2, halfheightcanvas*0.9, rad, p.subpreguntes.length, radiusellipse, angleinicial);
		for(var i = 0; i < posipunts.length; i++){				
			let x=posipunts[i].x;
			let y=posipunts[i].y;
			let dinsresp = dist(x, y, mouseX, mouseY) < radiusellipse/2;
			let dinsfotX = entre(mouseX, innerWidth*0.4, innerWidth*0.6);
			let dinsfotY = entre(mouseY, innerHeight*0.3, innerHeight*0.5);
			if(p.categories[isubp2][0]=="!"){			
				textC(p.categories[isubp2].substr(1), halfheightcanvas, 23);
				estatdrag=true;
				push();
			}
			else{
				var dragimage = new Image();
				dragimage.src=p.categories[isubp2];
				if(estatdrag==false){	
					if(dinsfotX && dinsfotY){
						push();
						ctx.drawImage(dragimage,innerWidth*0.35, innerHeight*0.25,innerWidth*0.3,innerHeight*0.3);
						pop();
						if(mouseIsPressed){
							estatdrag=true;
						}
					}
					else{
						ctx.drawImage(dragimage,innerWidth*0.4, innerHeight*0.3,innerWidth*0.2,innerHeight*0.2); 
					}						
				}
				else{
					ctx.save();
					ctx.beginPath();
					ctx.arc(mouseX, mouseY, 25, 0, Math.PI * 2, true);
					ctx.closePath();
					ctx.clip();
					ctx.drawImage(dragimage, mouseX-25, mouseY-25, 100, 100);
					ctx.beginPath();
					ctx.arc(mouseX, mouseY, 25, 0, Math.PI * 2, true);
					ctx.clip();
					ctx.closePath();
					ctx.restore();
				}
				push();
			}
			if(dinsresp && mouseIsPressed && estatdrag){							
					var rsp=p.subpreguntes[i];
					preguntes[current].respostaUsuari.push(rsp);
					estatdrag=false;						
					isubp2++;
					sleep(200);
					if(isubp2 == p.categories.length){							
						isubp2 = 0;
						p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
						upTime(new Date());
						current++;			
					}
			}
			if(dinsresp && !mouseIsPressed && !lastframemouse){
				ctx.scale(2,2);
				ctx.translate(-x/2,-y/2);							
				fill(100,200,200);
			}	
			else{
				fill(255);
			}
			if(p.subpreguntes[i][0]=="!"){
				ellipse(x, y, radiusellipse);
				fill(0);
				textC2(p.subpreguntes[i].substr(1), x, y, 11);
				pop();	
			}
			else{
				var subpimage = new Image();
				subpimage.src=p.subpreguntes[i];
				ctx.save();
				ctx.beginPath();
				ctx.arc(x, y, radiusellipse/2, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(subpimage, x-radiusellipse/2, y-radiusellipse/2, radiusellipse, radiusellipse);
				ctx.beginPath();
				ctx.arc(x, y, radiusellipse/2, 0, Math.PI * 2, true);
				ctx.clip();
				ctx.closePath();
				ctx.restore();
				pop();
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
function fotoswipe( p , g ){
	background(255,255,255);
	if(p.categories[isubp][0]=="!"){
		var aux=p.categories[isubp].substr(1);
		try{
			if(p.numopcions != 2 && p.numopcions != 3) throw("El numero de opcions hauria de ser 2 o 3");
			let w = textWidth(aux);
			if(w>=innerWidth*0.8){ w=w*0.6;}
			let h = textHeight(aux, w);
			var pregunta=[];
			var lines = []
			w+=80;
			h+=20;						
			let dinsw = entre(mouseX, halfcanvas - w*.5, halfcanvas + w*.5);
			let dinsh = entre(mouseY, halfheightcanvas - h*.5, halfheightcanvas + h*.5);
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
				if(aux.length>=Math.ceil(innerWidth*0.02)){
					for(var i=0;i<=aux.length-1;i++){
						pregunta+=aux[i];
						if(i==Math.ceil(aux.length/2)){
							pregunta+=' / ';
						}
					}
					lines=pregunta.split('/');
					for (var i = 0; i<lines.length; i++){
						textC(lines[i], halfheightcanvas+(i*20),20 );
					}
				}
				else{
					lines=aux;
					textC(lines, halfheightcanvas,20 );
				}
			}
			if( estatswipe == "migsense"){
				push();
				fill(200,200,234, 0.5*255);
				rectC(halfcanvas, halfheightcanvas, w , h);
				pop();
				if(aux.length>=Math.ceil(innerWidth*0.02)){
					for(var i=0;i<=aux.length-1;i++){
						pregunta+=aux[i];
						if(i==Math.ceil(aux.length/2)){
							pregunta+=' / ';
						}
					}
						lines=pregunta.split('/');
					for (var i = 0; i<lines.length; i++){
						textC(lines[i], halfheightcanvas+(i*20),20 );
					}
				}
				else{
					lines=aux;
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
				if(p.subpreguntes[0][0]=="!"){
					text(p.subpreguntes[0].substr(1), quarterwidth, halfheightcanvas);
				}
				else{
					var subpimg = new Image();
					subpimg.src=p.subpreguntes[0];
					ctx.drawImage(subpimg, quarterwidth-innerWidth*0.1, halfheightcanvas-innerHeight*0.1, innerWidth*0.2, innerHeight*0.2);
				}
				if(p.subpreguntes[2][0]=="!"){
						text(p.subpreguntes[2].substr(1), quarterwidth3, halfheightcanvas );
					}
				else{
						var subpimg2 = new Image();
						subpimg2.src=p.subpreguntes[2];
						ctx.drawImage(subpimg2,quarterwidth3-innerWidth*0.1, halfheightcanvas-innerHeight*0.1, innerWidth*0.2, innerHeight*0.2);
					}
				if(p.numopcions <= 3) {
						if(p.subpreguntes[1][0]=="!"){
							text(p.subpreguntes[1].substr(1), innerWidth*0.4 - textWidth(p.subpreguntes[1])/2, quarterheight3);
						}
						else{
							var subpimg3 = new Image();
							subpimg3.src=p.subpreguntes[1];
							ctx.drawImage(subpimg3, innerWidth*0.3, innerHeight*0.6, innerWidth*0.2, innerHeight*0.2);
						}
					}	
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
	}
	else{		
		try{
			if(p.numopcions != 2 && p.numopcions != 3) throw("El numero de opcions hauria de ser 2 o 3");
				var swimage= new Image();
				swimage.src= p.categories[isubp];
				let dinsw = entre(mouseX, innerWidth*0.3, innerWidth*0.3+innerWidth*0.2);
				let dinsh = entre(mouseY, innerHeight*0.3, innerHeight*0.2+innerHeight*0.3);
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
					ctx.drawImage(swimage,innerWidth*0.3, innerHeight*0.3,innerWidth*0.2,innerHeight*0.2); 	
				}
				if( estatswipe == "migsense"){
					push();
					ctx.drawImage(swimage,innerWidth*0.25, innerHeight*0.25,innerWidth*0.3,innerHeight*0.3); 	
					pop();
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
					ctx.save();
					ctx.beginPath();
					ctx.arc(mouseX, mouseY, 25, 0, Math.PI * 2, true);
					ctx.closePath();
					ctx.clip();
					ctx.drawImage(swimage, mouseX-25, mouseY-25, 50, 50);
					ctx.beginPath();
					ctx.arc(mouseX, mouseY, 25, 0, Math.PI * 2, true);
					ctx.clip();
					ctx.closePath();
					ctx.restore();
					textSize(14);
					ctx.fillStyle = "black";
					if(p.subpreguntes[0][0]=="!"){
					text(p.subpreguntes[0].substr(1), quarterwidth, halfheightcanvas);
					}
					else{
						var subpimg = new Image();
						subpimg.src=p.subpreguntes[0];
						ctx.drawImage(subpimg, quarterwidth-innerWidth*0.1, halfheightcanvas-innerHeight*0.1, innerWidth*0.2, innerHeight*0.2);
					}
					if(p.subpreguntes[2][0]=="!"){
						text(p.subpreguntes[2].substr(1), quarterwidth3, halfheightcanvas );
					}
					else{
						var subpimg2 = new Image();
						subpimg2.src=p.subpreguntes[2];
						ctx.drawImage(subpimg2,quarterwidth3-innerWidth*0.1, halfheightcanvas-innerHeight*0.1, innerWidth*0.2, innerHeight*0.2);
					}
					if(p.numopcions <= 3) {
						if(p.subpreguntes[1][0]=="!"){
							text(p.subpreguntes[1].substr(1), innerWidth*0.4 - textWidth(p.subpreguntes[1])/2, quarterheight3);
						}
						else{
							var subpimg3 = new Image();
							subpimg3.src=p.subpreguntes[1];
							ctx.drawImage(subpimg3, innerWidth*0.3, innerHeight*0.6, innerWidth*0.2, innerHeight*0.2);
						}
					}		
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
	}	
	ajustaTextC(p.gran, quarterheight+40,20);
}
function fotorelacio( p , g ){
	background(255);
	textSize(innerWidth*0.03);
	ajustaTextC(p.gran,halfheightcanvas-100, 20);
	for(var i=0;i<p.subpreguntes.length;i++){
		let fontsize = innerWidth*0.01;
		textSize(fontsize);
		let x = innerWidth*0.15;
		let y = halfheightcanvas+40*(i+1)+fontsize;
		let w =  textWidth("AAAAAAAAAAAAAAAAAAAA");	
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
		if(p.subpreguntes[i][0]=="!"){
			if(p.subpreguntes[i]!=""){
				ellipse(x+w+10, y-5, 6, 6);
			}
			text(p.subpreguntes[i].substr(1),	x, y);
		}else{
			
			text("Opcion con foto", x,y);
			
			ellipse(x+textWidth("Opcion con foto")+10, y-5, 6, 6);
			
			/*
			var image1=new Image();
				image1.src = p.subpreguntes[i];
			ctx.drawImage(image1,x, y,innerWidth*0.1,innerHeight*0.1); 
			*/
		}
		pop();
	}
	for(var i=0;i<p.categories.length;i++){
		let fontsize = innerWidth*0.01;
		textSize(fontsize);
		let w =  textWidth(p.categories[i]);
		let x = quarterwidth3-w;
		let y = halfheightcanvas+40*(i+1)+fontsize;
		let dinsxfot1 = entre(mouseX, quarterwidth3, quarterwidth3+innerWidth*0.1);
		let dinsxfot2 = entre(mouseX, halfcanvas, halfcanvas+innerWidth*0.1);
		let dinsyfot = entre(mouseY, y-100, y-100+innerHeight*0.1); 
		let dinsx= entre(mouseX, x, x+w);
		let dinsy = entre(mouseY, y-fontsize, y+fontsize);
		push()
		if((dinsx && dinsy && p.categories[i][0]=="!") && !mouseIsPressed){
			fill(255, 255, 102);
		}else if((dinsx && dinsy && p.categories[i][0]=="!") && mouseIsPressed){
			lock2=i;
		}else if(dinsxfot1 && dinsyfot && i%2==1 && mouseIsPressed){
			lock2=i;
		}else if(dinsxfot2 && dinsyfot && i%2==0 && mouseIsPressed){
			lock2=i;
		}
		else{
			fill(0);
		}
		if(p.categories[i][0]=="!"){
			if(p.categories[i]!=""){
				ellipse(x+w+10, y-5, 6, 6);
			}
			text(p.categories[i].substr(1),	x, y);
		}else{
			var image1=new Image();
			image1.src = p.categories[i];
			if(i%2==0){
				ctx.drawImage(image1,halfcanvas, y-100,innerWidth*0.1,innerHeight*0.1); 
			}else{
				ctx.drawImage(image1,quarterwidth3, y-100,innerWidth*0.1,innerHeight*0.1); 
			}	
		}
		pop();
	}
	if(lock1!=undefined && lock2 != undefined){
		respostarel=(lock1+1)+"-"+(lock2+1);
		var fotsub;
		var fotcat;
		if( p.subpreguntes[lock1][0]=="!"){
			text(p.subpreguntes[lock1].substr(1), innerWidth*0.2, innerHeight*0.2);
			if(p.categories[lock2][0]=="!"){
				text(p.categories[lock2].substr(1), innerWidth*0.5, innerHeight*0.2);
			}else{
				fotcat= new Image();
				fotcat.src=p.categories[lock2];
				ctx.drawImage(fotcat, innerWidth*0.5, innerHeight*0.1, innerWidth*0.2, innerHeight*0.2);
			}
			line(innerWidth*0.31, innerHeight*0.2,innerWidth*0.49, innerHeight*0.2); 
		}
		else{
			fotsub= new Image();
			fotsub.src=p.subpreguntes[lock1];
			ctx.drawImage(fotsub, innerWidth*0.1, innerHeight*0.1, innerWidth*0.2, innerHeight*0.2);
			if(p.categories[lock2][0]=="!"){	
				text(p.categories[lock2].substr(1), innerWidth*0.5, innerHeight*0.2);
			}else{
				fotcat= new Image();
				fotcat.src=p.categories[lock2];
				ctx.drawImage(fotcat, innerWidth*0.5, innerHeight*0.1, innerWidth*0.2, innerHeight*0.2);
			}
			line(innerWidth*0.31, innerHeight*0.2,innerWidth*0.49, innerHeight*0.2); 
		}
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
					track=0;
				}
			}
		}
	}
}
function fotomultop( p , g ){
	background(255);
	let half1 = innerWidth * .4
	let half2 = textWidth(p.gran) * .5;
	let height1 = innerHeight*.40;
	ctx.lineWidth="2";
	ctx.strokeStyle="black";
	ctx.fillStyle = "white";
	ctx.fill();
	ajustaTextC(p.gran, height1,20);
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
				if(e[0]!="!"){
					var opimage = new Image();
					opimage.src=e;
					ctx.drawImage(opimage, quarterwidth-innerWidth*0.1, innerHeight*0.4, innerWidth*0.2, innerHeight*0.2);
				}
				if(mouseIsPressed){
					preguntes[current].respostaUsuari.push(e);
					p.date=document.getElementById("hours").innerHTML+" : "+document.getElementById("minutes").innerHTML+" : "+document.getElementById("seconds").innerHTML;
					upTime(new Date());
					sleep(500);					
					current++;							 
				}
			}
			ellipse(posx - 10, posy - 5, 6, 6);
			if(e[0]=="!"){
				text(e.substr(1), posx, posy );
			}
			else{
				text("Ponga el ratón aqui para ver la imagen", posx, posy);
			}
			pop();
		}				
	}
}