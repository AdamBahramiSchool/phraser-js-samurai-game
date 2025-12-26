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

        const worldWidth = 2000;
        const worldHeight = 2000;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        this.add.image(worldWidth / 2, worldHeight / 2, 'lava').setAlpha(0.5);

        this.obstacles = this.physics.add.staticGroup();

        const placedLocations = []
        
        for (let i = 0; i < 10; i++) {
            let x,y,valid;
            do{
                x = Phaser.Math.Between(200, worldWidth - 100);
                y = Phaser.Math.Between(200,worldHeight-100);
                valid = true;
                for(const location of placedLocations){
                    const dx= location.x - x;
                    const dy = location.y - y;
                    if(Math.sqrt(dx * dx + dy*dy)<300){
                        valid = false;
                        break;
                    }
                }
            }while(!valid)
            
            placedLocations.push({x,y});

            const keys = ['water_ruins', 'snow_ruins', 'yellow_ruins'];
            const key = keys[Phaser.Math.Between(0, keys.length - 1)];
            const ruin = this.obstacles.create(x, y, key).setScale(2);
            ruin.body.setSize(ruin.width * 0.5, ruin.height * 0.5);
            ruin.refreshBody();
        }

        this.samurai = this.physics.add.image(worldWidth / 2, worldHeight / 2, '2dsamurai');
        this.samurai.setScale(0.2);

        this.samurai.body.setSize(this.samurai.width * 0.5, this.samurai.height * 0.5);
        this.samurai.body.setOffset(this.samurai.width * 0.25, this.samurai.height * 0.25);

        this.physics.add.collider(this.samurai, this.obstacles);
        
        this.cameras.main.startFollow(this.samurai);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

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

        // Group for bugs
        this.bugs = this.physics.add.group();

        this.physics.add.collider(this.bugs,this.obstacles)

        // Function to spawn a bug
        this.spawnBug = () => {
            // Randomly choose left or right side
            const fromLeft = Phaser.Math.Between(0, 1) === 0;
            const x = fromLeft ? 0 : worldWidth;
            const y = Phaser.Math.Between(0, worldHeight);

            const bug = this.bugs.create(x, y, 'game_bug');
            bug.setScale(0.5);

            // Calculate direction vector towards samurai
            const dx = this.samurai.x - x;
            const dy = this.samurai.y - y;
            const angle = Math.atan2(dy, dx);

            // Set velocity towards samurai
            const speed = 150;
            bug.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

            // Schedule next bug spawn
            this.time.delayedCall(
                Phaser.Math.Between(1000, 10000), // 1 to 10 seconds
                this.spawnBug,
                [],
                this
            );
        };

        // Start the first bug spawn
        this.spawnBug();
    }

    update() {
        const speed = 200;
        if (!this.samurai) return;

        // Samurai movement
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

        // Make bugs chase the samurai
        this.bugs.children.iterate(bug => {
            if (!bug) return;
            const dx = this.samurai.x - bug.x;
            const dy = this.samurai.y - bug.y;
            const angle = Math.atan2(dy, dx);
            const bugSpeed = 150;
            bug.setVelocity(Math.cos(angle) * bugSpeed, Math.sin(angle) * bugSpeed);
        });
    }
}