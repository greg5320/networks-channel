
class Hamming {
    _calcRedundantBits(m) {
        for (let i = 0; i < m; i++) {
            if (Math.pow(2, i) >= m + i + 1) {
                return i;
            }
        }
        return 0;
    }

    _posRedundantBits(data, r) {
        let j = 0, k = 1;
        let m = data.length;
        let res = '';

        for (let i = 1; i <= m + r; i++) {
            if (i === Math.pow(2, j)) {
                res = res + '0';
                j++;
            } else {
                res = res + data[data.length - k];
                k++;
            }
        }
        return res.split('').reverse().join('');
    }

    _calcParityBits(arr, r) {
        let n = arr.length;
        for (let i = 0; i < r; i++) {
            let val = 0;
            for (let j = 1; j <= n; j++) {
                if ((j & Math.pow(2, i)) === Math.pow(2, i)) {
                    val ^= parseInt(arr[arr.length - j], 10);
                }
            }
            let pos = n - Math.pow(2, i);
            arr = arr.slice(0, pos) + val + arr.slice(pos + 1);
        }
        return arr.split("").reverse().join("");
    }

    static coding(data) {
        let r = this.prototype._calcRedundantBits(data.length);
        let withPos = this.prototype._posRedundantBits(data, r);
        return this.prototype._calcParityBits(withPos, r);
    }

    _detectError(arr) {
        let nr = 0;
        for (let i = 1; i < arr.length; i++) {
            if (Math.pow(2, i) >= arr.length) { nr = i; break; }
        }
        let n = arr.length;
        let res = 0;
        for (let i = 0; i < nr; i++) {
            let val = 0;
            for (let j = 1; j <= n; j++) {
                if ((j & Math.pow(2, i)) === Math.pow(2, i)) {
                    val ^= parseInt(arr[arr.length - j], 10);
                }
            }
            res += val * Math.pow(10, i);
        }
        return arr.length - parseInt(res.toString(), 2) + 1;
    }

    _replaceAt(str, index, replacement) {
        if (index > str.length - 1) return str;
        return str.substring(0, index) + replacement + str.substring(index + 1);
    }

    _fixError(data) {
        let nError = this._detectError(data);
        if (nError === 0) return data;
        let idx = nError - 1;
        let bit = data[idx] === '1' ? '0' : '1';
        return this._replaceAt(data, idx, bit);
    }

    _decodingHam(data) {
        data = this._fixError(data);
        let nr = 0;
        for (let i = 1; i < data.length; i++) {
            if (Math.pow(2, i) >= data.length) { nr = i; break; }
        }
        for (let i = nr - 1; i >= 0; i--) {
            let pos = Math.pow(2, i);
            data = data.slice(0, pos - 1) + data.slice(pos);
        }
        return data.split("").reverse().join("");
    }

    static checkError(data) { return this.prototype._detectError(data); }
    static fixedError(data) { return this.prototype._fixError(data); }
    static decoding(data) { return this.prototype._decodingHam(data); }
}

module.exports = { Hamming };
