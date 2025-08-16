// RainEffect.js

class RainEffect {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.rainGroup = null;

        // Các tham số mặc định
        this.rainCount = options.rainCount || 2000;
        this.width = options.width || 1000;
        this.depth = options.depth || 1000;
        this.heightMin = options.heightMin || 100;
        this.heightMax = options.heightMax || 600;
        this.color = options.color || 0x66ccff;
        this.size = options.size || 2;
        this.opacity = options.opacity || 0.8;
    }

    createRain() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];

        for (let i = 0; i < this.rainCount; i++) {
            const x = (Math.random() - 0.5) * this.width * 3;
            const y = Math.random() * (this.heightMax - this.heightMin) + this.heightMin;
            const z = (Math.random() - 0.5) * this.depth * 3;
            positions.push(x, y, z);
        }

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        );

        const material = new THREE.PointsMaterial({
            color: this.color,
            size: this.size,
            transparent: true,
            opacity: this.opacity,
            depthWrite: false
        });

        this.rainGroup = new THREE.Points(geometry, material);
        this.scene.add(this.rainGroup);
    }

    // Cho phép bật/tắt mưa
    setVisible(visible) {
        if (this.rainGroup) this.rainGroup.visible = visible;
    }

    // Cập nhật vị trí mưa nếu muốn tạo hiệu ứng rơi
    update(delta, speed = 1.0) {
        if (!this.rainGroup) return;
        const positions = this.rainGroup.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= speed * delta * 100;
            if (positions[i] < 0) positions[i] = this.heightMax;
        }
        this.rainGroup.geometry.attributes.position.needsUpdate = true;
    }
}
