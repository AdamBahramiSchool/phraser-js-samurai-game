import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(this.scale.width/2, this.scale.height/2, 'background');
        this.add.rectangle(this.scale.width/2, this.scale.height/2, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(this.scale.width/2 - 230, this.scale.height/2, 4, 28, 0xffffff);

        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('2dsamurai', 'characters/2dsamurai.png');
        this.load.image('lava', 'lava/l2_ground.png');
        this.load.image('water_ruins','ruins/Water_ruins1.png')
        this.load.image('snow_ruins','ruins/White_ruins1.png')
        this.load.image('yellow_ruins','ruins/Yellow_ruins1.png')

        // Make sure 'background' is loaded in Boot or here as well
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}