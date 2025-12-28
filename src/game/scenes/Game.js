import { Scene } from 'phaser';
import {Samurai} from '../objects/samurai.js';
import {Bug} from '../objects/bug.js'
import { Ruins } from '../objects/ruins.js';
import { HealthBar } from '../objects/healthbar.js';
import { SamuraiAttack } from '../utils/SamuraiAttack.js';
import { PlaceObstacles } from '../utils/PlaceObstacles.js';
import {resizeObject} from '../utils/ResizeObjects.js'
import { SpawnBugs } from '../utils/SpawnBugs.js';
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

        // OBSTACLES AND SAMURAI
        this.obstacles = this.physics.add.staticGroup();

        this.samurai=new Samurai(this,worldWidth / 2, worldHeight / 2);
        
        const placer = new PlaceObstacles();
        const ruinsData = placer.getRuinsLocations(worldWidth, worldHeight);
        for (const data of ruinsData) {
            let ruin = new Ruins(this, data.x, data.y, data.key);
            ruin = resizeObject(ruin, 1.5)
            this.obstacles.add(ruin);
        }
        this.physics.add.collider(this.samurai, this.obstacles);
        
        // SAMURAI ATTACKS
        this.samuraiAttack = new SamuraiAttack(this, this.samurai);

        // WORLD BOUNDS
        this.cameras.main.startFollow(this.samurai);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.dashCooldown = 0;

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });

        // BUGS
        this.bugs = this.physics.add.group();
        this.physics.add.collider(this.bugs,this.obstacles)
        this.spawnBugsInstance = new SpawnBugs(this, this.samurai, this.bugs, worldWidth, worldHeight);
       
        // HEALTH BAR
        const margin = 20;
        const barWidth = 200;
        const barHeight = 30;
        const x = margin;
        const y = this.scale.height - barHeight - margin;
        this.healthbar = new HealthBar(this, x, y, barWidth, barHeight, 100);

        // Fix health bar to the camera (screen space)
        this.healthbar.bar.setScrollFactor(0);
        this.healthbar.text.setScrollFactor(0);
        
       
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