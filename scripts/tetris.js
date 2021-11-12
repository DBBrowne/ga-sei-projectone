//  * TETRIS

function testJestConnection() {
  console.log('hello')
  return 'hello'
}
class LandedShape extends Array {
  draw(){
    if (!this.length){
      return
    }
    this.forEach(cell=>{
      playMatrix[cell.address[0]][cell.address[1]].style.backgroundColor = cell.fillColor
    })
  }
}

// DOM Elements

const playMatrixView = document.querySelector('.play-matrix')

// Variables

const playMatrixHeight = 20
const playMatrixWidth = 16
const playMatrix = []
const landedShape = new LandedShape(0)

const tetrominoSpawnRef = [7,20]

let gameTimer = null
const gameTickTime = 100
let isGameOngoing = false

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

buildPlayMatrix(playMatrixHeight + 2, playMatrixWidth)


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
  mapOccupiedSpaces(address){
    return this.shapeOffsets.map(offset=>{
      return [address[0] + offset[0],address[1] + offset[1]]
    })
  }
  moveDown(){
    const nextLocation = [this.baseLocation[0] - 1, this.baseLocation[1]]
    this.nextOccupiedSpaces = this.mapOccupiedSpaces(nextLocation)

    const noIntercepts = this.nextOccupiedSpaces.every(nextMoveCell=>{
      return landedShape.every(landedCell=>{
        return !landedCell.address.every((coordinate, index)=>(coordinate === nextMoveCell[index]))
      }) && 
        nextMoveCell[0] >= 0
    })

    if (!noIntercepts){
      console.log('intercept')
      this.addToLandedShape()
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
  addToLandedShape(){
    this.occupiedSpaces.every(cell=>{
      if (cell[0] > playMatrixHeight){
        loseGame()
        return false
      }
      landedShape.push({ address: cell, fillColor: this.fillColor })
      return true
    })
    if (isGameOngoing){
      newTetromino('blue')
    }
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

function newTetromino (fillcolor) {
  setTickSpeed()
  activeTetromino = new Tetromino([[0,0], [0,1], [1,0], [1,1]],fillcolor)
}
function loseGame(){
  isGameOngoing = false
  console.log('LOSER')
  clearInterval(gameTimer)
}
function gameTick(){
  console.log('tick')
  playMatrix.forEach(row=>row.forEach(cell=> {
    cell.style.backgroundColor = 'inherit'
  }))
  activeTetromino.moveDown()
  landedShape.draw()
}
function setTickSpeed(tickSpeed = gameTickTime){
  clearInterval(gameTimer)
  return gameTimer = setInterval(()=>{
    gameTick()
  },tickSpeed)
}

// key handlers

function handleKeyDown(e) {
  switch (e.code) {
    case 'ArrowDown':
      if (isGameOngoing){
        setTickSpeed(gameTickTime / 5)
      }
      break
    case 'ArrowUp':
      if (isGameOngoing){
        setTickSpeed(gameTickTime / 100)
      }
      break

    default:
      console.log('invalid keyDown, ignoring ', e.code)
  }
}

function handleKeyUp(e) {
  switch (e.code) {
    case 'ArrowDown':
      if (isGameOngoing){
        setTickSpeed()
      }
      break
    case 'ArrowUp':
      // tickSpeed resets when new piece enters play
      break

    default:
      console.log('invalid keyUp, ignoring ', e.code)
  }
}

// Events

document,addEventListener('keydown', handleKeyDown)
document,addEventListener('keyup',   handleKeyUp)


setTimeout(()=>{
  clearInterval(gameTimer)
  console.log('game time over')
},10000)



// * START GAME

isGameOngoing = true
newTetromino('darkred')
setTickSpeed()


// * export functions for testing
try {
  module.exports = {
    testJestConnection,
    buildPlayMatrix,
  }
} catch {
  'suppress this error in the browser until solution'
}