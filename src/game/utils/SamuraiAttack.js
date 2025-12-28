import Phaser from 'phaser';

export class SamuraiAttack {
    constructor(scene, samurai) {
        this.scene = scene;
        this.samurai = samurai;
        this.leftangle = -75;
        this.rightangle = 75;
        this.swinging = false;
        this.duration = 50;
        this.is_yoyo = true;

        // Register input listeners ONCE
        this.scene.input.keyboard.on('keydown-A', () => this.leftAttack());
        this.scene.input.keyboard.on('keydown-D', () => this.rightAttack());
    }

    leftAttack() {
        if (!this.swinging) {
            this.swinging = true;
            this.scene.tweens.add({
                targets: this.samurai,
                angle: this.leftangle,
                duration: this.duration,
                yoyo: this.is_yoyo,
                onComplete: () => { this.swinging = false; }
            });
        }
    }

    rightAttack() {
        if (!this.swinging) {
            this.swinging = true;
            this.scene.tweens.add({
                targets: this.samurai,
                angle: this.rightangle,
                duration: this.duration,
                yoyo: this.is_yoyo,
                onComplete: () => { this.swinging = false; }
            });
        }
    }
}