export function keyGen() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
        + Math.random().toString(16).slice(10)
        + Date.now().toString(16).slice(6);
}