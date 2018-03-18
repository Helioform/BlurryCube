var w,h;
var c,ctx;
var cube=[];
var t;
var beginloop, endloop;
var timeelapsed;
var fps;
var animspeedrange;
var animspeed;
var cubecoloropt;
var cubecolor;
var transrange;
var trans;

function cos(t) { return Math.cos(t);}
function sin(t) { return Math.sin(t);}      
 
window.addEventListener('load', function()
{                     
    init();
    setInterval(draw,1/fps);
});
 
function drawText(s,x,y)
{
    ctx.font="20px Georgia";
    ctx.fillStyle="Red";
    ctx.fillText(s, x,y);
}

function vert2d(x,y)
{
     this.x=x;
     this.y=y;
}

function vert3d(x,y,z)
{
     this.x=x;
     this.y=y;
     this.z=z;
}

function init()
{
    c=document.querySelector("canvas");
    ctx=c.getContext('2d');
    c.width=window.innerWidth;
    c.height=window.innerHeight;
    w=c.width;
    h=c.height;
    animspeedrange=document.getElementById("anim_speed");
    animspeed=0.0009;
    cubecoloropt=document.getElementById("cube_color");
    transrange=document.getElementById("trans");
    trans=0.05;
    
    animspeedrange.onchange = function()
    {
        animspeed=animspeedrange.value/100000;   
    }
    
    transrange.onchange = function()
    {
        trans=(1-10/transrange.value); 
        var color = cubecoloropt.options[cubecoloropt.selectedIndex].value;
        if(color=="Red")
            cubecolor="rgba(255,0,0,"+trans.toString()+")";
        else if(color=="Green")
            cubecolor="rgba(0,255,0,"+trans.toString()+")";
        else if(color="Blue")
            cubecolor="rgba(0,0,255,"+trans.toString()+")";
    }
    
    cubecoloropt.onchange = function()
    {
        var color = cubecoloropt.options[cubecoloropt.selectedIndex].value;
        if(color=="Red")
            cubecolor="rgba(255,0,0,"+trans.toString()+")";
        else if(color=="Green")
            cubecolor="rgba(0,255,0,"+trans.toString()+")";
        else if(color=="Blue")
            cubecolor="rgba(0,0,255,"+trans.toString()+")";
    }
    
    cubecolor="rgba(0,255,0, 0.45)";
    
    cube = new Array(8);
    cube[0]=new vert3d(-1,1,-4);
    cube[1]=new vert3d(1,1,-4);
    cube[2]=new vert3d(1,-1,-4);
    cube[3]=new vert3d(-1,-1,-4);
    cube[4]=new vert3d(-1,1,-2);
    cube[5]=new vert3d(1,1,-2);
    cube[6]=new vert3d(1,-1,-2);
    cube[7]=new vert3d(-1,-1,-2);
    
    t=0;
    timeelapsed=0;
    beginloop=0;
    endloop=new Date();
    fps=60/1000;
    alert("This demo shows how to render filled 3d triangles with 2d line drawing functions. This is the basis for a software 3d engine.");
}


function project(p)
{
     return new vert2d(p.x/p.z, -p.y/p.z);
}

function scale(p, w,h)
{
    var px= (p.x*w/2.0)+w/2.0;
    var py=-((p.y*h)/2.0) + h/2.0;
    
    return new vert2d(px,py);
}

function rotateY(p, r)
{
    var px = p.x*cos(r) - p.z*sin(r);
    var py = p.y;
    var pz = p.x*sin(r) + p.z*cos(r);
    
    return new vert3d(px,py,pz);
}

function rotateX(p, r)
{
    var px = p.x;
    var py = p.y*cos(r)+p.z*sin(r);
    var pz = -p.y*sin(r)+p.z*cos(r);
    return new vert3d(px,py,pz);
}

function rotateZ(p, r)
{
    var px = p.x*cos(r)+p.y*sin(r);
    var py = -p.x*sin(r)+p.y*cos(r);
    var pz = p.z;
    return new vert3d(px,py,pz);
}

function translate(p, dx,dy,dz)
{
    var px = p.x + dx;
    var py = p.y + dy;
    var pz = p.z + dz;
    return new vert3d(px,py,pz);
}

function drawLine(x1,y1,x2,y2,c)
{
    ctx.strokeStyle=c;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
}

function drawBottomTri(x1,y1,x2,y2,x3,y3,c)
{
    var invslope1 = (x2-x1)/(y2-y1);
    var invslope2 = (x3-x1)/(y3-y1);
    
    var xleft=x1;
    var xright=x1;
    
    for(y=y1;y<=y2;y++)
    {
        drawLine(xleft, y, xright, y, c);
        xleft+=invslope1;
        xright+=invslope2;
    }    
}

function drawTopTri(x1,y1,x2,y2,x3,y3,c)
{
    var invslope1 = (x3-x1)/(y3-y1);
    var invslope2 = (x3-x2)/(y3-y2);
    
    var xleft=x3;
    var xright=x3;
    
    for(y=y3;y>y1;y--)
    {
        drawLine(xleft, y, xright, y, c);
        xleft-=invslope1;
        xright-=invslope2;
    }
    
}

function drawTri(x1,y1,x2,y2,x3,y3,c)
{

// sort tri edges by height 
    var tmpx,tmpy;
    
    if(y1 > y2)
    {
         tmpx=x1;
         tmpy=y1;
         y1=y2;
         x1=x2;
         x2=tmpx;
         y2=tmpy;
    }
    
    if(y1 > y3)
    {    
         tmpx=x1;
         tmpy=y1;
         y1=y3;
         x1=x3;
         y3=tmpy;
         x3=tmpx;
    }
    
    if(y2 > y3)
    {
         tmpy=y2;
         tmpx=x2;
         y2=y3;
         x2=x3;
         y3=tmpy;
         x3=tmpx;
    }
     
     // Trivial cases of flat top and flat bottom trianglea
    if(y2==y3)
        drawBottomTri(x1,y1,x2,y2,x3,y3,c);
    else if(y1==y2)
        drawTopTri(x1,y1,x2,y2,x3,y3,c);
    else
    {        
        // Otherwise decompose into 2 triangles
        var x4 = x1 + ((y2 - y1)/(y3-y1))*(x3-x1);
        var y4 = y2;
    
        drawBottomTri(x1,y1,x2,y2,x4,y4,c);
        drawTopTri(x2,y2,x4,y4,x3,y3,c);      
    }      
    

}


function draw()
{   
    beginloop=new Date();
    ctx.fillStyle="rgba(0,0,0,0.01)";
    ctx.fillRect(0,0,w,h);
 
    // translate back to origin so we can rotate around it
    var vt=[];
    for(i=0;i<8;i++) 
        vt[i] = translate(cube[i], 0,0,3); 
        
     // rotate around 3 axis
    var vr=[];
    for(i=0;i<8;i++)
       vr[i] = rotateX(vt[i], t);
       
    for(i=0;i<8;i++)
       vr[i] = rotateY(vr[i],t);
       
    for(i=0;i<8;i++)
       vr[i] = rotateZ(vr[i], t);
        
    // translate back to original pos
    var vtt=[];
    for(i=0;i<8;i++)
        vtt[i] = translate(vr[i],0,0,-3);
       
    // project to screen
    var vp=[];
    for(i=0;i<8;i++)
        vp[i] = project(vtt[i]);
        
    // scale to fit on the screen
    var vs=[];
    for(i=0;i<8;i++)
        vs[i] = scale(vp[i],w,h);
    
    ctx.beginPath();
    
    // render each cube face (2 triangles per face giving 16 triangles total)
    drawTri(vs[0].x, vs[0].y, vs[1].x, vs[1].y, vs[3].x, vs[3].y, cubecolor);
    drawTri(vs[3].x, vs[3].y, vs[1].x, vs[1].y, vs[2].x, vs[2].y, cubecolor);
    
    drawTri(vs[4].x, vs[4].y, vs[5].x, vs[5].y, vs[0].x, vs[0].y, cubecolor);
    drawTri(vs[0].x, vs[0].y, vs[5].x, vs[5].y, vs[1].x, vs[1].y, cubecolor);
    
    drawTri(vs[1].x, vs[1].y, vs[5].x, vs[5].y, vs[2].x, vs[2].y, cubecolor);
    drawTri(vs[2].x, vs[2].y, vs[5].x, vs[5].y, vs[6].x, vs[6].y, cubecolor);
    
    drawTri(vs[4].x, vs[4].y, vs[5].x, vs[5].y, vs[7].x, vs[7].y, cubecolor);
    drawTri(vs[6].x, vs[6].y, vs[5].x, vs[5].y, vs[7].x, vs[7].y, cubecolor);
    
    drawTri(vs[7].x, vs[7].y, vs[6].x, vs[6].y, vs[3].x, vs[3].y, cubecolor);
    drawTri(vs[4].x, vs[4].y, vs[0].x, vs[0].y, vs[7].x, vs[7].y, cubecolor);
    
    drawTri(vs[4].x, vs[4].y, vs[0].x, vs[0].y, vs[7].x, vs[7].y, cubecolor);
    drawTri(vs[7].x, vs[7].y, vs[0].x, vs[0].y, vs[3].x, vs[3].y, cubecolor);
    
    drawTri(vs[3].x, vs[3].y, vs[7].x, vs[7].y, vs[6].x, vs[6].y, cubecolor);
    drawTri(vs[3].x, vs[3].y, vs[6].x, vs[6].y, vs[2].x, vs[2].y, cubecolor);
    
    drawTri(vs[3].x, vs[3].y, vs[6].x, vs[6].y, vs[2].x, vs[2].y, cubecolor);
    drawTri(vs[4].x, vs[4].y, vs[5].x, vs[5].y, vs[6].x, vs[6].y, cubecolor);
    
    ctx.stroke();
    timeelapsed=beginloop-endloop;
    fps=1000/timeelapsed;
    endloop=beginloop;
    t+=fps*animspeed;
}


    