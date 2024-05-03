"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EllipticCurve_1 = require("./EllipticCurve");
const EllipticCurve_2 = require("./EllipticCurve");
(async () => {
    const E = new EllipticCurve_1.default(1n, 6n, 11n);
    const G = await E.findFirstPoint();
    const privateKey = 5n;
    const Session = new EllipticCurve_2.ElGamal(E, G, privateKey);
    const message = 7n;
    const k = 3n;
    const publicKey = {
        G: G,
        H: Session.H
    };
    const cipher = await Session.encrypt(k, message, publicKey);
    console.log(cipher);
    const decrypted = await Session.decrypt(...cipher);
    console.log(decrypted);
    console.log(decrypted === message);
})();
