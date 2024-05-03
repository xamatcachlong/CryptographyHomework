"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const EllipticCurve_1 = require("./EllipticCurve");
const EllipticCurve_2 = require("./EllipticCurve");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function prob1() {
    console.log("Bai 1:\n");
    const E = new EllipticCurve_1.default(1n, 6n, 127n);
    const G = await E.findFirstPoint();
    const privateKey = 5n;
    const Session = new EllipticCurve_2.ElGamal(E, G, privateKey);
    rl.question('Enter the message (Should be an integer): ', async (message) => {
        rl.question('Enter the value of k (Should be an integer): ', async (k) => {
            const publicKey = {
                G: G,
                H: Session.H
            };
            const cipher = await Session.encrypt(BigInt(k), BigInt(message), publicKey);
            console.log(cipher);
            const decrypted = await Session.decrypt(...cipher);
            console.log(decrypted);
            console.log(decrypted === BigInt(message));
            rl.close();
        });
    });
}
async function prob3() {
    console.log("Bai 3:\n");
    for (let i = 1; i < 100; i++) {
        for (let j = 1; j < 100; j++) {
            const E = new EllipticCurve_1.default(BigInt(i), BigInt(j), 1000037n);
            const points = (await E.findPoints());
            console.log("a = ", i, "b = ", j, points.length);
            if (points.length === 1000651)
                break;
            // break;
        }
    }
    const E = new EllipticCurve_1.default(1n, 6n, 1000000007n);
    const G = await E.findFirstPoint();
    const privateKey = 5n;
    const Session = new EllipticCurve_2.ElGamal(E, G, privateKey);
    rl.question('Enter the message (Should be an integer): ', async (message) => {
        rl.question('Enter the value of k (Should be an integer): ', async (k) => {
            const publicKey = {
                G: G,
                H: Session.H
            };
            const cipher = await Session.encrypt(BigInt(k), BigInt(message), publicKey);
            console.log(cipher);
            const decrypted = await Session.decrypt(...cipher);
            console.log(decrypted);
            console.log(decrypted === BigInt(message));
            rl.close();
        });
    });
}
async function prob2() {
    console.log("Bai 2:\n");
    const E = new EllipticCurve_1.default(99n, 57n, 827n);
    const G = await E.findFirstPoint();
    const privateKey = 5n;
    const Session = new EllipticCurve_2.ElGamal(E, G, privateKey);
    const points = (await G.findPoints());
    console.log("Number of points: ", points.length);
    console.log("Points: ", points[1].toString());
    rl.question('Enter the message (Should be an integer): ', async (message) => {
        rl.question('Enter the value of k (Should be an integer): ', async (k) => {
            const publicKey = {
                G: G,
                H: Session.H
            };
            const cipher = await Session.encrypt(BigInt(k), BigInt(message), publicKey);
            console.log(cipher);
            const decrypted = await Session.decrypt(...cipher);
            console.log(decrypted);
            console.log(decrypted === BigInt(message));
            rl.close();
        });
    });
}
(async () => {
    //await prob1();
    //await prob2();
    await prob3();
})();
