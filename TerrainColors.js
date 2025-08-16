// File: TerrainColors.js

class TerrainColors {
    constructor(terrainGeom, params) {
        this.terrainGeom = terrainGeom;
        this.params = params;
    }

    updateColors() {
        const colors = [];
        const position = this.terrainGeom.attributes.position;
        const snowHeight = 250; // cao độ xuất hiện tuyết

        for (let i = 0; i < position.count; i++) {
            const y = position.getY(i);
            let color;
            if (y < this.params.waterHeight) {
                color = new THREE.Color(0x0011ff);
            } else if (y > snowHeight) {
                color = new THREE.Color(0xffffff); // tuyết trên đỉnh
            } else {
                color = new THREE.Color(0x00ff40);
            }
            colors.push(color.r, color.g, color.b);
        }

        this.terrainGeom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }
}
