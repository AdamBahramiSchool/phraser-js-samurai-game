import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const { width, height } = this.scale;

        // Center the background image responsively
        this.add.image(width / 2, height / 2, 'background');

        // Scatter samurai and lava images at different locations
        this.add.image(width * 0.2, height * 0.3, '2dsamurai').setScale(0.3);
        this.add.image(width * 0.8, height * 0.7, '2dsamurai').setScale(0.3);
        this.add.image(width * 0.3, height * 0.8, 'lava').setScale(0.3);
        this.add.image(width * 0.7, height * 0.2, 'lava').setScale(0.3);

        // Centered title
        this.add.text(width / 2, height / 2 - 100, 'Samurai Hunter', {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
            stroke: '#CC401D', strokeThickness: 12,
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Centered author
        this.add.text(width / 2, height / 2, 'Made By: Adam Bahrami', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 12,
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Centered "Click to Play" below author
        this.add.text(width / 2, height / 2 + 80, 'Click to Play', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Enable click to start game
        this.input.once('pointerup', () => {
            this.scene.start('Game');
        });
    }
}