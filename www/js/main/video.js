function setupVideo(){
	andeerson = createVideo('vid/Penrose.mp4');
}
function drawVideo(){
	var amplevid = andeerson.width;
	var ratio = innerWidth / amplevid;
	var altvid = andeerson.height * ratio;
	
		if(andeerson.time() >= andeerson.duration()){
			rectangle.update();
			rectangle.draw();
		}
		else{
			image(andeerson, innerWidth/2 , innerHeight/2 , 100, altvid );
			if(keyIsPressed){
				andeerson.play();
			}
		}
}