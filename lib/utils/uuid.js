var _rnds = new Array(16), _rng = function () {
    for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0)
            r = Math.random() * 0x100000000;
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }
    return _rnds;
};
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
}
function unparse(buf) {
    var i = 0, bth = _byteToHex;
    return bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]];
}
export function v4() {
    var rnds = _rng();
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    return unparse(rnds);
}
//# sourceMappingURL=uuid.js.map