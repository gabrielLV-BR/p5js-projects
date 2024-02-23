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

// really simple and barely functional smooth noise
function smoothNoise(w, h, steps = 1, delta = 3) {
  let noise = 
      Array(w).fill(0)
        .map(_ => 
          Array(h).fill(0)
             .map(_ => random()))
  
  // smooth out
  
  const hDelta = floor(delta/2)
  
  while(steps-- > 0) {
    for(let i = hDelta; i < noise.length - hDelta; i++) {
      for(let j = hDelta; j < noise[i].length - hDelta; j++) {

        let avg = 0

        for(let dx = -hDelta; dx <= hDelta; dx++) {
          for(let dy = -hDelta; dy <= hDelta; dy++) {
            avg += noise[i + dx][j + dy]
          }
        }

        noise[i][j] = avg / (delta * delta)
      }
    }
  }
  
  return noise
}

const grid = []

function setup() {
  createCanvas(500, 500);
  
  const cols = (1 + width / RESOLUTION)
  const rows = (1 + height / RESOLUTION)
  
  const noise = smoothNoise(cols, rows, 5, 3)
  
  for(let i = 0; i < cols; i++) {
    grid[i] = []
    for(let j = 0; j < rows; j++) {
      grid[i][j] = noise[i][j]
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

function getConfig(i, j) {
  return round(grid[i    ][j    ]) << 0 |
         round(grid[i + 1][j    ]) << 1 |
         round(grid[i    ][j + 1]) << 2 |
         round(grid[i + 1][j + 1]) << 3
}

function draw() {
  background(50);
  
  stroke(220)
  strokeWeight(2)
  
  for(let i = 0; i < width / RESOLUTION; i++) {
    for(let j = 0; j < height / RESOLUTION; j++) {
      const offsetVector     = createVector(i, j)
      const resolutionVector = createVector(RESOLUTION, RESOLUTION)

      const config = getConfig(i, j)
      const tri = triangleTable[config]
      
      let tris = []
      
      for(const triangle of tri) {
        const edge = edges[triangle]

        const v1 = offsets[edge[0]] // v1
        const v2 = offsets[edge[1]] // v2
        
        const weight1 = grid[i + v1.x][j + v1.y]
        const weight2 = grid[i + v2.x][j + v2.y]
        
        const v = Vector.add(
          Vector.mult(v1, weight1),
          Vector.mult(v2, weight2))
        
        v.mult(1 / (weight1 + weight2))
        
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