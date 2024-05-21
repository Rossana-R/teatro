
export const GererateCode = ():string => {
    let numeros = ``;
    for (let i = 0; i < 6; i++) {
        numeros += Math.floor(Math.random() * 100); // Genera números aleatorios entre 0 y 99
    }
    return numeros;
} 

export const ChangeTwoLength = (t: string): string => {
    return t.length == 1 ? `0${t}` : t;
}
