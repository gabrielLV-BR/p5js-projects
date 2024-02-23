const Vector = p5.Vector

const RESOLUTION = 10

const offsets = [
  [0, 0], 
  [1, 0],  
  [0, 1],  
  [1, 1],  
]

const edges = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
]

const triangleTable = [
  [],
  [ 0, 1 ],       // 0001
  [ 0, 2 ],       // 0010
  [ 1, 2 ],       // 0011
  [ 1, 3 ],       // 0100
  [ 0, 3 ],       // 0101
  [ 0, 1, 2, 3 ], // 0110
  [ 2, 3 ],       // 0111
  [ 2, 3 ],       // 1000
  [ 0, 1, 2, 3 ], // 1001
  [ 0, 3 ],       // 1010
  [ 1, 3 ],       // 1011
  [ 1, 2 ],       // 1100
  [ 0, 2 ],       // 1101
  [ 0, 1 ],       // 1110
  [],             // 1111
]

const grid = []

function setup() {
  createCanvas(500, 500);
  
  for(let i = 0; i < 1 + width / RESOLUTION; i++) {
    grid[i] = []
    for(let j = 0; j < 1 + height / RESOLUTION; j++) {
      grid[i][j] = round(random())
    }
  }
  
  for(let i = 0; i < offsets.length; i++) {
    offsets[i] = createVector(offsets[i][0], offsets[i][1])
  }
  
  noLoop()
}

function average(v1, v2) {
  return Vector.mult(Vector.add(v1, v2), 0.5)  
}

function draw() {
  background(50);
  
  stroke(220)
  strokeWeight(2)
  
  for(let i = 0; i < width / RESOLUTION; i++) {
    for(let j = 0; j < height / RESOLUTION; j++) {
      const offsetVector     = createVector(i, j)
      const resolutionVector = createVector(RESOLUTION, RESOLUTION)

      const config = 
            grid[i    ][j    ] << 0 |
            grid[i + 1][j    ] << 1 |
            grid[i    ][j + 1] << 2 |
            grid[i + 1][j + 1] << 3
      
      const tri = triangleTable[config]
      
      let tris = []
      
      for(const triangle of tri) {
        const edge = edges[triangle]
        
        const v = average(
          offsets[edge[0]], offsets[edge[1]])
        
        v.add(offsetVector).mult(resolutionVector)
        
        tris = [...tris, v]
        
        if (tris.length == 2) {
          line(tris[0].x, tris[0].y, 
               tris[1].x, tris[1].y)
          
          tris = []
        }
      }
    }
  }
}
