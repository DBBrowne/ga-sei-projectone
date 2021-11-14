// name: 'S',
const shapeMap = [
  [0,1,1],
  [1,1,0],
  [0,0,0]
]

function rotateSquareMatrixCW(matrix){
  return matrix.map((val, index) => matrix.map(row => row[index]).reverse())
}
function rotateSquareMatrixACW(matrix){
  // rotate clockwise three times  
  // let output = matrix
  // for (let i = 0;i <= 2;i++){
  //   output = rotateSquareMatrixCW(output)
  // }
  // return output
  return matrix.map((val, index) => matrix.map(row => row[index])).reverse()
}
function convertShapeMeshToOffsets(array){
  return array.reduce((acc,row, rowIndex)=>{
    row.forEach((flag, colIndex) => {
      if (flag){
        acc.push([1 - rowIndex,-1 + colIndex])
      }
    })
    return acc
  },[])
}

let shape = [
  [0,1,1],
  [1,1,0],
  [0,0,0]
]
console.log(convertShapeMeshToOffsets(shape))
for (let i = 0;i <= 2;i++){
  shape = rotateSquareMatrixCW(shape)
  const newOffset = convertShapeMeshToOffsets(shape)
  console.log(newOffset)
}
console.log('rotateACW from original shape')
shape = shapeMap
for (let i = 0;i <= 3;i++){
  shape = rotateSquareMatrixACW(shape)
  const newOffset = convertShapeMeshToOffsets(shape)
  console.log(newOffset)
}


console.log('n=4 matrix')

const shapeN4 = [
  [0,0,0,0],
  [1,1,1,1],
  [0,0,0,0],
  [0,0,0,0]
]

shape = shapeN4
console.log(convertShapeMeshToOffsets(shape))
for (let i = 0;i <= 2;i++){
  shape = rotateSquareMatrixCW(shape)
  const newOffset = convertShapeMeshToOffsets(shape)
  console.log(newOffset)
}
console.log('rotateACW from original shape')
shape = shapeN4
for (let i = 0;i <= 3;i++){
  shape = rotateSquareMatrixACW(shape)
  const newOffset = convertShapeMeshToOffsets(shape)
  console.log(newOffset)
}



/*
    axis labels:
    [0,1,1] 1-i i=0 = 1
    [1,1,0] 1-i i=1 = 0
    [0,0,0] 1-i i=2 =-1

    [0,1,0],
    [0,1,1],
    [0,0,1]
    
    [0,0,0],
    [0,1,1],
    [1,1,0]

    [1,0,0],
    [1,1,0],
    [0,1,0]

    shapeOffsets: [[ 1, 0], [ 1, 1], [ 0,-1], [ 0, 0]],
    shapeOffsets: [[ 1, 0], [ 0, 0], [ 0, 1], [-1, 1]],
    shapeOffsets: [[ 0, 0], [ 0, 1], [-1,-1], [-1, 0]],
    shapeOffsets: [[ 1,-1], [ 0,-1], [ 0, 0], [-1, 0]],

    [1,1,0],
    [0,1,1],
    [0,0,0]

*/