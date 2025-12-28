import Phaser from 'phaser';

export class PlaceObstacles {
    constructor() {}

    getRuinsLocations(worldWidth, worldHeight) {
        const placedLocations = [];
        for (let i = 0; i < 10; i++) {
            let x, y, valid;
            do {
                x = Phaser.Math.Between(200, worldWidth - 100);
                y = Phaser.Math.Between(200, worldHeight - 100);
                valid = true;
                for (const location of placedLocations) {
                    const dx = location.x - x;
                    const dy = location.y - y;
                    if (Math.sqrt(dx * dx + dy * dy) < 300) {
                        valid = false;
                        break;
                    }
                }
            } while (!valid);

            const keys = ['water_ruins', 'snow_ruins', 'yellow_ruins'];
            const key = keys[Phaser.Math.Between(0, keys.length - 1)];
            placedLocations.push({ x, y, key });
        }
        return placedLocations;
    }
}