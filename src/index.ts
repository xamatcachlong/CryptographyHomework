import * as math from 'mathjs';
import EllipticCurve, { Point, PublicKey } from './EllipticCurve';
import { ElGamal } from './EllipticCurve';

(async () => {
    const E = new EllipticCurve(1n, 6n, 11n);
    const G = await E.findFirstPoint();
    const privateKey = 5n;
    const Session = new ElGamal(E, G, privateKey);

    const message = 7n;
    const k = 3n;
    const publicKey: PublicKey = {
        G: G,
        H: Session.H
    }
    const cipher = await Session.encrypt(k, message, publicKey);
    console.log(cipher);
    const decrypted = await Session.decrypt(...cipher);
    console.log(decrypted);
    console.log(decrypted === message);

})();