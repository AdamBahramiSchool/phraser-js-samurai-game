export class HealthBar {
    constructor(scene, x = 20, y = 20, width = 200, height = 30, maxHealth = 100) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.health = maxHealth;

        // Create graphics for the bar
        this.bar = scene.add.graphics();
        // Create text for the percentage
        this.text = scene.add.text(x + width / 2, y + height / 2, '', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#ffffff'
        }).setOrigin(0.5);

        this.draw();
    }

    setHealth(value) {
        this.health = Phaser.Math.Clamp(value, 0, this.maxHealth);
        this.draw();
    }

    draw() {
        this.bar.clear();
        // Background
        this.bar.fillStyle(0x222222, 1);
        this.bar.fillRect(this.x, this.y, this.width, this.height);
        // Health (green)
        const healthWidth = (this.health / this.maxHealth) * this.width;
        this.bar.fillStyle(0x00ff00, 1);
        this.bar.fillRect(this.x, this.y, healthWidth, this.height);
        // Text
        const percent = Math.round((this.health / this.maxHealth) * 100);
        this.text.setText(`${percent}%`);
    }
}