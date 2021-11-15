const object = {}

function test() {
  return [1,2]
}

[object.prop1, object.prop2] =  test()

console.log(object.prop1)
console.log(object.prop2)