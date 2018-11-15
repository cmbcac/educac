var quarterwidth = innerWidth * .25;
var quarterwidth2 = innerWidth * .50;
var quarterwidth3 = innerWidth * .75;
var quarterheight = innerHeight * .25;
var quarterheight2 = innerHeight * .50;
var quarterheight3 = innerHeight * .75;
var puntatje=0;
function entre(x, a, b){
	return x > a && x < b;
}

function centraText(t, pos){
	pos.x = pos.x - textWidth(t)/2;
	return pos;
}

function textC(missatge, y, size){
	///

	push();
	textSize(size);
	ctx.font=size+'px Verdana';;
	let half1 = innerWidth * .5;
	let half2 = textWidth(missatge) * .5;
	let x = half1 - half2;
	text(missatge, x, y);
	pop();
}

function textC2(missatge, x, y, size ){
	push();
	textSize(size);
	 ctx.font = size+"px Arial"
	let half1 = textWidth(missatge) * .5;
	let px = x - half1;
	let half2 = textHeight(missatge, textWidth(missatge)) * .5;
	let py = y;
	text(missatge, px, py);
	pop();
}

function rectC(x, y, w, h){
	let half1 = w *.5;
	let half2 = h *.5;
	
	rect(x-half1, y - half2, w, h,10);
}

window.onresize = function(){
  resizeCanvas(window.innerWidth, window.innerHeight);
	resizevArialbles();
}

function resizevArialbles(){
	quarterwidth = innerWidth * .25;
	quarterwidth2 = innerWidth * .50;
	quarterwidth3 = innerWidth * .75;
	quarterheight = innerHeight * .25;
	quarterheight2 = innerHeight * .50;
	quarterheight3 = innerHeight * .75;
}

function rectangleCentrat(w, h){
	var p1 = (window.innerWidth - w)*.5;
	var p2 = (window.innerHeight- h)*.5;
	rect(p1, p2, w, h);
}

function text_a_JSON(data){
	var start = 25;
	var end = data.length - 2;
	var JSONText = data.slice(start,end);
	JParsedText = JSON.parse(JSONText);
	return JParsedText;
}

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
				} else {
						line = testLine;
				}
		}

		return h;
}

function creaSubmit(stateprint){

document.getElementById("passar").setAttribute("style", "display:none");
			document.getElementById("infopass").setAttribute("style", "display:none");
			document.getElementById("txtpassar").setAttribute("style", "display:none");
			g = 255 + (Math.sin(frameCount/100) * 100);
			background(0, 204, 204+g)
			sbmit=document.getElementById("foo");
			sbmit.setAttribute('style', 'display:inline');
			sbmit.style.position = 'absolute';
			sbmit.style.left = 40+'vw';
			sbmit.style.top = 20+'vh';
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
					
					var sbmit= document.createElement("button");
					sbmit.id="submit";		
					sbmit.type="submit";
					sbmit.innerHTML="Envia";
					document.getElementById("foo").appendChild(sbmit);
					
					
					
					return stateprint=false;
			}

			 if(end==true){
				
			 }
}

function totalPuntatje(){
	

	for(var i=0; i<preguntes.length; i++){
		if(preguntes[i].respostes!=undefined){
			if( preguntes[i].respostes==preguntes[i].respostaUsuari){
				puntatje+=preguntes[i].puntatje;
			}	
		}
	}
	
}

function historial(){

chrome.history.search({text: '', maxResults: 10}, function(data) {
    data.forEach(function(page) {
        console.log(page.url);
    });
});

}