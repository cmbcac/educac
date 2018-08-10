var canvas;
function setup(){
	canvas = createCanvas(window.innerWidth, window.innerHeight);
	cw = width / 2;
	ch = height /2;
}

function draw(){

	background(233,233,184);

	
	push();
	fill("#ffb1b1");
	ellipse(cw/4,ch*3/2,200,200);
	pop();
	push();
	fill("#d2ffb1");
	ellipse(cw*7/4,ch*3/2,200,200);
	pop();
	push();
	fill("#b1daff");
	ellipse(cw, ch*7/4, 200,200);
	pop();
	
	var t1 = cw - textWidth("He denunciado algún programa de televisión por alguna falta") / 2;
	
	if(mouseIsPressed){
		push();
		translate(mouseX - cw, mouseY -ch);
		rect(cw-250, 120, 500, 600, 20);
		//rotate(frameCount/-100);
		
		var t2 = cw - textWidth("Mi perfil e alguna red social") / 2;
		var t3 = (120 + 600)/2 ;
		textSize(24);
		text("He denunciado algún programa de televisión por alguna falta", t1, 60);
		text("Mi perfil de alguna red social", t2, t3); 
		if(mouseX < cw/2){
			text("nope", cw, 200);
		}
		if(mouseX > cw*3/2){
			text("aye", cw,200);
		}
		pop();
	}
	else{
		rect(cw-250, 120, 500, 600, 20);
		
		var t2 = cw - textWidth("Mi perfil e alguna red social") / 2;
		var t3 = (120 + 600)/2 ;
		textSize(24);
		text("He denunciado algún programa de televisión por alguna falta", t1, 60);
		text("Mi perfil de alguna red social", t2, t3); 
		
	}

	
	
}