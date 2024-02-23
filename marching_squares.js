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

  strokeWeight(5)
  
  const columns = width / RESOLUTION;
  for(let i = 0; i < columns; i++) {
    const rows = height / RESOLUTION; 
    for(let j = 0; j < rows; j++) {
      const config = 
            grid[i    ][j    ] << 0 |
            grid[i + 1][j    ] << 1 |
            grid[i    ][j + 1] << 2 |
            grid[i + 1][j + 1] << 3
      
      const tri = triangleTable[config]
      
      stroke(220)
      
      for(let k = 0; k < tri.length; k += 2) {
        let edge1 = edges[tri[k]]
        let edge2 = edges[tri[k + 1]]
      
        let v1 = average(offsets[edge1[0]], offsets[edge1[1]])
        let v2 = average(offsets[edge2[0]], offsets[edge2[1]])

        const offsetVector = createVector(i, j)
        const resolutionVector = createVector(RESOLUTION, RESOLUTION)

        v1.add(offsetVector).mult(resolutionVector)
        v2.add(offsetVector).mult(resolutionVector)
        
        strokeWeight(2)
        line(v1.x, v1.y, v2.x, v2.y)
      }
    }
  }
}
