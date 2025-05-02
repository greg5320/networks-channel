
class Hamming {
    static coding(data) {
        if (data.length !== 4) throw new Error('Hamming.coding: data length must be 4');
        const d = data.split('').map(b => parseInt(b, 10));
        const c = [];
        c[1] = 0; c[2] = 0; c[3] = d[0];
        c[4] = 0; c[5] = d[1]; c[6] = d[2]; c[7] = d[3]; // p1 p2 d1 p3 d2 d3 d4
        c[1] = c[3] ^ c[5] ^ c[7]; //1 3 5 7 вносим биты 
        c[2] = c[3] ^ c[6] ^ c[7]; //2 3 6 7
        c[4] = c[5] ^ c[6] ^ c[7]; //4 5 6 7
        return [1,2,3,4,5,6,7].map(i => c[i].toString()).join('');
    }

    static decoding(code) {
        if (code.length !== 7) throw new Error('Hamming.decoding: code length must be 7');
        const c = [0].concat(code.split('').map(b => parseInt(b, 10)));
        const s1 = c[1] ^ c[3] ^ c[5] ^ c[7];
        const s2 = c[2] ^ c[3] ^ c[6] ^ c[7];
        const s3 = c[4] ^ c[5] ^ c[6] ^ c[7];
        const syndrome = s1 * 1 + s2 * 2 + s3 * 4;
        if (syndrome !== 0 && syndrome <= 7) {
            c[syndrome] ^= 1;
        }
        const dataBits = [c[3], c[5], c[6], c[7]];
        return dataBits.map(b => b.toString()).join('');
    }
}

module.exports = { Hamming };
