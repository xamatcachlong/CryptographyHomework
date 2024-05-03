import * as math from 'mathjs';

export type Prime = bigint

export function power(a: bigint, b: bigint, mod: bigint): bigint {
    let res = 1n;
    a = a % mod;
    while (b > 0) {
        if (b & 1n) res = (res * a) % mod;
        a = (a * a) % mod;
        b = b >> 1n;
    }
    return res;
}

export function divModPrime(a: bigint, b: bigint, mod: Prime): bigint {
    return (a * power(b, mod - 2n, mod)) % mod;
}

export async function isPrimeMillerRabin(n: bigint): Promise<boolean> {
    const A: bigint[] = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 97n, 101n]
    let d: bigint = n - 1n
    let s: bigint = 0n
    while ((d & 1n) === 0n){
        s += 1n
        d >>= 1n
    }
    for (const a of A){
        let p = await power(a % n, d, n)
        let i = s
        while (p !== 1n && p !== n - 1n && a % n && i > 0){
            i -= 1n
            p = (p * p) % n
        }
        if (p !== n - 1n && i !== s){
            return false
        }
    }
    return true
}

export async function extendedEuclidean(a: bigint, b: bigint, s: bigint = 1n, t: bigint = 0n, u: bigint = 0n, v: bigint = 1n): Promise<bigint[]> {
    if (b === 0n){
        return [a, s, t]
    }
    let q = a / b
    return await extendedEuclidean(b, a - q * b, u, v, s - q * u, t - q * v)
}


export async function legendreSymbol(n: bigint, p: Prime): Promise <0 | 1 | -1> {
    const ls = await power(n, (p - 1n) / 2n, p);
    if (ls === 0n) return 0;
    return ls === 1n ? 1 : -1;
}