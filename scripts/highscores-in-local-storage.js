
const storageDebugMode = true

const localHiscoresStorageKey = 'tentris-hiscores'

const winningscore = 650

storageDebugMode && console.log(localStorage.getItem(localHiscoresStorageKey))

if (!localStorage.getItem(localHiscoresStorageKey)){
  const defaultHiscores = JSON.stringify(
    [1000,900,800,700,600,500,400,300,100,50]
  )
  localStorage.setItem(localHiscoresStorageKey, defaultHiscores)
}

storageDebugMode && console.log(localStorage.getItem(localHiscoresStorageKey))

