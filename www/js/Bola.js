class Bola{
	constructor(x, y, r){
		this.r = 90;
		this.x = x;
		this.y = window.innerHeight * .5;
		this.vx = (mouseX < window.innerWidth*.5) ? -50 : 80;
		this.vy = 0;
		this.t0 =  new Date().getTime();
		this.t = 0;
		this.a = 2;
		this.color = color(255,255,255);
	}
}

Bola.prototype.draw = function(){
	this.updateParams();
	push();
	fill(this.color);
	ellipse(this.x, this.y, this.r, this.r);
	pop();	
}

Bola.prototype.updateParams = function(){
	this.updatePos();
	this.updateV();
	this.updateT();
}

Bola.prototype.updatePos = function(){
	this.x = this.x + this.vx * this.t;
	this.y = this.y + this.vy * this.t + .5 * this.a * this.t * this.t;
}

Bola.prototype.updateV = function(){
	this.vy = this.vy + this.a * this.t;
}

Bola.prototype.updateT = function(){
	this.t = new Date().getTime() - this.t0;
	this.t = this.t * 0.001;
}