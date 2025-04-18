
import Phaser from 'phaser'

interface Controls {
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  up: Phaser.Input.Keyboard.Key
  fire: Phaser.Input.Keyboard.Key
  w: Phaser.Input.Keyboard.Key
  a: Phaser.Input.Keyboard.Key
  d: Phaser.Input.Keyboard.Key
  space: Phaser.Input.Keyboard.Key
}

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private coins!: Phaser.Physics.Arcade.Group
  private enemies!: Phaser.Physics.Arcade.Group
  private repulsors!: Phaser.Physics.Arcade.Group
  private controls!: Controls
  private score: number = 0
  private lives: number = 3
  private isInvulnerable: boolean = false
  private canFire: boolean = true
  private fireDelay: number = 500
  private lastFired: number = 0
  private music!: Phaser.Sound.BaseSound
  private jumpSound!: Phaser.Sound.BaseSound
  private coinSound!: Phaser.Sound.BaseSound
  private shootSound!: Phaser.Sound.BaseSound
  private hitSound!: Phaser.Sound.BaseSound
  private onScoreUpdate: (score: number) => void
  private onLivesUpdate: (lives: number) => void
  private onGameOver: () => void
  private background!: Phaser.GameObjects.TileSprite
  private mountains!: Phaser.GameObjects.TileSprite

  constructor(
    onScoreUpdate: (score: number) => void,
    onLivesUpdate: (lives: number) => void,
    onGameOver: () => void
  ) {
    super('MainScene')
    this.onScoreUpdate = onScoreUpdate
    this.onLivesUpdate = onLivesUpdate
    this.onGameOver = onGameOver
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(0, 0, 3200, 600)

    // Add background
    this.background = this.add.tileSprite(0, 0, 3200, 600, 'sky')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
    
    this.mountains = this.add.tileSprite(0, 100, 3200, 300, 'mountains')
      .setOrigin(0, 0)
      .setScrollFactor(0.25, 0)
      .setAlpha(0.7)

    // Create platforms
    this.platforms = this.physics.add.staticGroup()

    // Ground platforms
    for (let i = 0; i < 20; i++) {
      if (i !== 5 && i !== 12) { // gaps in the ground
        this.platforms.create(i * 200, 568, 'ground').setScale(1).refreshBody()
      }
    }

    // Floating platforms
    this.createPlatform(600, 400)
    this.createPlatform(800, 350)
    this.createPlatform(1000, 300)
    this.createPlatform(1200, 250)
    this.createPlatform(1500, 300)
    this.createPlatform(1700, 400)
    this.createPlatform(2000, 350)
    this.createPlatform(2200, 250)
    this.createPlatform(2500, 350)
    this.createPlatform(2800, 400)

    // Create player
    this.player = this.physics.add.sprite(100, 450, 'ironman')
    this.player.setBounce(0.2)
    this.player.setCollideWorldBounds(true)
    this.player.setTint(0xff0000) // Red tint for Iron Man

    // Camera follows player
    this.cameras.main.setBounds(0, 0, 3200, 600)
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08)

    // Create controls
    this.controls = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
      w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    // Create coins
    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: 30,
      setXY: { x: 12, y: 0, stepX: 100 }
    })

    this.coins.children.iterate((child) => {
      const coin = child as Phaser.Physics.Arcade.Image
      coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
      coin.setY(Phaser.Math.Between(150, 400))
      return true
    })

    // Create enemies
    this.enemies = this.physics.add.group()
    this.createEnemies()

    // Create repulsor blasts
    this.repulsors = this.physics.add.group({
      defaultKey: 'repulsor',
      maxSize: 10
    })

    // Colliders
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.coins, this.platforms)
    this.physics.add.collider(this.enemies, this.platforms)
    this.physics.add.collider(this.repulsors, this.platforms, this.hitPlatform, undefined, this)
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this)
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, undefined, this)
    this.physics.add.overlap(this.repulsors, this.enemies, this.hitEnemyWithRepulsor, undefined, this)

    // Load sounds
    this.jumpSound = this.sound.add('jump')
    this.coinSound = this.sound.add('coin')
    this.shootSound = this.sound.add('shoot')
    this.hitSound = this.sound.add('hit')
    
    // Background music
    this.music = this.sound.add('theme', { loop: true, volume: 0.5 })
    this.music.play()
  }

  update(time: number) {
    // Player movement
    if (this.controls.left.isDown || this.controls.a.isDown) {
      this.player.setVelocityX(-160)
      this.player.anims.play('left', true)
    } else if (this.controls.right.isDown || this.controls.d.isDown) {
      this.player.setVelocityX(160)
      this.player.anims.play('right', true)
    } else {
      this.player.setVelocityX(0)
      this.player.anims.play('turn')
    }

    // Jump
    if ((this.controls.up.isDown || this.controls.w.isDown || this.controls.space.isDown) && this.player.body.touching.down) {
      this.player.setVelocityY(-500)
      this.jumpSound.play()
    }

    // Fire repulsor
    if (this.controls.fire.isDown && time > this.lastFired + this.fireDelay && this.canFire) {
      this.fireRepulsor()
      this.lastFired = time
    }

    // Parallax scrolling
    this.background.tilePositionX = this.cameras.main.scrollX * 0.1
    this.mountains.tilePositionX = this.cameras.main.scrollX * 0.4

    // Move enemies
    this.enemies.children.iterate((enemy) => {
      const e = enemy as Phaser.Physics.Arcade.Sprite
      if (e.getData('direction') === 'left') {
        e.setVelocityX(-100)
        if (e.x < e.getData('startX') - 100) {
          e.setData('direction', 'right')
        }
      } else {
        e.setVelocityX(100)
        if (e.x > e.getData('startX') + 100) {
          e.setData('direction', 'left')
        }
      }
      return true
    })
  }

  private createPlatform(x: number, y: number) {
    // Create a platform at the given position
    const platform = this.platforms.create(x, y, 'platform')
    platform.setScale(2, 0.5).refreshBody()
    
    // Add a coin above some platforms
    if (Math.random() > 0.5) {
      const coin = this.coins.create(x, y - 50, 'coin')
      coin.setBounceY(0.3)
    }
  }

  private createEnemies() {
    // Create enemies at specific positions
    const enemyPositions = [
      { x: 400, y: 400 },
      { x: 800, y: 200 },
      { x: 1200, y: 150 },
      { x: 1600, y: 400 },
      { x: 2000, y: 200 },
      { x: 2400, y: 300 },
      { x: 2800, y: 200 }
    ]

    enemyPositions.forEach(pos => {
      const enemy = this.enemies.create(pos.x, pos.y, 'enemy')
      enemy.setBounce(0.2)
      enemy.setCollideWorldBounds(true)
      enemy.setData('startX', pos.x)
      enemy.setData('direction', 'left')
      enemy.setTint(0x00ffff) // Cyan tint for enemies
    })
  }

  private collectCoin(player: Phaser.GameObjects.GameObject, coinObj: Phaser.GameObjects.GameObject) {
    const coin = coinObj as Phaser.Physics.Arcade.Image
    coin.disableBody(true, true)
    
    // Add score
    this.score += 10
    this.onScoreUpdate(this.score)
    this.coinSound.play()

    // Check if all coins are collected
    if (this.coins.countActive(true) === 0) {
      // Respawn coins
      this.coins.children.iterate((child) => {
        const c = child as Phaser.Physics.Arcade.Image
        c.enableBody(true, c.x, 0, true, true)
        return true
      })
    }
  }

  private hitEnemy(player: Phaser.GameObjects.GameObject, enemyObj: Phaser.GameObjects.GameObject) {
    if (this.isInvulnerable) return

    this.isInvulnerable = true
    this.lives--
    this.onLivesUpdate(this.lives)
    this.hitSound.play()

    // Flash player
    this.tweens.add({
      targets: this.player,
      alpha: 0.5,
      duration: 100,
      ease: 'Linear',
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.player.alpha = 1
        this.isInvulnerable = false
      }
    })

    // Check game over
    if (this.lives <= 0) {
      this.music.stop()
      this.onGameOver()
      this.scene.pause()
    }
  }

  private fireRepulsor() {
    const repulsor = this.repulsors.get(this.player.x, this.player.y)
    
    if (!repulsor) return
    
    repulsor.setActive(true)
    repulsor.setVisible(true)
    repulsor.setTint(0x00ffff) // Cyan tint for repulsor
    
    // Direction based on player facing
    const direction = this.player.anims.currentAnim.key === 'left' ? -1 : 1
    repulsor.setVelocityX(direction * 600)
    
    // Add glow effect
    repulsor.setBlendMode(Phaser.BlendModes.ADD)
    
    this.shootSound.play()
    
    // Destroy after 1 second
    this.time.delayedCall(1000, () => {
      repulsor.setActive(false)
      repulsor.setVisible(false)
    })
  }

  private hitEnemyWithRepulsor(repulsorObj: Phaser.GameObjects.GameObject, enemyObj: Phaser.GameObjects.GameObject) {
    const repulsor = repulsorObj as Phaser.Physics.Arcade.Image
    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite
    
    repulsor.setActive(false)
    repulsor.setVisible(false)
    
    // Create explosion effect
    this.tweens.add({
      targets: enemy,
      alpha: 0,
      scale: 1.5,
      duration: 200,
      onComplete: () => {
        enemy.disableBody(true, true)
        
        // Add score
        this.score += 50
        this.onScoreUpdate(this.score)
        
        // Respawn enemy after delay
        this.time.delayedCall(3000, () => {
          enemy.enableBody(true, enemy.getData('startX'), 0, true, true)
          enemy.alpha = 1
          enemy.setScale(1)
        })
      }
    })
    
    this.hitSound.play()
  }

  private hitPlatform(repulsorObj: Phaser.GameObjects.GameObject) {
    const repulsor = repulsorObj as Phaser.Physics.Arcade.Image
    repulsor.setActive(false)
    repulsor.setVisible(false)
  }
}