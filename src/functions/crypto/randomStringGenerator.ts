/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
//modified accordingly
import crypto from 'crypto';

const urlSafeCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'.split('');
const numericCharacters = '0123456789'.split('');
const distinguishableCharacters = 'CDEHKMPRTUWXY012458'.split('');
const asciiPrintableCharacters = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split('');
const alphanumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

const generateForCustomCharacters = (length: number, characters: string[]) => {
    // Generating entropy is faster than complex math operations, so we use the simplest way
    const characterCount = characters.length;
    const maxValidSelector = (Math.floor(0x10000 / characterCount) * characterCount) - 1; // Using values above this will ruin distribution when using modular division
    const entropyLength = 2 * Math.ceil(1.1 * length); // Generating a bit more than required so chances we need more than one pass will be really low
    let string = '';
    let stringLength = 0;

    while (stringLength < length) { // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
        const entropy = crypto.randomBytes(entropyLength);
        let entropyPosition = 0;

        while (entropyPosition < entropyLength && stringLength < length) {
            const entropyValue = entropy.readUInt16LE(entropyPosition);
            entropyPosition += 2;
            if (entropyValue > maxValidSelector) { // Skip values which will ruin distribution when using modular division
                continue;
            }

            string += characters[entropyValue % characterCount];
            stringLength++;
        }
    }

    return string;
};


const generateRandomBytes = (byteLength: number, type: "hex" | "base64", length: number) => crypto.randomBytes(byteLength).toString(type).slice(0, length);


const allowedTypes = [
    undefined,
    'hex',
    'base64',
    'url-safe',
    'numeric',
    'distinguishable',
    'ascii-printable',
    'alphanumeric'
] as const;
type TallowedTypes = (typeof allowedTypes)[number];
const createGenerator = (generateForCustomCharactersFn: typeof generateForCustomCharacters, generateRandomBytesFn: typeof generateRandomBytes) => ({ length, type, characters }:
    { length: number, type: TallowedTypes, characters?: string }) => {
    if (!(length >= 0 && Number.isFinite(length))) {
        throw new TypeError('Expected a `length` to be a non-negative finite number');
    }

    if (type !== undefined && characters !== undefined) {
        throw new TypeError('Expected either `type` or `characters`');
    }

    if (characters !== undefined && typeof characters !== 'string') {
        throw new TypeError('Expected `characters` to be string');
    }

    if (!allowedTypes.includes(type)) {
        throw new TypeError(`Unknown type: ${type}`);
    }

    if (type === undefined && characters === undefined) {
        type = 'hex';
    }

    if (type === 'hex' || (type === undefined && characters === undefined)) {
        return generateRandomBytesFn(Math.ceil(length * 0.5), 'hex', length); // Need 0.5 byte entropy per character
    }

    if (type === 'base64') {
        return generateRandomBytesFn(Math.ceil(length * 0.75), 'base64', length); // Need 0.75 byte of entropy per character
    }

    if (type === 'url-safe') {
        return generateForCustomCharactersFn(length, urlSafeCharacters);
    }

    if (type === 'numeric') {
        return generateForCustomCharactersFn(length, numericCharacters);
    }

    if (type === 'distinguishable') {
        return generateForCustomCharactersFn(length, distinguishableCharacters);
    }

    if (type === 'ascii-printable') {
        return generateForCustomCharactersFn(length, asciiPrintableCharacters);
    }

    if (type === 'alphanumeric') {
        return generateForCustomCharactersFn(length, alphanumericCharacters);
    }

    if (characters!.length === 0) {
        throw new TypeError('Expected `characters` string length to be greater than or equal to 1');
    }

    if (characters!.length > 0x10000) {
        throw new TypeError('Expected `characters` string length to be less or equal to 65536');
    }

    return generateForCustomCharactersFn(length, characters!.split(''));
};

const cryptoRandomString = createGenerator(generateForCustomCharacters, generateRandomBytes);

export default cryptoRandomString;



