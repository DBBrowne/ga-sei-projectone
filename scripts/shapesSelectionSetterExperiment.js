class TetrominoShapesSelection extends Array {
  constructor() {
    super()
    this.maxShapeSize = 0
  }
  // need expression to select all ints - !isNaN does not work
  set [0](value) {
    console.log('new items',value)
    console.log('new length',value.shapeMap.length)
    console.log('thisMaxSize', this.maxShapeSize)
    const newShapeSize = value.shapeMap.length
    if (newShapeSize === 0){
      value.maxShapeSize = this.reduce((acc,shape)=>{
        return Math.max(acc, shape.shapeMap.length)
      },0)
    }
    if (newShapeSize > this.maxShapeSize){
      this.maxShapeSize = newShapeSize
    }
    // need to set original target to value
    // this[0] = value // infinite loop
    return value //Reflect.set(value)
  }
  set [1](value) {
    console.log('new items',value)
    console.log('new length',value.shapeMap.length)
    console.log('thisMaxSize', this.maxShapeSize)
    const newShapeSize = value.shapeMap.length
    if (newShapeSize === 0){
      value.maxShapeSize = this.reduce((acc,shape)=>{
        return Math.max(acc, shape.shapeMap.length)
      },0)
    }
    if (newShapeSize > this.maxShapeSize){
      this.maxShapeSize = newShapeSize
    }
    // need to set original target to value
    // this[0] = value // infinite loop
    return value //Reflect.set(value)
  }
}

class TetrominoShape {
  constructor(shapeMap, fillColor = 'white'){
    this.shapeMap = shapeMap
    this.fillColor = fillColor
  }
}


const shapes = new TetrominoShapesSelection

// console.log(shapes)

const newShape = new TetrominoShape(
  [
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0]
  ],
  'gold'
)
const newShape2 = new TetrominoShape(
  [
    [0,0,0],
    [0,1,1],
    [0,1,1]
  ],
  'red'
)

// console.log(newShape)

shapes.push(newShape)
shapes.push(newShape2)

console.log('after push')
console.log(shapes)
console.log(shapes.length)
console.log(shapes.maxShapeSize)
// shapes.forEach(shape=> console.log(shape.fillColor))

console.log('end')