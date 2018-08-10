var canvas;
var estats = ["inici", "playing", "pause", "error"], estatdelsistema = "inici", missatgeerror = "";
var id_drive = "1zgbpqe7rz29bWPg2Qw7AAwPrftHGUyrJHJd9_NXdGKA";

var ESC = 27;
var SPACE = 32;
var ESQUERRA = 37;
var DRETA = 39;

var preguntes = [];
var current = 0;


// vars pel swipe
var backswipe;
var estatswipe = "nomig", estats_swipe = ["nomig", "migsense", "migamb", "dreta", "esquerra"];
var isubp = 0;

//vars pel drag;
var backdrag;
var isubp2 = 0;
var lastframemouse;
function preload(){
  //carrega bbdd
  util_xmlhttp(id_drive, set_preguntes,{}, function(){} )

}

function setup(){
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  backswipe =  color(144, 145, 232, 0.2*255);
  lastframemouse = mouseIsPressed;
}

function draw(){

  if(estatdelsistema == "inici" ){
    var g = 202.5 + (Math.sin(frameCount/100) * 52.5);
    background(211, g, 190);
    textC("Inici", innerHeight * .5, 30);
    if(((preguntes.length == 0) || (preguntes == undefined))){
      textC("No hi ha preguntes disponibles", innerHeight * .5 + 45, 15);
    }
    else{
      textC("Clica enter per començar", innerHeight * .5 + 45, 15);
    }
  }

  if(estatdelsistema == "pause"){
    background(199, 233, 222);
    textC("Pausa", innerHeight * .5, 30);
    textC("Clica espai o enter per seguir", innerHeight * .5 + 45, 15);

    if(preguntes.length > 0){
      textC("PREGUNTA: " + preguntes[current].numero, innerHeight * .5 + 100, 20);
      textC(preguntes[current].tipologia, innerHeight * .5 + 125, 13);
    }
  }

  if(preguntes.length > 0 && estatdelsistema == "playing"){
    var p = preguntes[current];
    var tipo = p.tipologia;

    if(tipo == "Multiple - Choice"){
      background(211, 112, 123);
      textSize(20);
      let half1 = innerWidth * .5
      let half2 = textWidth(p.gran) * .5;
      let height1 = innerHeight*.5;
      text(p.gran, half1-half2, height1);
      if(p.subpreguntes.length > 0){
        for(var i = 0; i < p.subpreguntes.length; i++){
          let e = p.subpreguntes[i];
          if( e == "") continue;
          let fontsize = 14;
          textSize(fontsize);
          let half3 = textWidth(e)*.5;
          let x = half1 - 50;
          let y = height1 + 20 * (i+1);
          let w =  textWidth(e)
          let h = fontsize;

          push();
          if(mouseX > x && mouseX < x+w && mouseY > (y-14) && mouseY < (y-14+h)){
            fill(130,244, 123);
            if(mouseIsPressed){
              preguntes[current].respostaUsuari.push(e);
              current ++;
              current %= preguntes.length;
            }
          }
          ellipse(x - 10, y - 5, 6, 6);
          text(e, x, y );
          pop();

        }
      }
    }


    if(tipo == "Swipe"){
      background(255, 255, 255);
      //circlesInPolygonC(quarterwidth2, quarterheight3, 300, 2, 200, TWO_PI/4);
      try{
		  if(p.numopcions != 2 && p.numopcions != 3) throw("El numero de opcions hauria de ser 2 o 3");

		  push();
		  textSize(14);
		  text(p.opcions[0], quarterwidth, quarterheight2);
		  text(p.opcions[2], quarterwidth3, quarterheight2);
		  if(p.numopcions == 3) text(p.opcions[1], quarterwidth2, quarterheight3);
		  pop();
      let w = textWidth(p.subpreguntes[isubp]);
      let h = textHeight(p.subpreguntes[isubp], w);
      w+=40;
      h+=20;
		  //let w = innerWidth * .1;
		  //let h = innerHeight * .1;
		  let dinsw = entre(mouseX, quarterwidth2 - w*.5, quarterwidth2 + w*.5);
		  let dinsh = entre(mouseY, quarterheight2 - h*.5, quarterheight2 + h*.5);
		  if(dinsw && dinsh && estatswipe == "nomig"){
			  estatswipe = "migsense";
		  }
		  if(dinsw && dinsh && estatswipe == "migsense" && mouseIsPressed){
			  estatswipe = "migamb";
		  }
		  if((!dinsw || !dinsh) && estatswipe == "migsense"){
			  estatswipe = "nomig";
		  }

		  if(entre(mouseX, 0, quarterwidth) && estatswipe == "migamb") {
			  estatswipe = "esquerra";
		  }
		  if(entre(mouseX, quarterwidth3, innerWidth) && estatswipe == "migamb"){
			  estatswipe = "dreta";
		  }

		  if( estatswipe == "nomig"){
  			rectC(quarterwidth2, quarterheight2, w , h );
  			textC(p.subpreguntes[isubp], quarterheight2, 20);
		  }
		  if (estatswipe == "migsense"){
			  push();
			  fill(200,200,234, 0.2*255);
			  rectC(quarterwidth2, quarterheight2, w , h);
			  pop();
			  textC(p.subpreguntes[isubp], quarterheight2, 20);
		  }
      if(estatswipe == "migamb" || estatswipe == "dreta" || estatswipe == "esquerra"){
        push();
        let c1, percent;
        from = color(255, 255, 255, 0.2 * 255);
        to = color(255, 0, 0, 0.2 * 255);
        to2 = color(0, 255, 0, 0.2 * 255);
        if(mouseX < quarterwidth2){
          percent = 1 - (mouseX - quarterwidth) / quarterwidth;
          c1 = lerpColor(from, to, percent);
        }
        if(mouseX > quarterwidth2){
          percent = (mouseX - quarterwidth2) / quarterwidth;
          c1 = lerpColor(from, to2, percent);
        }
        if(mouseX == quarterwidth2){
          c1 = color(255);
        }

        background(c1);
        pop();
      }
		  if( estatswipe == "migamb"){
			  push();
			  fill(200,200,234);
			  rectC(mouseX, mouseY, w , h);
			  pop();
			  textC2(p.subpreguntes[isubp], mouseX, mouseY, 20);
		  }
		  if( estatswipe == "esquerra"){
			  preguntes[current].respostaUsuari.push(p.opcions[0]);
		  }
		  if( estatswipe == "dreta"){
			  preguntes[current].respostaUsuari.push(p.opcions[2]);
		  }
		  if( estatswipe == "dreta" || estatswipe == "esquerra"){
			  isubp++;
			  estatswipe = "nomig";
			  if(isubp == p.subpreguntes.length){
				  isubp = 0;
				  current++;
				  current %= preguntes.length;
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

    if(tipo == "Drag - Categorías"){
      background(190, 210, 190);
      let numopcions = p.numopcions;
      textC(p.subpreguntes[isubp2], quarterheight2, 23);
      try{
        if(numopcions == 4){
          circlesInPolygonC(quarterwidth2, quarterheight2, 250, 4, 200, 0);
        }
        else if(numopcions == 5){
          var posipunts;
          var rad = 250;
          var radiusellipse = 200;
          var angleinicial = 0;
          //circlesInPolygonC(quarterwidth2, quarterheight2, 250, 5, 200, 0);
          posipunts = returnPointsInPolygon(quarterwidth2, quarterheight2, rad, numopcions, radiusellipse, angleinicial);
          for(var i = 0; i < posipunts.length; i++){
            let x = posipunts[i].x;
            let y = posipunts[i].y;
            let dins = dist(x, y, mouseX, mouseY) < radiusellipse;
            push()
            if(dins && mouseIsPressed && !lastframemouse){
              isubp2++;
              if(isubp2 == p.subpreguntes.length){
                isubp2 = 0;
                current++;
                current %= preguntes.length;
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
            textC2(p.subpreguntes[i], x, y, 11);
            line(x , y, quarterwidth2, quarterheight2);

          }



        }
        else{
          throw("El numero d'opcions hauria de ser 4 o 5");
        }
      }
      catch(error){
        console.log(error);
        missatgeerror = error;
        estatdelsistema = "error";
      }
      lastframemouse = mouseIsPressed;


    }
  }

  if(estatdelsistema == "error"){
    background(199, 100, 100);
    textC("Error", innerHeight * .5, 30);
    textC("Clica espai o enter per anar a pausa i canviar de pregunta", innerHeight * .5 + 45, 15);
    textC(missatgeerror, innerHeight * .5 + 125, 13);
  }

  push()
  fill(121);
  text(estatdelsistema, 40, 40);
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
  if(keyCode === ENTER && estatdelsistema == "inici" && preguntes.length > 0){
    estatdelsistema = "playing";
    return;
  }

  //on playing
  if(keyCode ===  SPACE &&  estatdelsistema == "playing"){
    estatdelsistema = "pause";
    return;
  }
  if(keyCode === ESC && estatdelsistema == "playing"){
    estatdelsistema = "pause";
    return;
  }

  //on pause
  if((keyCode === SPACE || keyCode === ENTER) && estatdelsistema == "pause"){
    estatdelsistema = "playing";
    return;
  }
  if(keyCode === ESC && estatdelsistema == "pause"){
    estatdelsistema = "inici";
    return;
  }
  if(keyCode === DRETA && estatdelsistema == "pause"){
    console.log("Següent Pregunta");
    current ++;
    current %= preguntes.length;
    return;
  }
  if(keyCode === ESQUERRA && estatdelsistema == "pause"){
    console.log("Pregunta Anterior");
    current --
    if(current < 0) current = 0;
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
    let tip = e['gsx$tipodepregunta'].$t;
    let list_gsx = [];
    if(tip == "Multiple - Choice") list_gsx = multichoice_gsx;
    if(tip == "Drag - Categorías") list_gsx = drag_gsx;
    if(tip == "Filtro") list_gsx = filtro_gsx;
    if(tip == "Swipe") list_gsx = swipe_gsx;
    afegir_pregunta(tip, e, list_gsx);
  }

}

function afegir_pregunta(tip, e,list_gsx){
  var g = 'gsx$';
	if(tip == "Swipe"){
		var gran, subpreguntes = [], numopcions, respostes = [];
		var left, down, right;
		left = e[g+'mensajesecciónizquierda'].$t;
		down = e[g+'mensajeseccióncentral-inferior'].$t;
		right= e[g+'mensajesecciónderecha'].$t;
		if(left&&down&&right) numopcions = 3;
		if(left&&right) numopcions = 2;
		if(!left && !right && ! down) return 0;
		for(var i = 0; i < list_gsx.length; i++){
			let current = list_gsx[i];
			let ecurrent = e[g+current].$t;
			if(current.includes("elem") && ecurrent){
				subpreguntes.push(ecurrent);
			}
			if(current.includes("enun") && ecurrent) gran = ecurrent;
			if(current.includes("resp") && ecurrent) respostes.push(ecurrent);
		}
		var p = new Pregunta(gran, subpreguntes, numopcions, Math.floor(random(100)));
		p.tipologia = tip;
		p.respostes = respostes;
		p.opcions = [left, down, right];
		preguntes.push(p);
	}

  if(tip == "Drag - Categorías"){
    categories = [];
    categories.push(e[g+'categoría1'].$t);
    categories.push(e[g+'categoría2'].$t);
    categories.push(e[g+'categoría3'].$t);
    categories.push(e[g+'categoría4'].$t);
    categories.push(e[g+'categoría5'].$t);
    elementos = [];
    for(var i = 1; i < 16; i++){
      elementos.push(e[g+'elemento'+String(i)].$t);
    }
    respuestascorrectas = [];
    respuestascorrectas.push(e[g+'respuestacorrecta1_2'].$t);
    for(var i = 2; i < 16; i++){
      respuestascorrectas.push(e[g+'respuestacorrecta'+String(i)].$t);
    }
    var p = new Pregunta(categories, elementos, categories.length, Math.floor(random(100)));
    p.tipologia = tip;
    p.respostes = respuestascorrectas;
    preguntes.push(p);

  }

  if(tip == "Multiple - Choice"){
    var gran, subpreguntes = [], resp;
    multichoice_gsx.forEach(element => {
      if(element.includes("enun")){
        gran = e[g+element].$t
      }
      if(element.includes("opc")){
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
"enunciado_2",
"opción1",
"opción2",
'opción3',
'opción4',
'opción5',
'respuestacorrecta_2'];

var drag_gsx = [
	'categoría1',
	'categoría2',
	'categoría3',
	'categoría4',
	'categoría5',
	'elemento1',
	'elemento2',
	'elemento3',
	'elemento4',
	'elemento5',
	'elemento6',
	'elemento7',
	'elemento8',
	'elemento9',
	'elemento10',
	'elemento11',
	'elemento12',
	'elemento13',
	'elemento14',
	'elemento15',
	'respuestacorrecta1_2',
	'respuestacorrecta2',
	'respuestacorrecta3',
	'respuestacorrecta4',
	'respuestacorrecta5',
	'respuestacorrecta6',
	'respuestacorrecta7',
	'respuestacorrecta8',
	'respuestacorrecta9',
	'respuestacorrecta10',
	'respuestacorrecta11',
	'respuestacorrecta12',
	'respuestacorrecta13',
	'respuestacorrecta14',
	'respuestacorrecta15'
];

var swipe_gsx = [
	'elementoaclasificar1',
	'elementoaclasificar2',
	'elementoaclasificar3',
	'elementoaclasificar4',
	'elementoaclasificar5',
	'elementoaclasificar6',
	'elementoaclasificar7',
	'elementoaclasificar8',
	'elementoaclasificar9',
	'elementoaclasificar10',
	'enunciado',
	'mensajeseccióncentral-inferior',
	'mensajesecciónderecha',
	'mensajesecciónizquierda',
	'respuestacorrecta1',
	'respuestacorrecta2_2',
	'respuestacorrecta3_2',
	'respuestacorrecta4_2',
	'respuestacorrecta5_2',
	'respuestacorrecta6_2',
	'respuestacorrecta7_2',
	'respuestacorrecta8_2',
	'respuestacorrecta9_2',
	'respuestacorrecta10_2'
];

var filtro_gsx = [
	'añadirmultimedia',
	'respuestacorrecta'
];

class Pregunta{
	constructor(gran, subpreguntes, numopcions, nump){
		this.gran = gran;
		this.subpreguntes = subpreguntes;
		this.numopcions = numopcions;
		this.numero = nump;
		this.respostaUsuari = [];
	}
}
