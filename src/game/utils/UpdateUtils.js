export function handleSamuraiMovement(samurai, cursors, speed, isDashing) {
    if (!samurai || isDashing) return;

    samurai.setVelocity(0);

    if (cursors.left.isDown) {
        samurai.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        samurai.setVelocityX(speed);
    }

    if (cursors.up.isDown) {
        samurai.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        samurai.setVelocityY(speed);
    }
}

export function handleSamuraiDash(scene, samurai, cursors, dashConfig) {
    const { dashSpeed, dashDuration, dashCooldownTime } = dashConfig;
    if (
        cursors.space.isDown &&
        scene.time.now > scene.dashCooldown &&
        !scene.isDashing
    ) {
        let dx = 0, dy = 0;
        if (cursors.left.isDown) dx = -1;
        else if (cursors.right.isDown) dx = 1;
        if (cursors.up.isDown) dy = -1;
        else if (cursors.down.isDown) dy = 1;

        if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;

            samurai.setVelocity(dx * dashSpeed, dy * dashSpeed);
            scene.isDashing = true;
            scene.dashCooldown = scene.time.now + dashCooldownTime;

            scene.time.delayedCall(dashDuration, () => {
                scene.isDashing = false;
                samurai.setVelocity(0);
            });
        }
    }
}

export function updateBugsChaseSamurai(bugs, samurai, bugSpeed) {
    bugs.children.iterate(bug => {
        if (!bug) return;
        const dx = samurai.x - bug.x;
        const dy = samurai.y - bug.y;
        const angle = Math.atan2(dy, dx);
        bug.setVelocity(Math.cos(angle) * bugSpeed, Math.sin(angle) * bugSpeed);
    });
}