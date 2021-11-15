//  * TETRIS
// Constructors

class LandedShape extends Array {
  draw(){
    if (!this.length){
      return
    }
    this.forEach((row, rowIndex)=>{
      if (row.fullCellsCount){
        row.forEach((cell, columnIndex)=>{
          if (cell.fillColor){
            playMatrix[rowIndex][columnIndex].style.backgroundColor = cell.fillColor
          }
        })
      }
    })
  }
  newRow(length = playMatrixWidth){
    const newRowArray = []
    newRowArray.fullCellsCount = 0
    for (let i = 0; i < length;i++){
      newRowArray.push({})
    }
    this.push(newRowArray)
  }
}

class TetrominoShape {
  constructor(shapeMap, fillColor = 'white'){
    this.shapeMap = shapeMap
    this.fillColor = fillColor
  }
}


function testJestConnection() {
  console.log('hello')
  return 'hello'
}

// DOM Elements

// const player0playMatrixView = document.querySelector('.player0 .play-matrix')
const player0ScoreView = document.querySelector('.player0 .info .score-span')
const globalPlayButton = document.querySelector('.play-button')
const pageMain = document.querySelector('main')
const playerCoreHTML = '<div class="info"><p>Score:&nbsp;<span class="score-span">000</span></p><ul class="controls"><p>Controls:</p></ul></div><div class="play-decorator"><div class="play-matrix"></div></div>'
// **************************************************************************
// Variables

const isDebugMode = true

const players = []

const playMatrixHeight = 20
const playMatrixWidth = 16
let playMatrix = new Array
let landedShape = new LandedShape

const tetrominoSpawnXY = [7,20]

const defaultGameTickTime = 500
const levelUpTickMultiplier = 0.90
const levelUpBreakPoint = 1
const speedUpTickDivider = 5
const dropTickDivider = 1000

let isGameOngoing = false
let globalTickTime = defaultGameTickTime

const pointsPerRow = 100
const pointsMultirowExponent = 1.5

const tetrominoShapes = [
  new TetrominoShape(
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    'gold'
  ),
  new TetrominoShape(
    [
      [0,1,1],
      [1,1,0],
      [0,0,0]
    ],
    'green'
  ),
  new TetrominoShape(
    [
      [0,0,0,0],
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0]
    ],
    'cyan'
  ),
  new TetrominoShape(
    [
      [1,1,0],
      [0,1,1],
      [0,0,0]
    ],
    'darkred'
  ),
  new TetrominoShape(
    [
      [0,1,0],
      [1,1,1],
      [0,0,0]
    ],
    'darkorchid'
  ),
  new TetrominoShape(
    [
      [0,0,1],
      [1,1,1],
      [0,0,0]
    ],
    'darkorange'
  ),
  new TetrominoShape(
    [
      [1,0,0],
      [1,1,1],
      [0,0,0]
    ],
    'darkblue'
  )
]
const maxShapeSize = tetrominoShapes.reduce((acc,shape)=>{
  return Math.max(acc, shape.shapeMap.length)
},0)

// **************************************************************************
// Controls
// define behaviour for a control
const playerControls = {
  moveLeft: {
    name: 'Move Left',
    keydown(){
      players[0].activeTetromino.move([0,1])
    },
    keyup(){
      return 'event inactive'
    },
  },
  moveRight: {
    name: 'Move Right',
    keydown(){
      players[0].activeTetromino.move([0,-1])
    },
    keyup(){
      return 'event inactive'
    },
  },
  speedUpPlay: {
    name: 'Speed Up',
    keydown(repeat){
      if (isGameOngoing && !repeat){
        players[0].setTickSpeed(players[0].gameTickTime / speedUpTickDivider)
      }
    },
    keyup(){
      if (isGameOngoing){
        players[0].setTickSpeed() 
      }
    },
  },
  dropPiece: {
    name: 'Drop',
    keydown(){
      if (isGameOngoing){
        players[0].setTickSpeed(players[0].gameTickTime / dropTickDivider)
      }
    },
    keyup(){
      return 'event inactive'
    },
  },
  rotateACW: {
    name: '&#8630;',
    keydown(){
      players[0].activeTetromino.rotateShape(false)
    },
    keyup(){
      return 'event inactive'
    },
  },
  rotateCW: {
    name: '&#8631;',
    keydown(){
      players[0].activeTetromino.rotateShape(true)
    },
    keyup(){
      return 'event inactive'
    },
  },
}
// attach input to abstract control behaviour
const playerInputScheme = {
  ArrowLeft: {
    name: '&#8592;',
    control: playerControls.moveLeft,
    player: 1,
  },
  ArrowRight: {
    name: '&#8594;',
    control: playerControls.moveRight,
    player: 1,
  },
  ArrowDown: {
    name: '&#8595;',
    control: playerControls.speedUpPlay,
    player: 1,
  },
  ArrowUp: {
    name: '&#8593;',
    control: playerControls.dropPiece,
    player: 1,
  },
  Period: {
    name: '.',
    control: playerControls.rotateACW,
    player: 1,
  },
  Slash: {
    name: '/',
    control: playerControls.rotateCW,
    player: 1,
  },
}

// **************************************************************************
// * From this point on, location arrays are referenced in the form [y,x],
// * so that each member of the outer array represents a row of the gamespace
// **************************************************************************
const tetrominoSpawnYX = [tetrominoSpawnXY[1],tetrominoSpawnXY[0]]


// **************************************************************************
// Build play window
class TetrisGame {
  constructor(playerNumber = 1, displayParent = pageMain){
    this.playerNumber = playerNumber
    this.playerName = 'player' + playerNumber
    this.displayParent = displayParent
    this.playerSection = {} //DOM element to carry this player
    this.playMatrixView = {} //DOM element to display this gamestate
    this.coreHTML = playerCoreHTML
    this.playMatrix = []
    this.landedShape = []

    this.playerRowsCleared = 0
    this.playerScore = 0
    this.playerScoreView = {}

    this.activeTetromino = {}
    this.gameTickTime = globalTickTime
    this.gameTimer = {}

    this.initPlayspace()
  }

  initPlayspace(){
    const newPlayerSection = document.createElement('section')
    newPlayerSection.classList.add(this.playerName)
    newPlayerSection.innerHTML = this.coreHTML

    this.displayParent.appendChild(newPlayerSection)

    this.playerSection = newPlayerSection

    this.playMatrixView = newPlayerSection.querySelector('.play-matrix')
    isDebugMode && console.log(this.playMatrixView)
    this.playerScoreView = newPlayerSection.querySelector('.info .score-span')

    this.buildMatrix()

    this.injectPlayerControlsIntoHTML()
    this.playerScoreView.textContent = this.playerScore
  }
  buildMatrix(){
    //todo: refactor to deconstruct return.  Currently causes "console.log(...) is undefined"
    const buildReturn = buildNewPlayMatrix(playMatrixHeight + maxShapeSize, playMatrixWidth, this.playMatrixView)
    this.playMatrix = buildReturn[0]
    this.landedShape = buildReturn[1]

    isDebugMode && console.log('build new matrix:',this.playerName, 'playmatrix',this.playMatrix,'landedshape', this.landedShape)
  }
  injectPlayerControlsIntoHTML(){
    // inject control legend
    for (const controlKey in playerInputScheme) { //todo: refactor to for-of
      if ( playerInputScheme[controlKey].player === this.playerNumber){
        const controlLegendElement = this.playerSection.querySelector('.controls')

        const controlLegendItem = document.createElement('div')
        controlLegendItem.classList.add('control-key')
        controlLegendItem.innerHTML = `<p><span>${playerInputScheme[controlKey].name}</span>${playerInputScheme[controlKey].control.name}</p>`

        controlLegendElement.appendChild(controlLegendItem)
      }
    }
  }
  newActiveTetromino (fillColor) {
    this.setTickSpeed()
    this.activeTetromino = this.newTetromino(fillColor)
  }
  reset(){
    clearInterval(this.gameTimer)
    this.buildMatrix()
    // this.clearPlayAreaView()
    this.playerRowsCleared = 0
    this.playerScore = 0
    this.playerScoreView.textContent = this.playerScore
  }
  gameTick(){
    isDebugMode && console.log(this.playerName, 'tick')
    this.activeTetromino.moveDown()
    this.checkForCompleteRows()
  }
  setTickSpeed(tickSpeed = globalTickTime){
    clearInterval(this.gameTimer)
    return this.gameTimer = setInterval(()=>{
      this.gameTick()
    },tickSpeed)
  }
  clearPlayAreaView(){
    this.playMatrix.forEach(row=>row.forEach(cell=> {
      cell.style.backgroundColor = 'inherit'
    }))
  }
  checkForCompleteRows() {
    const originalLength = this.landedShape.length
    this.landedShape = this.landedShape.filter(row=>!(row.fullCellsCount === playMatrixWidth))
    const newLength = this.landedShape.length
    const clearedRows = originalLength - newLength
    for (let i = newLength;i < originalLength;i++){
      this.landedShape.newRow()
    }
    if (clearedRows){
      this.clearPlayAreaView()
      this.landedShape.draw()
      this.addToScore(clearedRows)
      this.playerRowsCleared += clearedRows
      globalTickTime = globalTickTime * Math.pow(levelUpTickMultiplier, Math.ceil(this.playerRowsCleared / levelUpBreakPoint))
      console.log(globalTickTime)
    }
  }
  addToScore(clearedRows){
    this.playerScore += Math.ceil(Math.pow(clearedRows, pointsMultirowExponent) * pointsPerRow)
    this.playerScoreView.textContent = this.playerScore
  }
  newTetromino(fillColor, shapeChoice) {
    console.log('newtetr parent:',parent)
    shapeChoice = shapeChoice || Math.floor(Math.random() * tetrominoShapes.length)
    isDebugMode && console.log('new shape index:', shapeChoice)
    const shape = tetrominoShapes[shapeChoice]
    return new Tetromino(shape.shapeMap, fillColor || shape.fillColor, this)
}
}

// **************************************************************************
// Functions
class Tetromino {
  constructor(shapeMap, fillColor, parent, baseLocation = tetrominoSpawnYX) {
    this.baseLocation = baseLocation
    this.fillColor = fillColor
    this.shapeMap = shapeMap
    this.shapeOffsets = convertShapeMeshToOffsets(shapeMap)
    this.occupiedSpaces = []
    this.nextOccupiedSpaces = []
    this.parent = parent

    //initialise shape
    this.update()
  }
  update(){
    this.clearCurrentLocation()
    this.updateOccupiedSpaces()
    this.colorPlayMatrixView()
  }
  clearCurrentLocation(){
    this.occupiedSpaces.forEach(space=>{
      this.parent.playMatrix[space[0]][space[1]].style.backgroundColor = 'inherit'
    })
  }
  updateOccupiedSpaces(){
    if (!this.nextOccupiedSpaces.length){
      this.occupiedSpaces = this.mapOccupiedSpaces(this.baseLocation)
      return
    }
    this.occupiedSpaces = [...this.nextOccupiedSpaces]
  }
  colorPlayMatrixView(){
    this.occupiedSpaces.forEach((space)=>{
      this.parent.playMatrix[space[0]][space[1]].style.backgroundColor = this.fillColor
    })
  }
  mapOccupiedSpaces(address, shapeOffsets = this.shapeOffsets){
    return shapeOffsets.map(offset=>{
      return [address[0] + offset[0],address[1] + offset[1]]
    })
  }
  checkNextOccupiedSpaces(){
    return  this.nextOccupiedSpaces.every(nextMoveCell=>{
      return nextMoveCell[0] >= 0 &&
        nextMoveCell[1] >= 0 &&
        nextMoveCell[1] < playMatrixWidth &&
        !this.parent.landedShape[nextMoveCell[0]][nextMoveCell[1]].fillColor
    })
  }
  moveDown(){
    const nextLocation = [this.baseLocation[0] - 1, this.baseLocation[1]]
    this.nextOccupiedSpaces = this.mapOccupiedSpaces(nextLocation)

    const noIntercepts = this.checkNextOccupiedSpaces()

    if (!noIntercepts){
      isDebugMode && console.log('intercept')
      this.addToLandedShape()
      return
    }
    this.baseLocation = nextLocation
    this.update()
  }
  addToLandedShape(){
    if (
      this.occupiedSpaces.every(cell=>{
        if (cell[0] >= playMatrixHeight){
          loseGame()
          return false
        }
        this.parent.landedShape[cell[0]][cell[1]].fillColor = this.fillColor 
        this.parent.landedShape[cell[0]].fullCellsCount++
        return true
      })
    ){
      this.parent.newActiveTetromino()
    }
  }
  move(direction){
    this.nextLocation = [this.baseLocation[0] + direction[0],this.baseLocation[1] + direction[1]]
    this.nextOccupiedSpaces = this.mapOccupiedSpaces(this.nextLocation)
    
    if (this.checkNextOccupiedSpaces()){
      this.baseLocation = this.nextLocation
      this.update()
    }
  }
  rotateShape(isClockwise = true){
    const rotatedShapeMap = rotateMatrix(this.shapeMap, isClockwise)
    const rotatedOffsets = convertShapeMeshToOffsets(rotatedShapeMap)

    this.nextOccupiedSpaces = this.mapOccupiedSpaces(this.baseLocation, rotatedOffsets)

    if (this.checkNextOccupiedSpaces()){
      this.shapeOffsets = rotatedOffsets
      this.shapeMap = rotatedShapeMap
    } else {
      this.nextOccupiedSpaces = this.occupiedSpaces
    }
    this.update()
  }
}

// ************
// * global functions
function convertShapeMeshToOffsets(matrix, offsetPointXYFromTopLeft){
  const offsetReference = offsetPointXYFromTopLeft || [matrix.length - 2, 1]
  return matrix.reduce((acc,row, rowIndex)=>{
    row.forEach((flag, colIndex) => flag && acc.push([offsetReference[0] - rowIndex,-offsetReference[1] + colIndex]))
    return acc
  },[])
}
function rotateMatrix(matrix, isClockwise = true){
  //rotate clockwise by default
  if (isClockwise){
    //transpose, then reverse column content
    return matrix.map((val, index) => matrix.map(row => row[index])).reverse()
  }
  //transpose, then reverse row content
  return matrix.map((val, index) => matrix.map(row => row[index]).reverse())
}
//potentially belongs to the playspace object
function buildNewPlayMatrix(height, width, playMatrixView){
  playMatrixView.innerHTML = ''
  playMatrix = new Array
  landedShape = new LandedShape
  for (let y = 0; y < height; y++){
    playMatrix.push([])
    landedShape.newRow(width)
    //count from width-1 to 0 to retain 0,0 at the lower left of the play view
    for (let x = width - 1; x >= 0; x--){
      const playCell = document.createElement('div')
      
      if (isDebugMode){
        playCell.textContent = `${x}, ${y}`
        playCell.classList.add('debug')
      }
      
      playMatrixView.prepend(playCell)
      playMatrix[y].push(playCell)
    }
  }
  return [playMatrix, landedShape]
  
}


// ************
// * playspace functions

function newTetromino(parent, fillColor, shapeChoice) {
  console.log('newtetr parent:',parent)
  shapeChoice = shapeChoice || Math.floor(Math.random() * tetrominoShapes.length)
  isDebugMode && console.log('new shape index:', shapeChoice)
  const shape = tetrominoShapes[shapeChoice]
  return new Tetromino(shape.shapeMap, fillColor || shape.fillColor, parent)
}
// function clearPlayAreaView(){
//   playMatrix.forEach(row=>row.forEach(cell=> {
//     cell.style.backgroundColor = 'inherit'
//   }))
// }
function loseGame(){
  isGameOngoing = false
  console.log('game over')
  players.forEach(player=>clearInterval(player.gameTimer))
}
// function setTickSpeed(tickSpeed = gameTickTime){
//   clearInterval(gameTimer)
//   return gameTimer = setInterval(()=>{
//     gameTick()
//   },tickSpeed)
// }

function resetGame() {
  // todo does not stop game
  // todo does not clear field
  isGameOngoing = false
  players.forEach(player=>player.reset())
  globalTickTime = defaultGameTickTime
}
function startGame(){
  isGameOngoing = true
  if (isDebugMode){
    players.forEach(player=>{
      player.newActiveTetromino('red')
      player.setTickSpeed()
    })
  } else {
    players.forEach(player=>player.newActiveTetromino())
  }
}
// **************************************************************************
// keypress handler

function handleKeyPress(e) {
  // system keys
  if (e.code === 'F5'){
    return true
  }

  // user keys
  e.preventDefault()
  try {
    playerInputScheme[e.code].control[e.type](e.repeat)
  } catch (err) {
    if (isDebugMode){
      console.log(err)
      console.log('unrecognised key event:', e.code, e.type)
    }
  }
}
function handlePlayButton(){
  if (!isGameOngoing){
    startGame()
    globalPlayButton.textContent = 'RESET'
  } else {
    resetGame()
    globalPlayButton.textContent = 'play'
  }
}
// **************************************************************************
// Events

document,addEventListener('keydown', handleKeyPress)
document,addEventListener('keyup',   handleKeyPress)
globalPlayButton,addEventListener('click',   handlePlayButton)

if (isDebugMode){
  document.querySelector('head').innerHTML += '<style>* {border: solid rgb(80, 80, 80) 0.2px;}</style>'
  document.querySelectorAll('*').forEach(node=> node.classList.add('debug'))
  setTimeout(()=>{
    players.forEach(player=> clearInterval(player.gameTimer))
    console.log('game time over')
  },5000)
}

// **************************************************************************
// populate with at least one player
players.push(new TetrisGame)

// **************************************************************************
// * export functions for testing
try {
  exports = {
    Tetromino,
    testJestConnection,
    buildPlayMatrix: buildNewPlayMatrix,

  }
} catch {
  'suppress this error in the browser until solution'
}