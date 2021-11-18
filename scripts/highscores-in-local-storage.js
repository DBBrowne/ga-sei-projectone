const localHiscoresKey = 'tentris-hiscores'

console.log(localStorage.getItem(localHiscoresKey))

if (!localStorage.getItem(localHiscoresKey)){
  const defaultHiscores = JSON.stringify([
    [1000,900,800,700,600,500,400,300,100,50]
  ])
  localStorage.setItem(localHiscoresKey, defaultHiscores)
}

console.log(localStorage.getItem(localHiscoresKey))