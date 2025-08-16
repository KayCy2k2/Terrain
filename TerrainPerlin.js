// TerrainPerlin.js
class TerrainPerlin {
    constructor(seed = 12345) {
        this.seed = seed;
        this.rand = this.xorshift32(seed);

        // permutation table
        this.p = new Uint8Array(512);
        const perm = new Uint8Array(256);
        for (let i = 0; i < 256; i++) perm[i] = i;

        // Fisher-Yates shuffle
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(this.rand() * (i + 1));
            const tmp = perm[i]; perm[i] = perm[j]; perm[j] = tmp;
        }
        for (let i = 0; i < 512; i++) this.p[i] = perm[i & 255];

        // gradients
        this.Gx = new Float32Array(512);
        this.Gy = new Float32Array(512);
        for (let i = 0; i < 512; i++) {
            const a = this.rand() * Math.PI * 2;
            this.Gx[i] = Math.cos(a);
            this.Gy[i] = Math.sin(a);
        }
    }

    xorshift32(seed) {
        let x = seed >>> 0;
        return function () {
            x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
            return ((x >>> 0) / 4294967296);
        };
    }

    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(a, b, t) { return a + (b - a) * t; }

    grad(ix, iy, x, y) {
        const idx = this.p[ix + this.p[iy]];
        return this.Gx[idx] * x + this.Gy[idx] * y;
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);

        const u = this.fade(xf);
        const v = this.fade(yf);

        const n00 = this.grad(X, Y, xf, yf);
        const n10 = this.grad(X + 1, Y, xf - 1, yf);
        const n01 = this.grad(X, Y + 1, xf, yf - 1);
        const n11 = this.grad(X + 1, Y + 1, xf - 1, yf - 1);

        const nx0 = this.lerp(n00, n10, u);
        const nx1 = this.lerp(n01, n11, u);
        return this.lerp(nx0, nx1, v);
    }

    // fBm: fractal Brownian motion
    fbm(x, y, octaves = 4, lacunarity = 2.0, gain = 0.5) {
        let amp = 0.5, freq = 1.0, sum = 0.0, norm = 0.0;
        for (let i = 0; i < octaves; i++) {
            sum += amp * this.noise(x * freq, y * freq);
            norm += amp;
            amp *= gain;
            freq *= lacunarity;
        }
        return sum / norm;
    }
}
