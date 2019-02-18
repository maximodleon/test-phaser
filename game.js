let game

window.onload = function() {
 let config = {
  width: 480,
  height: 640,
  backgroundColor: 0xff0000,
  scene: [ bootGame, playGame ]
 }

 game = new Phaser.Game(config)
 window.focus()
 resizeGame()
 window.addEventListener('resize', resizeGame)
}

function resizeGame() {
  const canvas = document.querySelector('canvas')
  const windowWidth = window.innerWidth 
  const windowHeight = window.innerHeight
  const windowRatio = windowWidth/windowHeight
  const gameRatio = game.config.width/game.config.height

  if(windowRatio < gameRatio){
    canvas.style.width = `${windowWidth}px`
    canvas.style.height = `${windowWidth/gameRatio}px`
  } else {
    canvas.style.width = `${(windowHeight * gameRatio)}px`
    canvas.style.height = `${windowHeight}px`
  }
}

// Scene classes
class playGame extends Phaser.Scene {
   constructor() {
      super('PlayGame')
   }

    create() {
      console.log('this is my awesome game')
    }
}

class bootGame extends Phaser.Scene {

  constructor() {
    super('BootGame') 
  }

  create() {
    console.log('game is booting...')
    this.scene.start('PlayGame')
  }
}
