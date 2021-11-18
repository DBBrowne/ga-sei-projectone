
const storageDebugMode = true

const localHiscoresStorageKey = 'tentris-hiscores'

const winningscore = 650

storageDebugMode && console.log('local storage', localHiscoresStorageKey,':' , localStorage.getItem(localHiscoresStorageKey))

if (!localStorage.getItem(localHiscoresStorageKey)){
  const defaultHiscores = JSON.stringify(
    [1000,900,800,700,600,500,400,300,100,50]
  )
  localStorage.setItem(localHiscoresStorageKey, defaultHiscores)
}

const localHiscores = JSON.parse(localStorage.getItem(localHiscoresStorageKey))

storageDebugMode && console.log(localHiscores)

const lowestHiscore = localHiscores[localHiscores.length - 1]

if (winningscore > lowestHiscore){
  localHiscores.pop()
  localHiscores.push(winningscore)
  localHiscores.sort((a, b) => b - a)
}

console.log(localHiscores)