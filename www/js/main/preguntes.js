function pushPreguntes(){
	var gran, subpreguntes, numopcions, nump;
	gran = "Aquí va l'enunciat";
	subpreguntes = ["Aquí van els elements a clasificar", "aqui un altre element, dins de la mateixa pregunta"];
	numopcions = 3;
	nump = 68;
	preguntes.push(new Pregunta(gran, subpreguntes, numopcions, nump));


}


function parseja_drive(data, params){
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

function text_a_JSON(data){
	var start = 25;
	var end = data.length - 2;
	var JSONText = data.slice(start,end);
	JParsedText = JSON.parse(JSONText);
	return JParsedText;
}

function executaPeticio(id, todo, params){
	/*id: id del document que llegeix*/
	/*todo: funcio a fer*/
	/*string: per identificar que esta fent*/
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
							todo(xmlhttp.responseText, params);
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

function afegir_pregunta(tip, e,list_gsx){
	if(tip == "Swipe"){
		var gran, subpreguntes = [], numopcions;
		var left, down, right;
		var g = 'gsx$';
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
		}
		preguntes.push(new Pregunta(gran, subpreguntes, numopcions, Math.floor(random(100))));
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
