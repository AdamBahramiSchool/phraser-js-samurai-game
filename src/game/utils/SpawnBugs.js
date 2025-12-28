import { Bug } from '../objects/bug.js';

export class SpawnBugs {
    constructor(scene, samurai, bugsGroup, worldWidth, worldHeight) {
        this.scene = scene;
        this.samurai = samurai;
        this.bugsGroup = bugsGroup;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.spawnBug(); 
    }

    spawnBug() {
        const fromLeft = Phaser.Math.Between(0, 1) === 0;
        const x = fromLeft ? 0 : this.worldWidth;
        const y = Phaser.Math.Between(0, this.worldHeight);

        const bug = new Bug(this.scene, x, y);
        bug.setScale(0.5);
        this.bugsGroup.add(bug);

        // Schedule next bug spawn
        this.scene.time.delayedCall(
            Phaser.Math.Between(1000, 10000),
            () => this.spawnBug(),
            [],
            this
        );
    }
}