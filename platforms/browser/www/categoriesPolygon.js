class Polygon{
	constructor(origin, x, y, radius, npoints, label){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.npoints = npoints;
		this.origin = origin;
		this.label = label;
		this.vertices = [];
		this.autoset();
		this.rotate = true;
	}
}

Polygon.prototype.autoset = function() {
	var x = this.x;
	var y = this.y;
	var radius  = this.radius;
	var npoints = this.npoints;
	var angle = TWO_PI / npoints;
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = x + cos(a) * radius;
		var sy = y + sin(a) * radius;
		this.vertices.push(new p5.Vector(sx, sy));
	}
};

Polygon.prototype.draw = function(){
	push();
	// trasllada i rota matriu
	translate(this.origin.x, this.origin.y);
	if(this.rotate)
		rotate(frameCount / +100.0);	
	this.drawvertices();
	this.drawlabel();
	pop();
};

Polygon.prototype.drawvertices = function (){
	beginShape()
	for(var i = 0;  i < this.vertices.length; i++){
		var v = this.vertices[i];
		if(this.mouseIn(i)){
			fill(0);
		}
		vertex(v.x, v.y); // defineix vertex;
	}
	  endShape(CLOSE);
}

Polygon.prototype.drawlabel = function(){
	var p = this;
	if(p.label != ""){
		push()
		if(this.rotate)
			rotate(frameCount / -100.0);
		textSize(ts);
		var textCenterX = textWidth(p.label, p.x, p.y) / 2;
		text(p.label, p.x - textCenterX, p.y);
		pop();
	}
}

Polygon.prototype.mouseIn = function (i){
	var p = this;
	var j = (i + 1) % p.vertices.length;
	var v = p.vertices[i];
	var t1 = new p5.Vector(p.origin.x, p.origin.y);
	var t2 = new p5.Vector(p.vertices[i].x, p.vertices[i].y);
	var t3 = new p5.Vector(p.vertices[j].x, p.vertices[j].y);
	if(this.rotate){
		t2 = t2.rotate(frameCount/100.0);
		t3 = t3.rotate(frameCount/100.0);
	}
	t2.x += p.origin.x;
	t2.y += p.origin.y;
	t3.x += p.origin.x;
	t3.y += p.origin.y;
	return is_in_triangle(mouseX, mouseY, t1.x, t1.y, t2.x, t2.y, t3.x, t3.y);
}

Polygon.prototype.resize = function(){

}

function setup_categorieslabels(){
	for(var i = 0 ;  i < categoriesLabels.length; i++){
		var o = new p5.Vector(0,0);
		if(categories == 2){}
		if(categories == 3){}
		if(categories == 4){
			var w4 = width/4; var w34 = width*3/4;
			var h4 = height/4; var h34 = height*3/4;
			if(i == 0){ o.x = w4; o.y = h4;}
			if(i == 1){ o.x = w34; o.y = h4;}
			if(i == 2){ o.x = w4; o.y = h34;}
			if(i == 3){ o.x = w34; o.y = h34}				
		}
		poligons.push(new Polygon(o,0,0,radius, punts, categoriesLabels[i]));
	}
}

function setup_enunciat(){
	poligon_enunciat = new Polygon(o_pe, 0, 0, 60, 4, "");
	poligon_enunciat.rotate = false;
}

function draw_categorieslabels(){
	for(var i = 0; i < poligons.length; i++){
		poligons[i].draw();
	}
}

function draw_enunciat(){
	if(enunciats.length > 0){
		poligon_enunciat.label = enunciats[current];
		poligon_enunciat.draw();
	}
}

function is_in_triangle (px,py,ax,ay,bx,by,cx,cy){

	//credit: http://www.blackpawn.com/texts/pointinpoly/default.html

	var v0 = [cx-ax,cy-ay];
	var v1 = [bx-ax,by-ay];
	var v2 = [px-ax,py-ay];

	var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
	var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
	var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
	var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
	var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

	var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;


	var b = ((u >= 0) && (v >= 0) && (u + v < 1));

	return ((u >= 0) && (v >= 0) && (u + v < 1));
}


var poligons = [];

var punts = 9;
var radius = 150;

var o_pe = new p5.Vector(window.innerWidth*0.5, window.innerHeight*0.5);
var poligon_enunciat;
var current = 0;
