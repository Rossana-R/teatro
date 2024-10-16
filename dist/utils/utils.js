"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeTwoLength = exports.GererateCode = void 0;
const GererateCode = () => {
    let numeros = ``;
    for (let i = 0; i < 6; i++) {
        numeros += Math.floor(Math.random() * 100); // Genera números aleatorios entre 0 y 99
    }
    return numeros;
};
exports.GererateCode = GererateCode;
const ChangeTwoLength = (t) => {
    return t.length == 1 ? `0${t}` : t;
};
exports.ChangeTwoLength = ChangeTwoLength;
