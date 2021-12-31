type dragHandler = (this: HTMLElement, ev: DragEvent) => any;
export class Drag {
    el: HTMLElement;
    state: boolean;
    enterHandler = this.getHandler("enter");
    leaveHandler = this.getHandler("leave");
    constructor(el: HTMLElement) {
        this.el = el;
        this.state = false;
        this.el.addEventListener("dragenter", this.enterHandler, false);
        this.el.addEventListener("dragleave", this.leaveHandler, false);
        this.el.addEventListener("drop", this.leaveHandler, false);
    }
    getHandler(type: "enter" | "leave"): dragHandler {
        const _this = this;
        return (function (this: HTMLElement, event: DragEvent) {
            _this.state = !_this.state;
            if (type === "enter" ? _this.state : !_this.state) {
                const ev = new CustomEvent(`drag:${type}`, event);
                _this.el.dispatchEvent(ev);
            }
        })
    }
    unsuscribe() {
        this.el.removeEventListener("dragenter", this.enterHandler, false);
        this.el.removeEventListener("dragleave", this.leaveHandler, false);
        this.el.removeEventListener("drop", this.leaveHandler, false);
    };
}