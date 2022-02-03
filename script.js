var config = {
    type:Phaser.AUTO,
    width:800,
    height:600,
    physics:{
        default:"arcade",
        arcade:{
            gravity:{
                y:300
            }
        }
    },
    
    scene:{
        preload:preload,
        create:create,
        update:update
    }
}
var game = new Phaser.Game(config)
function preload(){
    this.load.image('sky','assets/sky.png')
    this.load.image('bomb','assets/bomb.png')
    this.load.image('platform','assets/platform.png')
    this.load.image('star','assets/star.png')
    this.load.spritesheet('dude','assets/dude.png',{
        frameWidth:32,frameHeight:48
    })
}
function create(){
    this.anims.create({
        key:"a, left",
        frames:this.anims.generateFrameNumbers('dude',{
            start:0,end:3
        }),
        frameRate:10,
        repeat:-1
    })
    this.anims.create({
        key:"d, right",
        frames:this.anims.generateFrameNumbers('dude',{
            start:5,end:8
        }),
        frameRate:10,
        repeat:-1
    })
    this.anims.create({
        key:"turn",
        frames:this.anims.generateFrameNumbers('dude',{
            start:4,end:4
        }),
        frameRate:10,
        repeat:-1
    })
    this.add.image(400,300,'sky')
    platforms = this.physics.add.staticGroup()
    platforms.create(600,400,'platform')
    platforms.create(50,250,'platform')
    platforms.create(750,220,'platform')
    platforms.create(400,568, 'platform').setScale(2).refreshBody()
    player = this.physics.add.sprite(100,450,'dude')
    player.setCollideWorldBounds(true)
    this.physics.add.collider(player,platforms)
    player.setBounce(875)
    cursors= this.input.keyboard.createCursorKeys()
    stars=this.physics.add.group({
        key:'star',
        repeat:11,
        setXY:{
            x:12,y:0,stepX:70
        }
    })
    this.physics.add.collider(stars,platforms)
    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8))
    })
    this.physics.add.overlap(player,stars,collectStar,null,this)
    score = 0
    scoretext= this.add.text(16,16,'score:0',{fontSize:'32px',fill:'#000'})
    bombs = this.physics.add.group()
    this.physics.add.collider(bombs,platforms)
    this.physics.add.collider(bombs,player,hitPlayer,null,this)

}
function hitPlayer(p,b){
    this.physics.pause()
    player.setTint(0xff0000)
}
function collectStar(player,star){
    star.disableBody(true,true)
    score += 10
    scoretext.text='score:'+ score
    if(stars.countActive(true)==0){
        stars.children.iterate(function(s){
            s.enableBody(true,s.x,0,true,true)
        })
        var bomb = bombs.create(400,16,'bomb')
        bomb.setCollideWorldBounds(true)
        bomb.setBounce(1)
        bomb.setVelocity(Phaser.Math.Between(-200,200),20)
    }
}
function update(){
   if(cursors.left.isDown){
       player.setVelocityX(-160)
       player.anims.play('left',true)
   } 
   else if (cursors.right.isDown){
       player.setVelocityX(160)
       player.anims.play('right',true)
   }
   else{
       player.setVelocityX(0)
       player.anims.play('turn',true)
   }
   if(cursors.up.isDown && player.body.touching.down){
       player.setVelocityY(-330)
   }
}
var scorestring = ''
