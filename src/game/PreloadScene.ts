
import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    // Show loading progress
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(240, 270, 320, 50)
    
    const width = this.cameras.main.width
    const height = this.cameras.main.height
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        color: '#ffffff'
      }
    })
    loadingText.setOrigin(0.5, 0.5)
    
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        color: '#ffffff'
      }
    })
    percentText.setOrigin(0.5, 0.5)
    
    this.load.on('progress', (value: number) => {
      percentText.setText(parseInt(String(value * 100)) + '%')
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(250, 280, 300 * value, 30)
    })
    
    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
      percentText.destroy()
    })

    // Load game assets
    this.load.image('sky', 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1200&auto=format&fit=crop')
    this.load.image('mountains', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/starstruck/background2.png')
    this.load.image('ground', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/platform.png')
    this.load.image('platform', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/block.png')
    this.load.image('coin', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/coin.png')
    this.load.image('repulsor', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/bullets/bullet7.png')
    this.load.image('enemy', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/space-baddie.png')
    
    // Load ironman spritesheet
    this.load.spritesheet('ironman', 
      'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/dude.png',
      { frameWidth: 32, frameHeight: 48 }
    )

    // Load sounds
    this.load.audio('jump', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/audio/SoundEffects/jump.wav')
    this.load.audio('coin', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/audio/SoundEffects/coin.wav')
    this.load.audio('shoot', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/audio/SoundEffects/shot.wav')
    this.load.audio('hit', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/audio/SoundEffects/explode.wav')
    this.load.audio('theme', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/audio/cyber-war.mp3')
  }

  create() {
    try {
      // Create animations
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('ironman', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      })

      this.anims.create({
        key: 'turn',
        frames: [ { key: 'ironman', frame: 4 } ],
        frameRate: 20
      })

      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('ironman', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      })

      this.scene.start('MainScene')
    } catch (error) {
      console.error('Error creating animations:', error)
      // Still try to start the main scene even if animations fail
      this.scene.start('MainScene')
    }
  }
}