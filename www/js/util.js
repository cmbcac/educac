var quarterwidth = innerWidth * .15;
var halfcanvas = innerWidth * .45;
var halfwidth = innerWidth * 0.5;
var quarterwidth3 = innerWidth * .65;
var quarterheight = innerHeight * .25;
var halfheightcanvas = innerHeight * .50;
var quarterheight3 = innerHeight * .75;
var puntatje=0;
var r = 0;
//CALCULA SI L'ELEMENT X ESTÀ ENTRE A I B
function entre(x, a, b){
	return x > a && x < b;
}
//CENTRA EL TEXT
function centraText(t, pos){
	pos.x = pos.x - textWidth(t)/2;
	return pos;
}
//CENTRA EL TEXT EN LA POSICIÓ Y DESITJADA
function textC(missatge, y, size){
	push();
	textSize(size);
	ctx.font=size+'px Verdana';;
	let half1 = halfcanvas;
	let half2 = textWidth(missatge) * .5;
	let x = half1 - half2;
	text(missatge, x, y);
	pop();
}
//POTS POSAR EL TEXT ON VULGUIS
function textC2(missatge, x, y, size ){
	push();
	textSize(size);
	 ctx.font = size+"px Arial"
	let half1 = textWidth(missatge) * .4;
	let px = x - half1;
	let half2 = textHeight(missatge, textWidth(missatge)) * .5;
	let py = y;
	text(missatge, px, py);
	pop();
}
//ESCRIURE UN RECTANGLE
function rectC(x, y, w, h){
	let half1 = w *.5;
	let half2 = h *.5;
	rect(x-half1, y - half2, w, h,10);
}
//QUÈ FA LA FINESTRA QUAN CANVIA DE MIDA
/*window.onresize = function(){
	
	resizeCanvas(window.innerWidth*0.9, window.innerHeight*0.85);
	resizevArialbles();
	redraw(5);
}*/
function windowResized() {
	resizeCanvas(window.innerWidth*0.9, window.innerHeight*0.85);
	resizevArialbles();
	redraw(5);
}
//CANVIA TOTES LES MESURES PREDEFINIDES QUAN LA FINESTRA CANVIA DE MIDA
function resizevArialbles(){
	quarterwidth = window.innerWidth * .15;
	halfcanvas = window.innerWidth * .45;
	halfwidth = window.innerWidth * 0.5;
	quarterwidth3 = window.innerWidth * .65;
	quarterheight = window.innerHeight * .25;
	halfheightcanvas = window.innerHeight * .50;
	quarterheight3 = window.innerHeight * .75;	
}
//CENTRA UN RECTANGLE
function rectangleCentrat(w, h){
	var p1 = (window.innerWidth - w)*.5;
	var p2 = (window.innerHeight- h)*.5;
	rect(p1, p2, w, h);
}
//TRANSFORMA TOTES LES DADES DE TEXT QUE PASSEM A TIPUS JSON
function text_a_JSON(data){
	var start = 25;
	var end = data.length - 2;
	var JSONText = data.slice(start,end);
	JParsedText = JSON.parse(JSONText);
	return JParsedText;
}
//DIBUIXA UN POLIGON
function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a - TWO_PI/4) * radius;
    var sy = y + sin(a - TWO_PI/4) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
//ESCRIU UN CERCLE A CADA VÉRTEX D'UN POLIGON DESIGNAT
function circlesInPolygonC(x, y, radius, npoints, radiusellipse, angleinicial){
	var angle = TWO_PI / npoints;
	for (var a = 0; a < TWO_PI; a += angle) {
		//a = a - TWO_PI/4;
		let a2 = a - TWO_PI/4;
		if(angleinicial != undefined ) a2 += Number(angleinicial);
		var sx = x + cos(a2) * radius;
		var sy = y + sin(a2) * radius;
		ellipse(sx, sy, radiusellipse);
	}
}
//RETORNA LA POSICIÓ DELS VERTEXS D'UN POLIGON DESIGNAT
function returnPointsInPolygon(x, y, radius, npoints, radiusellipse, angleinicial){
	var posipunts = [];
	var angle = TWO_PI / npoints;
	for (var a = 0; a < TWO_PI; a += angle) {
		//a = a - TWO_PI/4;
		let a2 = a - TWO_PI/4;
		if(angleinicial != undefined ) a2 += Number(angleinicial);
		var sx = x + cos(a2) * radius;
		var sy = y + sin(a2) * radius;
		posipunts.push({x:sx, y:sy});
	}
	return posipunts;
}
//CARREGA LES DADES JSON DE LA URL QUE LI PASSEM (ID)
function util_xmlhttp(id, todo, params, handle){
	/*id: id del document que llegeix*/
	/*todo: funcio a fer*/
	/*string: per identificar que esta fent*/
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
				todo(xmlhttp.responseText, params);
				handle();
				//handleComplete(params);
            }
            else if (xmlhttp.status == 400) {
              console.log('There was an error 400');
            }
            else {
              console.log('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("GET", "https://spreadsheets.google.com/feeds/list/"+id+"/1/public/values?alt=json-in-script&callback=callback", true);
    xmlhttp.send();
}
//CALCULA L'ALTURA QUE OCUPA EL TEXT DESIGNAT
function textHeight(text, maxWidth) {
	var words = text.split(' ');
	var line = '';
	var h = textLeading();
	for (var i = 0; i < words.length; i++) {
		var testLine = line + words[i] + ' ';
		var testWidth = drawingContext.measureText(testLine).width;
		if (testWidth > maxWidth && i > 0) {
			line = words[i] + ' ';
			h += textLeading();
		}
		else {
			line = testLine;
		}
	}
	return h;
}
//CREA EL FORMULARI QUE CONTINDRÀ LES RESPOSTES DEL CUESTIONARI
function creaSubmit(stateprint){
			document.getElementById("passar").setAttribute("style", "display:none");
			document.getElementById("infopass").setAttribute("style", "display:none");
			document.getElementById("txtpassar").setAttribute("style", "display:none");
			document.getElementById("defaultCanvas0").setAttribute("style","display:none");

			if($(".RCHLST").hasClass( "RCHLST" )){
				$(".RCHLST").css('display', 'none');
				
			}else{
				$(".animRCHLST").css('display', 'none');
			}	
			g = 255 + (Math.sin(frameCount/100) * 100);
			background(0, 204, 204+g)
			sbmit=document.getElementById("foo");
			sbmit.setAttribute('style', 'display:inline');

			document.getElementById("totalcountup").setAttribute("style", "display:none");		
			if(stateprint==true){			
				totalPuntatje();					
				for( var i = 0; i<preguntes.length; i++){
					
					var newdiv= document.createElement("div");
					newdiv.id="Div"+i;
					newdiv.style.display = 'none';
					document.getElementById("foo").appendChild(newdiv);				
						
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
				newdiv.style.display = 'none';
				document.getElementById("foo").appendChild(newdiv);
				
				totaldate= document.createElement("input");
				totaldate.name="Total";
				totaldate.value = document.getElementById("totalhours").innerHTML+" : "+document.getElementById("totalminutes").innerHTML+" : "+document.getElementById("totalseconds").innerHTML;
				totaldate.readOnly=true;
				document.getElementById(newdiv.id).appendChild(totaldate);
						
				newdiv= document.createElement("div");
				newdiv.id="Div"+i;
				newdiv.style.display = 'none';
				document.getElementById("foo").appendChild(newdiv);
						
				totalpunt= document.createElement("input");
				totalpunt.name="puntatje";
				totalpunt.value = puntatje
				totalpunt.readOnly=true;
				document.getElementById(newdiv.id).appendChild(totalpunt);
				
				newinput= document.createElement("input");
				newinput.name="usuari"
				newinput.id="usuari";
				newinput.placeholder="Usuario: ";
				newinput.classList.add('ginput');
				newinput.style.padding="9.8px";
				document.getElementById("foo").appendChild(newinput);
				
				newinput= document.createElement("input");
				newinput.name="localitzacio"
				newinput.id="localitzacio";
				newinput.placeholder="¿De donde eres?: ";
				newinput.classList.add('ginput');
				newinput.style.padding="9.8px";
				document.getElementById("foo").appendChild(newinput);
									
				var sbmit= document.createElement("button");
				sbmit.id="submit";		
				sbmit.type="submit";
				sbmit.style.display="none";
				sbmit.innerHTML="Envia";
				document.getElementById("foo").appendChild(sbmit);
		
				return stateprint=false;
			}
			if(document.getElementById("usuari").value!=""){
				document.getElementById("submit").style.display="block";
			}else{
				document.getElementById("submit").style.display="none";
				
			}
}
//CALCULA LA PUNTUACIÓ FINAL DEPENENT DE LES RESPOSTES DE L'USUARI
function totalPuntatje(){
	for(var i=0; i<preguntes.length; i++){
		if(preguntes[i].respostes!=undefined){
			if( preguntes[i].respostes==preguntes[i].respostaUsuari){
				puntatje+=preguntes[i].puntatje;
			}	
		}
	}
}
//AJUSTA EL TEXT PERQUÈ NO S'ESCAPI DE LA PANTALLA
function ajustaTextC(txt, height, mida){
	var pregunta=[];
	textSize(mida);
	if(txt.length>=Math.ceil(innerWidth*0.03)){					
		for(var i=0;i<=txt.length-1;i++){
			pregunta+=txt[i];
			if(i==Math.ceil(txt.length/2)){
				pregunta+=' / ';
			}
		}
		lines=pregunta.split('/');				
		for (var i = 0; i<lines.length; i++){
			textC(lines[i], height*0.9+(i*mida*1.2),20 );
		}					
	}
	else{
		lines=txt;
		textC(lines, height,20 );
	}
}

function enunciat(txt, height, mida){
	ajustaTextC(txt, innerHeight*0.12,mida);
	push();
	noFill();
	if(txt.length >= Math.ceil(innerWidth*0.03)){
		rect(halfcanvas-textWidth(txt)*0.32, innerHeight*0.1-25, textWidth(txt)*0.65, textHeight(txt)*2 + 25);
	}else{
		rect(halfcanvas-textWidth(txt)/2 - 30, innerHeight*0.1-25, textWidth(txt)+60, textHeight(txt)*2 + 25);
	}
	pop();	
}

function createStart(){
	var newdiv= document.createElement("div");
		newdiv.id="StartingDiv";
		document.body.appendChild(newdiv);
					
		newinput= document.createElement("input");
		newinput.id="url";
		newinput.type="url";
		newinput.classList.add('ginput');
		newinput.placeholder="URL del cuestionario: ";
		document.getElementById(newdiv.id).appendChild(newinput);
										
		start=false;
}