//  * TETRIS

function testJestConnection() {
  console.log('hello')
  return 'hello'
}

// DOM Elements

const playMatrixView = document.querySelector('.play-matrix')

// Variables

const playMatrixHeight = 22
const playMatrixWidth = 16
const playMatrix = []
const landedShape = []

const tetrominoSpawnRef = [7,20]

let activeTetromino = null
// **************************************************************************
// * From this point on, location arrays are referenced in the form [y,x],
// * so that each member of the outer array represents a row of the gamespace
// **************************************************************************
// Build play window
function buildPlayMatrix(height, width){
  for (let y = 0; y < height; y++){
    playMatrix.push([])
    for (let x = 0; x < width; x++){
      const playCell = document.createElement('div')
      playCell.textContent = `${x}, ${y}`
      
      playMatrixView.appendChild(playCell)
      playMatrix[y].push(playCell)
    }
  }
  return playMatrix
}

buildPlayMatrix(playMatrixHeight, playMatrixWidth)


// Functions

class Tetromino {
  constructor(shapeOffsets, fillColor) {
    this.baseLocation = [tetrominoSpawnRef[1],tetrominoSpawnRef[0]]
    this.shapeOffsets = shapeOffsets
    this.occupiedSpaces = []
    this.fillColor = fillColor
    this.nextOccupiedSpaces = []

    //initialise shape
    this.update()
  }
  update(){
    this.updateOccupiedSpaces()
    this.colorPlayMatrixView()
  }
  updateOccupiedSpaces(){
    if (!this.nextOccupiedSpaces.length){
      this.occupiedSpaces = this.mapOccupiedSpaces(this.baseLocation)
      return
    }
    this.occupiedSpaces = [...this.nextOccupiedSpaces]
  }
  mapOccupiedSpaces(location){
    return this.shapeOffsets.map(offset=>{
      return [location[0] + offset[0],location[1] + offset[1]]
    })
  }
  moveDown(){
    const nextLocation = [this.baseLocation[0] - 1, this.baseLocation[1]]
    this.nextOccupiedSpaces = this.mapOccupiedSpaces(nextLocation)
    const noIntercepts = this.nextOccupiedSpaces.every(cell=>{
      return cell[0] > 0
    })
    if (!noIntercepts){
      console.log('intercept')
      this.update()
      return
    }
    this.baseLocation = nextLocation
    this.update()
  }
  colorPlayMatrixView(){
    this.occupiedSpaces.forEach((space)=>{
      playMatrix[space[0]][space[1]].style.backgroundColor = this.fillColor
    })
  }
  // horizontalMove(direction = [0,1]){
  //   this.nextLocation = [this.baseLocation[0] + direction[0],this.baseLocation[1] + direction[1]]
  //   this.shapeOffsets.every(offset=>{
  //     const newCell = [this.nextLocation[0] + offset[0], this.nextLocation[1] + offset[1]]
  //     if (newCell[1] < 0){
  //       break
  //     }
  //   })
  // }
}

activeTetromino = new Tetromino([[0,0], [0,1], [1,0], [1,1]],'darkred')
// Events


function gameTick(){
  console.log('tick')
  playMatrix.forEach(row=>row.forEach(cell=> {
    cell.style.backgroundColor = 'inherit'
  }))
  activeTetromino.moveDown()
}
const gameTimer = setInterval(()=>{
  // activeTetromino.move()
  gameTick()
},400)

setInterval(()=>{
  clearInterval(gameTimer)
},9000)



// * export functions for testing
try {
  module.exports = {
    testJestConnection,
    buildPlayMatrix,
  }
} catch {
  'suppress this error in the browser until solution'
}