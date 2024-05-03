import { Prime, divModPrime, legendreSymbol, power } from "./common";
import * as math from 'mathjs';
import { SHA256 } from "crypto-js";

export default class EllipticCurve{
    public readonly a: bigint;
    public readonly b: bigint;
    public readonly p: Prime;

    constructor (a: bigint, b: bigint, p: Prime){
        this.a = a;
        this.b = b;
        this.p = p;
        if (!this.isValid()){
            throw new Error("The curve is singular or invalid");
        }
    }

    public async isValid(): Promise<boolean>{
        return (4n * this.a ** 3n + 27n * this.b ** 2n) % this.p !== 0n;
    }

    public async getFirstPoint(): Promise<Point>{
        let y: bigint[];
        let x: bigint = 0n;
        do {
            x += 1n;
            y = await this.findSquareRootQuadraticResidue(x ** 3n + this.a * x + this.b, this.p);
        } while (y.length === 0);
        return new Point(x, y[0], this);
    }

    public async findSquareRootQuadraticResidue(n: bigint, p: Prime): Promise<bigint[]>{
        n = n % p;
        const ls = await legendreSymbol(n, p);
        if (ls === -1){
            return [];
        }
        if (ls === 0){
            return [0n];
        }
        
        let q = p;
        let r = 1n;
        let s = 2n;
        while (((q + r) / s) % 2n !== 0n){
            r += s;
            s <<= 1n;
        }
        // y ^ 2 = x ^ ((q + r) / s) mod p
        // y = +- x ^ ((q + r) / 2s)  mod p
        const y1 = power(n, (q + r) / (2n * s), p);
        const y2 = p - y1;
        return [y1, y2];
    }

    public async findFirstPoint(): Promise<Point>{
        let x: bigint = 0n;
        for (let i = 0; i < this.p; i++){
            x += 1n;
            let y = await this.findSquareRootQuadraticResidue(x ** 3n + this.a * x + this.b, this.p);
            if (y.length > 0){
                return new Point(x, y[0], this);
            }
        }
        return new Point(BigInt(0), BigInt(0), this);
    }

    public async findPoints(): Promise<Point[]>{
        let points: Point[] = [];
        points.push(new Point(BigInt(0), BigInt(0), this));
        points.push(await this.getFirstPoint());
        for (let i = 2; ; i++){
            const point = await points[i - 1].add(points[1]);
            if (point.is0()){
                break;
            }
            points.push(point);
        }
        return points;
    }
}

export class Point extends EllipticCurve{
    public x: bigint;
    public y: bigint;

    constructor (x: bigint, y: bigint, curve: EllipticCurve){
        super(curve.a, curve.b, curve.p);
        this.x = x;
        this.y = y;
    }

    public equals(other: Point): boolean{
        return this.x === other.x && this.y === other.y;
    }

    public is0(): boolean{
        return this.x === BigInt(0) && this.y === BigInt(0);
    }

    public add(other: Point): Point{
        if (this.is0()){
            return other;
        }
        if (other.is0()){
            return this;
        }
        if (this.x === other.x && this.y === this.p - other.y){
            return new Point(BigInt(0), BigInt(0), this);
        }
        let lambda: bigint;
        if (this.equals(other)){
            lambda = divModPrime(3n * this.x ** 2n + this.a, 2n * this.y, this.p);
        } 
        else {
            lambda = divModPrime(other.y - this.y, other.x - this.x, this.p);
        }
        let x = (lambda ** 2n - this.x - other.x) % this.p;
        let y = (lambda * (this.x - x) - this.y) % this.p;
        
        if (x < 0) x += this.p;
        if (y < 0) y += this.p;
        

        return new Point(x, y, this);
    }

    public static add(a: Point, b: Point): Point{
        return a.add(b);
    }

    public static mul(a: Point, n: bigint): Point{
        return a.mul(n);
    }


    public mul(n: bigint): Point{
        let res = new Point(BigInt(0), BigInt(0), this);
        let tem = new Point(this.x, this.y, this);
        while (n > 0){
            if (n % 2n === 1n) res = res.add(tem);
            tem = tem.add(tem);
            n >>= 1n;
        }
        return res;
    }

    public toString(): string{
        return `(${this.x}, ${this.y})`;
    }
}

export class ElGamal extends EllipticCurve{
    public readonly G: Point;
    public readonly H: Point;
    public readonly privateKey: bigint;

    constructor (E: EllipticCurve, G: Point, privateKey: bigint){
        super(E.a, E.b, E.p);
        this.G = G;
        this.privateKey = privateKey;
        this.H = G.mul(privateKey);
    }

    public async encrypt(k: bigint, M: bigint, Key: PublicKey): Promise<[Point, bigint]>{
        const C1 = Key.G.mul(k);
        const S: bigint = BigInt(parseInt(SHA256(Key.H.mul(k).toString()).toString(), 16));
        const C2 = (S + M) % Key.G.p;
        return [C1, C2];
    }

    public async decrypt(C1: Point, C2: bigint): Promise<bigint>{
        const S: bigint = BigInt(parseInt(SHA256(C1.mul(this.privateKey).toString()).toString(), 16));
        let res =  (C2 - S) % this.p;
        if (res < 0) res += this.p;
        return res;
    }
}

export interface PublicKey{
    G: Point;
    H: Point;
}