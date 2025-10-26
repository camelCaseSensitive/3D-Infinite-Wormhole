// Use noise to move through 3D space 
// Control the azimuth and altitude angles using perlin noise
// These angles define a 3D vector 
// Step ahead to draw a wormhole through 3D space 
// by adding to the position vector each time
// Loop through some number of steps to bulid the wormhole 
// as you do keep track of the positions at a certain interval
// at this interval record the position in an array
// I actually pushed the rings of the tube 
// so I wouldn't have to loop thru twice
// Then loop through the tunnel array and use beginShape 
// to draw the tunnel, making it darker as it goes

function setup() {
  createCanvas(600, 400, WEBGL);
  cam = createCamera()
  perspective(1, width/height, 0.1, 1000)
  // frameRate(30)
}

let p = [0, 0, 0]

let curv = 200;  // Smaller is curvier

let tunnel = [];

let c = [0, 0, 0]
let cNext = [0, 0 ,0]
let prevcNext = [0, 0, 0]
let ct = 0;

function draw() {
  background(20);
  orbitControl()
  lights()
  noStroke()
  
  // frameCount = 1
  
  s = 0.9
  // console.log(mouseX/10)
  
  let dia = 10;
  // let dia = mouseX/10;
  
  
  tunnel = [];
  
  // let t = 1/curv;
  let p = [0, 0, 0]
  
  
  let th = noise(0) * 2*PI
  let phi = noise(0 + 3000) * 2*PI

  let v = [
    cos(phi)*cos(th),
    cos(phi)*sin(th),
    sin(phi)
  ];


  p = vectorAdd(p, scalarMultiply(s, v))

  // push()
  //   translate(p[0], p[1], p[2])
  //   fill(255)
  //   sphere(6)
  // pop()
  let pNext = [p[0], p[1], p[2]]
  
  let m = frameCount
  let n = frameCount + 100
  for(let i = m; i < n; i++){
    let th = noise(i/curv) * 2*PI
    let phi = noise(i/curv + 3000) * 2*PI

    let v = [
      cos(phi)*cos(th),
      cos(phi)*sin(th),
      sin(phi)
    ];

    if(i == m){
      c = [pNext[0], pNext[1], pNext[2]];
      cNext = [pNext[0], pNext[1], pNext[2]]
      for(let j = m; j < m+40; j++){
        let th = noise(j/curv) * 2*PI
        let phi = noise(j/curv + 3000) * 2*PI

        let v = [
          cos(phi)*cos(th),
          cos(phi)*sin(th),
          sin(phi)
        ];
        cNext = vectorAdd(cNext, scalarMultiply(s, v)) 
      }
    }
    
    pNext = vectorAdd(pNext, scalarMultiply(s, v))

    if(i % (round(s*10)) == 0){
      fill(255)
      push()
        // translate(pNext[0], pNext[1], pNext[2])
        // rotateZ(th-PI/2)
        // rotateX(phi)
        // cylinder(20, 20, 10, 1, 0, 0)
      tunnel.push([])
        for(let i = 0; i < 10; i++){
          let p = [
            [dia*cos(i/10*2*PI)],
            [0],
            [dia*sin(i/10*2*PI)], 
            [1]
          ]
          M = matrixMultiply(rz(-th+PI/2), rx(-phi) )
          
          p = matrixMultiply(M, p)
          
          p = vectorAdd(pNext, [p[0][0], p[1][0], p[2][0]])
          
          tunnel[tunnel.length-1].push(p)
          
          push()
            translate(p[0], p[1], p[2])
            // fill(0, 255, 0)
            // sphere(0.5)
          pop()
        }
      pop()
    }
    
  }
  // console.log(tunnel[0][1])
  
  // ********************************************
  noFill()
  for(let i = 0; i < tunnel.length; i++){
    beginShape()
    for(let j = 0; j < tunnel[i].length; j++){
      let a = tunnel[i][j];
      
      stroke(0, 255 - i/tunnel.length*255, 0)
      strokeWeight(0.1*dia/10)
      vertex(a[0], a[1], a[2])
      
      if(i < tunnel.length-1){
        let b = tunnel[i+1][j];
        vertex(b[0], b[1], b[2])
        vertex(a[0], a[1], a[2])
      }
      
      if(j == tunnel[i].length-1){
        let a = tunnel[i][0]
        vertex(a[0], a[1], a[2])
      }
    }
    endShape()
  }
  
  // for(let j = 0; j < tunnel[0].length; j++){
  //   beginShape()
  //   for(let i = 0; i < tunnel.length; i++){
  //     let a = tunnel[i][j];
  //     let b;
  //     stroke(0, 255, 0)
  //     strokeWeight(0.1)
  //     vertex(a[0], a[1], a[2])
  //   }
  //   endShape()
  // }
  // ********************************************
  
//   let ct = frameCount/curv;
//   // let c = [0, 0, 0]
  
  
//   let cth = noise(ct) * 2*PI
//   let cphi = noise(ct + 3000) * 2*PI

//   let cv = [
//     cos(cphi)*cos(cth),
//     cos(cphi)*sin(cth),
//     sin(cphi)
//   ];

//   let cNext = vectorAdd(c, cv)
  
  // let up = crossProduct(c, cNext)
  // let up = cNext
  
  let up = [0, 1, 0]
  
  // let up = crossProduct(cNext, prevcNext)
  
  
  camera(c[0], c[1], c[2], 
         cNext[0], cNext[1], cNext[2],
         up[0], up[1], up[2])
  
  prevcNext = cNext;
  
  // translate(c[0], c[1], c[2])
  fill(0, 255,0)
  // sphere(11)

  // c = cNext

  // console.log(noise(12 + 3000) * 2*PI)
  // console.log(noise(13 + 3000) * 2*PI)
  
  
}



// Vector math functions
function crossProduct(v1, v2) {
    return [v1[1]*v2[2] - v1[2]*v2[1], v1[2]*v2[0] - v1[0]*v2[2], v1[0]*v2[1] - v1[1]*v2[0]];
}

function dotProduct(v1, v2) {
    return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}

function scalarMultiply(s, v){
  return [v[0]*s, v[1]*s, v[2]*s]
}

function vectorAdd(v1, v2){
  return [v2[0]+v1[0], v2[1]+v1[1], v2[2]+v1[2]]
}

function vectorSubtract(v2, v1){
  return [v2[0]-v1[0], v2[1]-v1[1], v2[2]-v1[2]]
}

function randomUnitVector(){
  let v = [Math.random(), Math.random(), Math.random()]
  return vectorNormalize(v)
}

function vectorNormalize(v){
  let vectorLength = vectorMagnitude(v)
  return [v[0]/vectorLength, v[1]/vectorLength, v[2]/vectorLength]
}

function vectorMagnitude(v) {
  return Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2)
}

function rx(th) {
  return [
    [1,0,0, 0], 
    [0, Math.cos(th), Math.sin(th), 0], 
    [0, -Math.sin(th), Math.cos(th), 0], 
    [0, 0, 0, 1]];
}

function ry(th) {
  return [
    [Math.cos(th), 0, -Math.sin(th), 0], 
    [0, 1, 0, 0], 
    [Math.sin(th), 0, Math.cos(th), 0], 
    [0, 0, 0, 1]];
}

function rz(th) {
  return [
    [Math.cos(th), Math.sin(th), 0, 0], 
    [-Math.sin(th), Math.cos(th), 0, 0], 
    [0, 0, 1, 0], 
    [0, 0, 0, 1]];
}

function matrixMultiply(a, b) {
  var aNumRows = a.length, aNumCols = a[0].length,
      bNumRows = b.length, bNumCols = b[0].length,
      m = new Array(aNumRows);  // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;             // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  // console.log(m)
  return m;
}

function transform(m){
  let M = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
  for(let i = m.length-1; i > -1; i--){
    M = matrixMultiply(m[i], M)
  }
  return M
}
