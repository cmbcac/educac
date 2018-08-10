function setupVideo(){
	andeerson = createVideo(['vid/Penrose.mp4']);
}
function drawVideo(){
	var amplevid = andeerson.width;
	var ratio = rectw / amplevid;
	var altvid = andeerson.height * ratio;
	
		if(andeerson.time() >= andeerson.duration()){
			rectangle.update();
			rectangle.draw();
		}
		else{
			image(andeerson, centre.x - rectw/2, centre.y - recth/4, rectw, altvid );
			if(keyIsPressed){
				andeerson.play();
			}
		}
}