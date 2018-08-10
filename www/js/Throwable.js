class Throwable{
	constructor(radi, posicio){
		this.radi = radi;
		this.pos = posicio;
		this.v = new p5.Vector(0,50);
		this.t = 0;
		this.timebeginning = new Date().getTime();
		
		
		
		this.draw = function(){
			this.updatePos();
			this.updateV();
			this.updateTime();
			fill(255);
			ellipse(this.pos.x, this.pos.y, this.radi, this.radi);
		}
	
		//this.updatePos = 
		
		this.updateV = function(){
			this.v.x;
			this.v.y = this.v.y + gravetat * this.t;
		}
	
		this.updateTime = function(){
			this.t = new Date().getTime() - this.timebeginning;
			this.t = this.t * 0.001;
		}
	}
	

	
}

Throwable.prototype.updatePos = function(){
	this.pos.x = this.pos.x + this.v.x * this.t;
	this.pos.y = this.pos.y + this.v.y * this.t + 0.5 * gravetat * this.t * this.t;
}