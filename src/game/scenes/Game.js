import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.samurai = this.physics.add.image(width/2, height/2, '2dsamurai');
        this.samurai.setScale(0.2);
        this.samurai.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Initialize swinging state
        this.swinging = false;

        // Sword swing on spacebar
        this.input.keyboard.on('keydown-SPACE', () => {
            if (!this.swinging) {
                this.swinging = true;
                this.tweens.add({
                    targets: this.samurai,
                    angle: 360 * 2,
                    duration: 100,
                    yoyo: true,
                    onComplete: () => { this.swinging = false; }
                });
            }
        });

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });
    }

    update() {
        const speed = 200;
        if (!this.samurai) return;

        // Reset velocity every frame
        this.samurai.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.samurai.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.samurai.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.samurai.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.samurai.setVelocityY(speed);
        }
    }
}