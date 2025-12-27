import { Scene } from 'phaser';
import {Samurai} from '../objects/samurai.js';
import {Bug} from '../objects/bug.js'
import { Ruins } from '../objects/ruins.js';
import { HealthBar } from '../objects/healthbar.js';

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
            const ruin = new Ruins(this, x, y, key);
            this.obstacles.add(ruin);
            ruin.setScale(2);
            ruin.body.setSize(ruin.width * 0.5, ruin.height * 0.5);
            ruin.refreshBody();
        }

        this.samurai=new Samurai(this,worldWidth / 2, worldHeight / 2);

        this.physics.add.collider(this.samurai, this.obstacles);
        
        this.cameras.main.startFollow(this.samurai);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Initialize swinging state
        this.swinging = false;

        this.dashCooldown = 0;

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });

        // Group for bugs
        this.bugs = this.physics.add.group();

        this.physics.add.collider(this.bugs,this.obstacles)

        // Function to spawn a bug
        this.spawnBug = () => {
            const fromLeft = Phaser.Math.Between(0, 1) === 0;
            const x = fromLeft ? 0 : worldWidth;
            const y = Phaser.Math.Between(0, worldHeight);

            const bug = new Bug(this, x, y);
            bug.setScale(0.5);
            this.bugs.add(bug);

            // Calculate direction vector towards samurai
            const dx = this.samurai.x - x;
            const dy = this.samurai.y - y;
            const angle = Math.atan2(dy, dx);

            // Set velocity towards samurai
            const speed = 150;
            bug.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

            // Schedule next bug spawn
            this.time.delayedCall(
                Phaser.Math.Between(1000, 10000),
                this.spawnBug,
                [],
                this
            );
        };

        // Start the first bug spawn
        this.spawnBug();

        // Place at bottom left, with a margin
        const margin = 20;
        const barWidth = 200;
        const barHeight = 30;
        const x = margin;
        const y = this.scale.height - barHeight - margin;
        this.healthbar = new HealthBar(this, x, y, barWidth, barHeight, 100);

        // Fix health bar to the camera (screen space)
        this.healthbar.bar.setScrollFactor(0);
        this.healthbar.text.setScrollFactor(0);
        
        // A key attack (spin -45 degrees)
        this.input.keyboard.on('keydown-A', () => {
            if (!this.swinging) {
                this.swinging = true;
                this.tweens.add({
                    targets: this.samurai,
                    angle: '-=75',
                    duration: 50,
                    yoyo: true,
                    onComplete: () => { this.swinging = false; }
                });
            }
        });

        // D key attack (spin +45 degrees)
        this.input.keyboard.on('keydown-D', () => {
            if (!this.swinging) {
                this.swinging = true;
                this.tweens.add({
                    targets: this.samurai,
                    angle: '+=75',
                    duration: 50,
                    yoyo: true,
                    onComplete: () => { this.swinging = false; }
                });
            }
            });
        this.isDashing = false;
    }   

    update() {
        const speed = 200;
        if (!this.samurai) return;

        // Samurai movement
        // Only reset velocity if not dashing
if (!this.isDashing) {
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

const dashSpeed = 600;
const dashDuration = 100; // ms
const dashCooldownTime = 500; // ms

if (
    this.cursors.space.isDown &&
    this.time.now > this.dashCooldown &&
    !this.isDashing
) {
    let dx = 0, dy = 0;
    if (this.cursors.left.isDown) dx = -1;
    else if (this.cursors.right.isDown) dx = 1;
    if (this.cursors.up.isDown) dy = -1;
    else if (this.cursors.down.isDown) dy = 1;

    if (dx !== 0 || dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dy /= len;

        this.samurai.setVelocity(dx * dashSpeed, dy * dashSpeed);
        this.isDashing = true;
        this.dashCooldown = this.time.now + dashCooldownTime;

        this.time.delayedCall(dashDuration, () => {
            this.isDashing = false;
            this.samurai.setVelocity(0);
        });
    }
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