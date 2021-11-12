//  * TETRIS

function testJestConnection() {
  console.log('hello')
  return 'hello'
}

// * DOM Elements

const playMatrixView = document.querySelector('.play-matrix')

// * Variables

const playMatrixHeight = 22
const playMatrixWidth = 16
const playMatrix = []

const tetronimoSpawnRef = [20,7]

let activeTetronimo = null

// * Build play window
function buildPlayMatrix(height, width){
  for (let x = 0; x < height; x++){
    playMatrix.push([])
    for (let y = 0; y < width; y++){
      const playCell = document.createElement('div')
      playCell.textContent = `${x}, ${y}`
      
      playMatrixView.appendChild(playCell)
      playMatrix[x].push(playCell)
    }
  }
  return playMatrix
}

buildPlayMatrix(playMatrixHeight, playMatrixWidth)

// try just using references within playMatrix
// const spawnPoint = playMatrix[spawnRef[0],spawnRef[1]]

// * Functions

class Tetronimo {
  constructor(shapeOffsets, fillColor = 'red'){
    this.baseLocation = tetronimoSpawnRef
    this.shapeOffsets = shapeOffsets
    this.occupiedSpaces = []
    this.fillColor = fillColor

    //initialise shape
    this.colorPlayMatrixView()
    this.updateOccupiedSpaces()
  }
  updateOccupiedSpaces(){
    this.occupiedSpaces = this.shapeOffsets.map((offset)=>{
      return [tetronimoSpawnRef[0] + offset[0],tetronimoSpawnRef[1] + offset[1]]
    })
  }
  colorPlayMatrixView(){
    this.occupiedSpaces.forEach((space)=>{
      playMatrix[space[0]][space[1]].style.backgroundColor = this.fillColor
    })
  }
}

activeTetronimo = new Tetronimo([[0,0], [0,1], [1,0], [1,1]],'darkred')
// * Events

activeTetronimo.baseLocation[0]--
activeTetronimo.updateOccupiedSpaces()
activeTetronimo.colorPlayMatrixView()


// * export functions for testing
try {
  module.exports = {
    testJestConnection,
    buildPlayMatrix,
  }
} catch {
  'suppress this error in the browser until solution'
}