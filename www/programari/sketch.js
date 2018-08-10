var myCanvas;

class Polygon{
	constructor(origin, x, y, radius, npoints){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.npoints = npoints;
		this.origin = origin;
		this.enunciat = "";
		this.vertices = [];	
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
	}
}

var arrayPoly = [];
function setup() {
  // put setup code here
  myCanvas = createCanvas(window.innerWidth, window.innerHeight);
  var o = new p5.Vector(width*0.5, height*0.5);
  var r = 300;
  var np = 4;
  var poly = new Polygon(o, 0, 0, r, np);
  poly.enunciat = "hey";
  arrayPoly.push(poly);

}

function draw() {
	// put drawing code here
  	background("#F8CDFF");
  	for(var i = 0; i < arrayPoly.length; i++){
  		pintaPolygon(arrayPoly[i]);
  	}
  	text("x: "+ mouseX+"\ny: "+mouseY, 5, 140);
  	text2.x+=window.innerWidth/2;
  	text2.y+=window.innerHeight/2;

  	var prov = new p5.Vector(300,0);
  	prov = prov.rotate(frameCount / 100.0);
  	prov.x += width*0.5;
  	prov.y += height*0.5;
}

function pintaPolygon(p){

	push();
	translate(p.origin.x, p.origin.y);
	rotate(frameCount / +100.0);
	//polygon(p);
	beginShape()
	for(var i = 0;  i < p.vertices.length; i++){
		var j = (i + 1) % p.vertices.length;
		var v = p.vertices[i];
		var t1 = new p5.Vector(p.origin.x, p.origin.y);
		var t2 = new p5.Vector(p.vertices[i].x, p.vertices[i].y).rotate(frameCount/100.0);
		var t3 = new p5.Vector(p.vertices[j].x, p.vertices[j].y).rotate(frameCount/100.0);
		t2.x += p.origin.x;
		t2.y += p.origin.y;
		t3.x += p.origin.x;
		t3.y += p.origin.y;
		if(is_in_triangle(mouseX, mouseY, t1.x, t1.y, t2.x, t2.y, t3.x, t3.y)){
			fill(0);
		}
		vertex(v.x, v.y);
		text2 = t2.rotate(frameCount / 100.0);
	}
	endShape(CLOSE);
	if(p.enunciat != ""){
		push()
		rotate(frameCount / -100.0);
		textSize(40);
		var textCenterX = textWidth(p.enunciat, p.x, p.y) / 2;
		text(p.enunciat, p.x - textCenterX, p.y);
		pop();
	}
	pop();
}

function polygon(p) {
	var x = p.x;
	var y = p.y;
	var radius  = p.radius;
	var npoints = p.npoints;
	p.vertices = [];

	var angle = TWO_PI / npoints;
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = x + cos(a) * radius;
		var sy = y + sin(a) * radius;
		p.vertices.push(new p5.Vector(sx, sy));
		vertex(sx, sy);
	}
	endShape(CLOSE);
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
	text4 = b + "\npx:"+px+"\t+py:"+py;
	text4 += "\nax:"+ax+"\tay:"+ay;
	text4 += "\nbx:"+bx+"\tby:"+by;
	text4 += "\ncx:"+cx+"\tcy:"+cy;
	return ((u >= 0) && (v >= 0) && (u + v < 1));
}

function rotate_point( cx, cy, angle, p)
{
  var s = sin(angle);
  var c = cos(angle);

  // translate point back to origin:
  p.x -= cx;
  p.y -= cy;

  // rotate point
  var xnew = p.x * c - p.y * s;
  var ynew = p.x * s + p.y * c;

  // translate point back:
  p.x = xnew + cx;
  p.y = ynew + cy;
  return p;
}

window.addEventListener('resize', function(){
	myCanvas.size(window.innerWidth, window.innerHeight);
});


