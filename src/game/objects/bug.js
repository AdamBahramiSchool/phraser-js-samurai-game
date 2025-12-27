import Phaser from 'phaser';

export class Bug extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'game_bug');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(0.2);
    }
}