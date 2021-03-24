//adding cube and manipulating html part

var Cube = new ELEM(document.querySelector(".cube"));
var addCube = function(x,y,z,w){
    var front = Cube.add("div","",false,
        "width:"+w+"px;"+
        "height:"+w+"px;"+
        "transform: translateX("+x+"px) translateY("+y+"px) translateZ("+z+"px) rotateY(0deg) translateZ("+w/2+"px);"+
        "background-color: #704d33;"
    );
    var right = Cube.add("div","",false,
        "width:"+w+"px;"+
        "height:"+w+"px;"+
        "transform: translateX("+x+"px) translateY("+y+"px) translateZ("+z+"px) rotateY(90deg) translateZ("+w/2+"px);"+
        "background-color: #745339;"
    );
    var back = Cube.add("div","",false,
        "width:"+w+"px;"+
        "height:"+w+"px;"+
        "transform: translateX("+x+"px) translateY("+y+"px) translateZ("+z+"px) rotateY(180deg) translateZ("+w/2+"px);"+
        "background-color: #70625b;"
    );
    var left = Cube.add("div","",false,
        "width:"+w+"px;"+
        "height:"+w+"px;"+
        "transform: translateX("+x+"px) translateY("+y+"px) translateZ("+z+"px) rotateY(270deg) translateZ("+w/2+"px);"+
        "background-color: #b38560;"
    );
    var top = Cube.add("div","",false,
        "width:"+w+"px;"+
        "height:"+w+"px;"+
        "transform: translateX("+x+"px) translateY("+y+"px) translateZ("+z+"px) rotateX(90deg) translateZ("+w/2+"px);"+
        "background-color: #639b37;"
    );
    var bottom = Cube.add("div","",false,
        "width:"+w+"px;"+
        "height:"+w+"px;"+
        "transform: translateX("+x+"px) translateY("+y+"px) translateZ("+z+"px) rotateX(270deg) translateZ("+w/2+"px);"+
        "background-color: #57382a;"
    );
};

//addCube(0,0,0,200);

/*
[x+wm,y+wm,z+wm],
[x+wm,y+wm,z+ww],
[x+wm,y+ww,z+wm],
[x+wm,y+ww,z+ww],
[x+ww,y+wm,z+wm],
[x+ww,y+wm,z+ww],
[x+ww,y+ww,z+wm],
[x+ww,y+ww,z+ww]
*/


var depth = 10;
var w = 200/depth;
var nn = 0;
var oo = 0;
for(var i = 0; i < depth; i++){
    for(var j = 0; j < depth; j++){
        for(var k = 0; k < depth; k++){
            var x = w*i-100;
            var y = w*j-100;
            var z = w*k-100;
            var corners = [
                [x,y,z],
                [x,y,z+w],
                [x,y+w,z],
                [x,y+w,z+w],
                [x+w,y,z],
                [x+w,y,z+w],
                [x+w,y+w,z],
                [x+w,y+w,z+w]
            ];
            var ins = false;
            var out = false;
            for(var l = 0; l < corners.length; l++){
                var corner = corners[l];
                var r = Math.sqrt(corner[0]**2+corner[1]**2+corner[2]**2);
                if(r < 100)ins = true;
                if(r > 100)out = true;
            }
            if(!out)oo++;
            if(ins)nn++;
            if(!(ins && out))continue;
            //console.log(x+100,y+100,z+100,w);
            addCube(x+100,y+100,z+w/2,w);
        }
    }
}


var r = 100;
var volume = ((nn+oo)/2)*w*w*w;//n is outside
var pi = 3/4*volume/r/r/r;
document.getElementById("display").innerHTML = "π = "+pi;













var matMul4 = function(a,b){
    var result = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i = 0; i < 4; i++){//lateral
        for(var j = 0; j < 4; j++){//vertical
            for(var k = 0; k < 4; k++){//depth addition
                result[i*4+j] += a[i*4+k]*b[k*4+j];
            }
        }
    }
    return result;
};

var cos = Math.cos;
var sin = Math.sin;

var genYmat = function(a){
    return [
        cos(a),0,sin(a),0,
        0,1,0,0,
        -sin(a),0,cos(a),0,
        0,0,0,1
    ];
};

var genXmat = function(a){
    return [
        1,0,0,0,
        0,cos(a),-sin(a),0,
        0,sin(a),cos(a),0,
        0,0,0,1
    ];
};


var cube = document.querySelector(".cube");


var resultMatrix = [
    0.84219, -0.110879, -0.527657, 0,
    -0.314646, 0.693645, -0.647962, 0,
    0.437851, 0.711732, 0.549293, 0,
    0, 0, 0, 1
];
/*var resultMatrix = [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1
];*/

var vx = 0;
var vy = 0;
var x0 = 0;
var y0 = 0;
var t0 = Date.now();
var down = false;

var mvx = 0;//mouse velocity
var mvy = 0;


document.body.addEventListener("mousedown",function(e){
    e.preventDefault();
    down = true;
    x0 = e.clientX;
    y0 = e.clientY;
    t0 = Date.now();
    mvx = 0;
    mvy = 0;
});

document.body.addEventListener("mousemove",function(e){
    e.preventDefault();
    if(!down)return false;
    var x = e.clientX;
    var y = e.clientY;
    var t = Date.now();
    var dt = (t - t0)/1000;
    var dx = x - x0;
    var dy = y - y0;
    if(dt === 0)return false;//infinity->nan bug, preventing being frozen
    mvx = dx/dt;
    mvy = dy/dt;
    //console.log(dx,dy,mvx,mvy,dt);
    x0 = x;
    y0 = y;
    t0 = t;
});

document.body.addEventListener("mouseup",function(e){
    e.preventDefault();
    down = false;
});

var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var dt = (t - start)/1000;
    start = t;
    if(down){
        if(Date.now() - t0 > 100){
            mvx = 0;
            mvy = 0;
            console.log("cancelled");
        }
        vx = vx+(mvx-vx)*dt*3;
        vy = vy+(mvy-vy)*dt*3;//friction part
    }
    var dx = dt*vx;
    var dy = dt*vy;
    //console.log(dx,dy);
    //remember small angle approximation? sin(x) x>0 := x
    var ay = -dx/100//destination angle for the y axis
    var ax = dy/100//destination angle for the x axis
    var ymat = genYmat(ay);
    var xmat = genXmat(ax);
    resultMatrix = matMul4(matMul4(resultMatrix,ymat),xmat);
    //console.log(resultMatrix);
    //then finally plug in all the values
    cube.style.transform = "matrix3d("+resultMatrix.join(",")+")";
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
