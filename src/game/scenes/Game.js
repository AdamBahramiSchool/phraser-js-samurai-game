import { Scene } from 'phaser';
import {Samurai} from '../objects/samurai.js';
import { Ruins } from '../objects/ruins.js';
import { HealthBar } from '../objects/healthbar.js';
import { SamuraiAttack } from '../utils/SamuraiAttack.js';
import { PlaceObstacles } from '../utils/PlaceObstacles.js';
import {resizeObject} from '../utils/ResizeObjects.js'
import { SpawnBugs } from '../utils/SpawnBugs.js';
import { handleSamuraiMovement, handleSamuraiDash, updateBugsChaseSamurai } from '../utils/UpdateUtils.js';

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
        this.healthbar = new HealthBar(this, x, y, barWidth, barHeight, 100);            // Fix health bar to the camera (screen space)
        this.healthbar.bar.setScrollFactor(0);
        this.healthbar.text.setScrollFactor(0);
        
        // for space movement in update
        this.isDashing = false;
    }   

    update() {
        const speed = 200;
        const dashState = {
            dashSpeed: 600,
            dashDuration: 100,
            dashCooldownTime: 500,
            isDashing: this.isDashing,
            dashCooldown: this.dashCooldown
        };

        handleSamuraiMovement(this.samurai, this.cursors, speed, this.isDashing);

        handleSamuraiDash(this, this.samurai, this.cursors, {
            dashSpeed: 600,
            dashDuration: 100,
            dashCooldownTime: 500
        });

        // Sync dash state back to the scene
        this.isDashing = dashState.isDashing;
        this.dashCooldown = dashState.dashCooldown;
        console.log(this.isDashing)
        updateBugsChaseSamurai(this.bugs, this.samurai, 150);
    }
}