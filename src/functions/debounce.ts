export default function debounce(callback: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
        //const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(null, args), wait);
    };
}