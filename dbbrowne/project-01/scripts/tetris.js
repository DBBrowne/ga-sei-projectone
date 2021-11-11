//  * TETRIS

function testJestConnection() {
  console.log('hello')
  return 'hello'
}

// * DOM Elements

const playMatrixView = document.querySelector('.play-matrix')

// * Variables

const playMatrixHeight = 24
const playMatrixWidth = 16
const playMatrix = []

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

// * Functions

// * Events

module.exports = {
  testJestConnection,
  buildPlayMatrix,
}