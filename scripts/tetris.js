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

const playerControls = {
  moveLeft: {
    name: 'Move Left',
    keydown(){
      activeTetromino.move([0,-1])
    },
    keyup(){
      return 'event inactive'
    },
  },
  moveRight: {
    name: 'Move Right',
    keydown(){
      activeTetromino.move([0,1])
    },
    keyup(){
      return 'event inactive'
    },
  },
  speedUpPlay: {
    name: 'Speed Up',
    keydown(){
      if (isGameOngoing){
        setTickSpeed(gameTickTime / 5)
      }
    },
    keyup(){
      if (isGameOngoing){
        setTickSpeed() 
      }
    },
  },
  dropPiece: {
    name: 'Drop',
    keydown(){
      if (isGameOngoing){
        setTickSpeed(gameTickTime / 100)
      }
    },
    keyup(){
      return 'event inactive'
    },
  },
}

const playerInputScheme = {
  ArrowLeft: {
    name: '&#8592;',
    control: playerControls.moveLeft,
  },
  ArrowRight: {
    name: '&#8594;',
    control: playerControls.moveRight,
  },
  ArrowDown: {
    name: '&#8595;',
    control: playerControls.speedUpPlay,
  },
  ArrowUp: {
    name: '&#8593;',
    control: playerControls.dropPiece,
  },
}

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

// inject control scheme
for (const controlKey in playerInputScheme) {
  const controlLegend = document.querySelector('.player1 .controls')

  const controlLegendItem = document.createElement('div')
  controlLegendItem.classList.add('control-key')
  controlLegendItem.innerHTML = `<p><span>${playerInputScheme[controlKey].name}</span>${playerInputScheme[controlKey].control.name}</p>`

  controlLegend.appendChild(controlLegendItem)
}
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

function handleKeyPress(e) {
  try {
    playerInputScheme[e.code].control[e.type]()
  } catch (err) {
    // console.log(err)
    console.log('unrecognised key event:', e.code, e.type)
  }
}

// Events

document,addEventListener('keydown', handleKeyPress)
document,addEventListener('keyup',   handleKeyPress)


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