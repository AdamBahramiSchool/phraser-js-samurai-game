import Phaser from 'phaser'
export class Ruins extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true makes it static
    }
}