import * as readline from 'readline';
import * as math from 'mathjs';
import EllipticCurve, { Point, PublicKey } from './EllipticCurve';
import { ElGamal } from './EllipticCurve';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function prob1(){
    console.log("Bai 1:\n");
    const E = new EllipticCurve(1n, 6n, 127n);
    const G = await E.findFirstPoint();
    const privateKey = 5n;
    const Session = new ElGamal(E, G, privateKey);

    rl.question('Enter the message (Should be an integer): ', async (message) => {
        rl.question('Enter the value of k (Should be an integer): ', async (k) => {
            const publicKey: PublicKey = {
                G: G,
                H: Session.H
            }
            const cipher = await Session.encrypt(BigInt(k), BigInt(message), publicKey);
            console.log(cipher);
            const decrypted = await Session.decrypt(...cipher);
            console.log(decrypted);
            console.log(decrypted === BigInt(message));
            rl.close();
        });
    });
}

async function prob3(){
    console.log("Bai 3:\n");
    const E = new EllipticCurve(1n, 4n, 1000037n);
    const G = await E.findFirstPoint();
    const privateKey = 5n;
    const Session = new ElGamal(E, G, privateKey);

    rl.question('Enter the message (Should be an integer): ', async (message) => {
        rl.question('Enter the value of k (Should be an integer): ', async (k) => {
            const publicKey: PublicKey = {
                G: G,
                H: Session.H
            }
            const cipher = await Session.encrypt(BigInt(k), BigInt(message), publicKey);
            console.log(cipher);
            const decrypted = await Session.decrypt(...cipher);
            console.log(decrypted);
            console.log(decrypted === BigInt(message));
            rl.close();
        });
    });
}


async function prob2(){
    console.log("Bai 2:\n");
    const E = new EllipticCurve(99n, 57n, 827n);
    const G = await E.findFirstPoint();
    const privateKey = 5n;
    const Session = new ElGamal(E, G, privateKey);

    const points = (await G.findPoints());
    console.log("Number of points: ", points.length);
    console.log("Points: ", points[1].toString());

    rl.question('Enter the message (Should be an integer): ', async (message) => {
        rl.question('Enter the value of k (Should be an integer): ', async (k) => {
            const publicKey: PublicKey = {
                G: G,
                H: Session.H
            }
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