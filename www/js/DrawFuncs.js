var un = 0;
function inici(){
		if(start==true){
			document.getElementById("defaultCanvas0").style.border="2px solid black";
			createStart();
		}
		rectC(halfcanvas,halfheightcanvas,100,50);
		textC("Empezar",halfheightcanvas+10,20);
		let dinsX=entre(mouseX, halfcanvas-50, halfcanvas + 50);
		let dinsY=entre(mouseY, halfheightcanvas-25, halfheightcanvas + 25);				
		if(dinsX&&dinsY){
			push();
			fill(100,200,200);
			rectC(halfcanvas,halfheightcanvas,100,50);
			pop();
			textC("Empezar",halfheightcanvas+10,20);					
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
function pause(){
	$( ".loader" ).css( "display", "none" );
		
		textC("Pausa", innerHeight * .5, 30);
		textC("Pulsa espacio o enter para seguir", halfheightcanvas + 45, 15);
		if(preguntes.length > 0){
			textC("PREGUNTA: " + (current+1), halfheightcanvas + 100, 20);		
	}
}
function playing(){
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
			
			for ( un ; un<1 ; un++){
				createCHLIST();
			}
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
			else if(tipo == "Buscador"){
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
			if(tipo=="Buscador"){ document.getElementById("search").style.display="none"; }
			if(tipo=="RespuestaLibre"){document.getElementById("txtbx").style.display="none";}
			upTime(new Date());				
			sleep(500);
			current++;		
		}
}
function sbmit(){
	$( ".loader" ).css( "display", "none" );
		stateprint=creaSubmit(stateprint);
}
function error(){
	$( ".loader" ).css( "display", "none" );
		document.getElementById("passar").setAttribute("style", "display:none");
		
		ctx.clearRect(0, 0, width, height);
		fill(255, 255, 0);
		textC("Error", halfcanvas, 30);
		textC("Algo no funciona bien", halfcanvas + 45, 15);
		var bgImg = new Image();
		bgImg.onload = function(){
	    document.getElementById("defaultCanvas0").style.backgroundImage="url('"+bgImg.src+"')";
		};
		bgImg.src = "img/error.gif";
}