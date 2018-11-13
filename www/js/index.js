
(function(global) {(function() {if (global.requestAnimationFrame) {return;} if (global.webkitRequestAnimationFrame) {global.requestAnimationFrame = global[ 'webkitRequestAnimationFrame' ]; global.cancelAnimationFrame = global[ 'webkitCancelAnimationFrame' ] || global[ 'webkitCancelRequestAnimationFrame' ];} var lastTime = 0; global.requestAnimationFrame = function(callback) {var currTime = new Date().getTime(); var timeToCall = Math.max(0, 16 - (currTime - lastTime)); var id = global.setTimeout(function() {callback(currTime + timeToCall);}, timeToCall); lastTime = currTime + timeToCall; return id;}; global.cancelAnimationFrame = function(id) {clearTimeout(id);};})(); if (typeof define === 'function') {define(function() {return global.requestAnimationFrame;});}})(window);

var canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var PI = Math.PI;
var HPI = PI / 2;
var PI2 = PI * 2;
var RAD = PI / 180;

window.onresize = function()
{
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
};

var Point = function(x,y){
    this.x = x||0;
    this.y = y||0;
    this.angle = 0;
    this.radius = 0;
    this.radiusAngle = 0;
    this.radiusSpeed = 0;
};

var Circle = function( count, normalLength, radiusIn, radiusOut, color, fill, glow )
{
    count = count % 1 == 0 ? count : ( count + 1 );
    this.count = count;
    this.normalLength = normalLength;
    this.radiusIn = radiusIn;
    this.radiusOut = radiusOut;
    this.color = color;
    this.fill = fill;
    this.glow = glow;

    this.angleSpeed = ( Math.random() - .5 ) * RAD * .1;
    this.points = [];
    this.init();


};

Circle.prototype = {

    init : function()
    {

        var step = PI2 / this.count;
        var angle = Math.random() * PI2;

        this.points = [];

        for( var i = 0; i < this.count; i++ )
        {
            angle += step;

            var p = new Point( 0,0 );

            p.angle = angle;

            p.radius = 0;
            p.radiusAngle = Math.random() * PI2;
            p.radiusSpeed = RAD + Math.random() * 2 * RAD;

            p.normal = this.normalLength;

            this.points.push( p );

        }
    },

    update : function( radiusIn, radiusOut )
    {
        var scope  = this;
        this.points.forEach( function( p )
        {

            p.angle += scope.angleSpeed;

            p.radius = scope.radiusIn + ( .5 + ( .5 *  Math.cos( p.radiusAngle ) ) ) * scope.radiusOut;
            p.radiusAngle += p.radiusSpeed;

            var x = p.x = Math.cos( p.angle ) * p.radius;
            var y = p.y = Math.sin( p.angle ) * p.radius;

            p.lx = x + Math.cos( p.angle + HPI ) * p.normal;
            p.ly = y + Math.sin( p.angle + HPI ) * p.normal;

            p.rx = x + Math.cos( p.angle - HPI ) * p.normal;
            p.ry = y + Math.sin( p.angle - HPI ) * p.normal;


        } );

    },
    render : function( ctx )
    {
        if( this.glow != null ){

            ctx.shadowColor = '#FFF';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

        }

        ctx.strokeStyle = this.color;
        ctx.beginPath();
        this.points.forEach( function( p, i, a ){

            var n = a[ ( i + 1 ) % a.length ];
            ctx.lineTo( p.x, p.y);
            ctx.bezierCurveTo(  p.lx, p.ly, n.rx, n.ry, n.x, n.y );

        });

        if( this.fill != null ){

            ctx.lineWidth = 3;
            ctx.fillStyle = this.fill;
            ctx.fill();
        }

        ctx.stroke();
        ctx.lineWidth = 1;
    }
};

function init( count, pointCount, normal, radiusIn, radiusOut, colors, fills, glow )
{
    for( var i = 0; i < count; i++ )
    {
        var c = new Circle( pointCount, normal, radiusIn, radiusOut, colors[ i%colors.length ], fills != null ? fills[ i%fills.length ] : null, glow );
        circles.push( c );
    }
}

function update()
{
    requestAnimationFrame( update );

    ctx.fillStyle = "#111";
    ctx.fillRect( 0,0,w,h );

    ctx.save();
    ctx.translate(w/2, h/2);

    circles.forEach( function(c)
    {
        c.update();
        c.render(ctx);
    });

    ctx.restore();

}

var debug = true;

var pointCount = 20;
var radiusIn = 300;
var radiusOut = 40;
var normal = 30;
var circles = [];
var strokeColors = [ "#fff" ];
var fillColors = [  "rgba(0,0,0,.8)" ];

init( 3, pointCount, normal, radiusIn, radiusOut, strokeColors, null, true );

strokeColors = [ "#FFF"  ];
init( 1, 12, 20, radiusIn / 3, radiusOut / 3, strokeColors, fillColors, true );
update();