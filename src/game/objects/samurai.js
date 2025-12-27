import Phaser from 'phaser'
export class Samurai extends Phaser.Physics.Arcade.Image{
    constructor(scene,x,y){
        super(scene,x,y,'2dsamurai');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.2);
        this.body.setSize(this.width * 0.5, this.height * 0.5);
        this.body.setOffset(this.width*0.25, this.height * 0.25);
    }
}