"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElGamal = exports.Point = void 0;
const common_1 = require("./common");
const crypto_js_1 = require("crypto-js");
class EllipticCurve {
    constructor(a, b, p) {
        this.a = a;
        this.b = b;
        this.p = p;
        if (!this.isValid()) {
            throw new Error("The curve is singular or invalid");
        }
    }
    async isValid() {
        return (4n * this.a ** 3n + 27n * this.b ** 2n) % this.p !== 0n;
    }
    async getFirstPoint() {
        let y;
        let x = 0n;
        do {
            x += 1n;
            y = await this.findSquareRootQuadraticResidue(x ** 3n + this.a * x + this.b, this.p);
        } while (y.length === 0);
        return new Point(x, y[0], this);
    }
    async findSquareRootQuadraticResidue(n, p) {
        n = n % p;
        const ls = await (0, common_1.legendreSymbol)(n, p);
        if (ls === -1) {
            return [];
        }
        if (ls === 0) {
            return [0n];
        }
        let q = p;
        let r = 1n;
        let s = 2n;
        while (((q + r) / s) % 2n !== 0n) {
            r += s;
            s <<= 1n;
        }
        // y ^ 2 = x ^ ((q + r) / s) mod p
        // y = +- x ^ ((q + r) / 2s)  mod p
        const y1 = (0, common_1.power)(n, (q + r) / (2n * s), p);
        const y2 = p - y1;
        return [y1, y2];
    }
    async findFirstPoint() {
        let x = 0n;
        for (let i = 0; i < this.p; i++) {
            x += 1n;
            let y = await this.findSquareRootQuadraticResidue(x ** 3n + this.a * x + this.b, this.p);
            if (y.length > 0) {
                return new Point(x, y[0], this);
            }
        }
        return new Point(BigInt(0), BigInt(0), this);
    }
    async findPoints() {
        let points = [];
        points.push(new Point(BigInt(0), BigInt(0), this));
        points.push(await this.getFirstPoint());
        for (let i = 2;; i++) {
            const point = await points[i - 1].add(points[1]);
            if (point.is0()) {
                break;
            }
            points.push(point);
        }
        return points;
    }
}
exports.default = EllipticCurve;
class Point extends EllipticCurve {
    constructor(x, y, curve) {
        super(curve.a, curve.b, curve.p);
        this.x = x;
        this.y = y;
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    is0() {
        return this.x === BigInt(0) && this.y === BigInt(0);
    }
    add(other) {
        if (this.is0()) {
            return other;
        }
        if (other.is0()) {
            return this;
        }
        if (this.x === other.x && this.y === this.p - other.y) {
            return new Point(BigInt(0), BigInt(0), this);
        }
        let lambda;
        if (this.equals(other)) {
            lambda = (0, common_1.divModPrime)(3n * this.x ** 2n + this.a, 2n * this.y, this.p);
        }
        else {
            lambda = (0, common_1.divModPrime)(other.y - this.y, other.x - this.x, this.p);
        }
        let x = (lambda ** 2n - this.x - other.x) % this.p;
        let y = (lambda * (this.x - x) - this.y) % this.p;
        if (x < 0)
            x += this.p;
        if (y < 0)
            y += this.p;
        return new Point(x, y, this);
    }
    static add(a, b) {
        return a.add(b);
    }
    static mul(a, n) {
        return a.mul(n);
    }
    mul(n) {
        let res = new Point(BigInt(0), BigInt(0), this);
        let tem = new Point(this.x, this.y, this);
        while (n > 0) {
            if (n % 2n === 1n)
                res = res.add(tem);
            tem = tem.add(tem);
            n >>= 1n;
        }
        return res;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
exports.Point = Point;
class ElGamal extends EllipticCurve {
    constructor(E, G, privateKey) {
        super(E.a, E.b, E.p);
        this.G = G;
        this.privateKey = privateKey;
        this.H = G.mul(privateKey);
    }
    async encrypt(k, M, Key) {
        const C1 = Key.G.mul(k);
        const S = BigInt(parseInt((0, crypto_js_1.SHA256)(Key.H.mul(k).toString()).toString(), 16));
        const C2 = (S + M) % Key.G.p;
        return [C1, C2];
    }
    async decrypt(C1, C2) {
        const S = BigInt(parseInt((0, crypto_js_1.SHA256)(C1.mul(this.privateKey).toString()).toString(), 16));
        let res = (C2 - S) % this.p;
        if (res < 0)
            res += this.p;
        return res;
    }
}
exports.ElGamal = ElGamal;
