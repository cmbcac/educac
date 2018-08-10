function preloadMenu(){
	fontTitol = loadFont('fonts/Bubblegum.ttf');
}
function setupMenu(){
	menu_locked = false;
	ip = 0;
	isp = 0;
	pushPreguntes();
}


function drawMenu(){
	push();

	// sobre pantalla, bloqueja si quasi fora

	if(mouseY < height*0.1 &&  !menu_locked){
		var rat = mouseY / height;
		var comp01 = 0.1 - rat;
		var com25 = comp01*height;
		htext = com25*5;
		if(mouseY <= 0){menu_locked = true;}
		if(mouseY < height*0.05){htext = height*.5; menu_locked =true;}
		paused = true;
	}
	// pinta fora
	else if(menu_locked && (mouseY > (height*.5 + textSize()/2))){
		menu_locked = false;
		htext = -20
		paused = false;
	}

	// titol menu

	fill('#ED225D');
	textFont(fontTitol);
	textSize(100);

	text("Pregunta: " + preguntes[ip].numero, width/2-textWidth("Pregunta: " + preguntes[ip].numero)/2, htext );
	pop();
	push();
	fill(255, 0, 255);
	ellipse(width*0.1, htext, 30, 30);
	pop();
	push();
	fill(0, 255, 255);
	ellipse(width*0.9, htext, 30, 30);
	pop();


}
