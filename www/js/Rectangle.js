

class Rectangle{
	constructor(x, y, r){
		this.r = 90;
		this.x = x;
		this.y = window.innerHeight * .5;
		this.vx = (mouseX < window.innerWidth*.5) ? -200 : 200;
		this.vy = 0;
		this.t0 =  new Date().getTime();
		this.t = 0;
		this.a = 2;
		this.color = color(255,255,255);
		this.text = "Ese cristalito roto yo sentía como crujía, antes de caerse al suelo ya sabía que se rompía una voz en la escalera, alguien cruzando el pasillo";
		this.ample = this.r*3;
		this.alt = this.r*4;
		this.colortext = color(0,0,0);
	}
}

Rectangle.prototype.update = function(){
	this.updateParams();
}

Rectangle.prototype.draw = function(){
	this.updateParams();
	push();
	fill(this.color);
	rect(this.x - this.ample*.5, this.y - this.alt*.5, this.ample, this.alt, 50);
	pop();

	this.drawText();
}

Rectangle.prototype.updateParams = function(){
	this.updatePos();
	this.updateV();
	this.updateT();
}

Rectangle.prototype.updatePos = function(){
	this.x = this.x + this.vx * this.t;
	this.y = this.y + this.vy * this.t + .5 * this.a * this.t * this.t;
}

Rectangle.prototype.updateV = function(){
	this.vy = this.vy + this.a * this.t;
}

Rectangle.prototype.updateT = function(){
	this.t = new Date().getTime() - this.t0;
	this.t = this.t * 0.001;
}
Rectangle.prototype.drawText = function(){
	push();
	fill(this.colortext);
	textSize(20);

	// separa paraules segons espai i calculca les divisions que calen
	var array_text = this.text.split(" ");
	var num_blocs = 1, lgran, lpeqe;
	[num_blocs,lgran,lpeqe] = this.calcula_blocs_lgran_lpeqe(num_blocs, lgran, lpeqe, array_text);

	if(num_blocs == 1){
		var pmig = this.x - this.ample*.5 + (this.ample*.5 - textWidth(this.text)/2);
		text(this.text, pmig , this.y - 50);
	}
	else{
		for(var i = 0;  i < num_blocs-1; i++){
			params = {array_text: array_text, lgran:lgran, lpeqe:lpeqe, x:this.x, ample:this.ample, y:this.y};
			this.recorre_arraytext(this.calcula_puntmig, this.escriutext, params);
		}
	}
	pop();
}

Rectangle.prototype.calcula_blocs_lgran_lpeqe = function(num_blocs,lgran,lpeqe, array_text){
	var amplada_text = textWidth(this.text);
	for(var num_blocs = 1; amplada_text > this.ample; num_blocs++){
		amplada_text = 0;
		lgran = Math.floor(array_text.length / num_blocs) + array_text.length % num_blocs;
		lpeqe = Math.floor(array_text.length/ num_blocs)
		params = {array_text: array_text, lgran:lgran, lpeqe:lpeqe, amplada_text:amplada_text};
		params = this.recorre_arraytext(function(params){return params;}, this.update_amplada_maxima, params);
		amplada_text = params.amplada_text;
	}
	return [num_blocs,lgran,lpeqe];
}

Rectangle.prototype.recorre_arraytext = function(preif, inif, params){
		var textloop = "", textlw;
		var cd = 0;
		for( var j = 0; j < params.array_text.length; j++){
			textloop = textloop + " " + params.array_text[j];
			textlw = textWidth(textloop);
			params.textloop = textloop;
			params.textlw = textlw;
			params.cd = cd;
			params = preif(params);
			if(j == (params.lgran-1) + params.lpeqe * cd){
				params = inif(params);
				textloop = "";
				cd = cd+1;
			}
		}
		return params;
	}

Rectangle.prototype.update_amplada_maxima = function(params){
		if(params.amplada_text <params.textlw){params.amplada_text = params.textlw;}
		return params;
	}

Rectangle.prototype.calcula_puntmig = function(params){
		params.pmig = params.x - params.ample*.5 + (params.ample*.5 - params.textlw/2);
		return params;
	}
Rectangle.prototype.escriutext = function(params){
		text(params.textloop, params.pmig, params.y - 100 + 25*params.cd );
		return params;
	}
