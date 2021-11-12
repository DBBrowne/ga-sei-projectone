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

const tetrominoSpawnRef = [20,7]

let activeTetromino = null

// * Build play window
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


// * Functions

class Tetromino {
  constructor(shapeOffsets, fillColor) {
    this.baseLocation = [...tetrominoSpawnRef]
    this.shapeOffsets = shapeOffsets
    this.occupiedSpaces = []
    this.fillColor = fillColor
    this.nextSpace = []

    //initialise shape
    this.init()
  }
  init(){
    this.updateOccupiedSpaces()
    this.colorPlayMatrixView()
  }
  updateOccupiedSpaces(){
    this.occupiedSpaces = this.shapeOffsets.map((offset)=>{
      return [this.baseLocation[0] + offset[0],this.baseLocation[1] + offset[1]]
    })
  }
  colorPlayMatrixView(){
    this.occupiedSpaces.forEach((space)=>{
      playMatrix[space[0]][space[1]].style.backgroundColor = this.fillColor
    })
  }
}

activeTetromino = new Tetromino([[0,0], [0,1], [1,0], [1,1]],'darkred')
// * Events


function gameTick(){
  playMatrix.forEach(row=>row.forEach(cell=> {
    cell.style.backgroundColor = 'grey'
  }))
  activeTetromino.baseLocation[0]--
  activeTetromino.updateOccupiedSpaces()
  activeTetromino.colorPlayMatrixView()
}
const gameTimer = setInterval(()=>{
  gameTick()
},400)

setInterval(()=>{
  clearInterval(gameTimer)
},2000)



// * export functions for testing
try {
  module.exports = {
    testJestConnection,
    buildPlayMatrix,
  }
} catch {
  'suppress this error in the browser until solution'
}