export function collapse(node: HTMLElement,
    { duration = "0.5s", timing = "ease-in", delay = "0s" }: transition = { duration: "0.5s", timing: "ease-in", delay: "0s" },
    auto = true,
    disabled = false
) {
    if (node) {
        let elementTransition = node.style.transition;
        let sectionHeight = node.scrollHeight;
        if (auto) {
            node.style.transition = '';
            node.style.height = sectionHeight + 'px';
            node.style.transition = elementTransition;
        }
        applyValues(node,
            [{ property: "height", duration: duration, timing: timing, delay: delay }],
            { height: "0px" }, parseFloat(duration), disabled);
    }
}

export function expand(node: HTMLElement,
    { duration = "0.5s", timing = "ease-in", delay = "0s" }: transition = { duration: "0.5s", timing: "ease-in", delay: "0s" },
    auto = true,
    disabled = false
) {
    const sectionHeight = node.scrollHeight;
    const maxDuration = parseFloat(duration);
    applyValues(node,
        [{ property: "height", duration: duration, timing: timing, delay: delay }],
        { height: auto ? sectionHeight + 'px' : "" }, maxDuration, disabled);
    setTimeout(function () {
        node.style.height = "";
    }, +!disabled * maxDuration * 1000);
}
export function zoomIn(node: HTMLElement,
    { duration = "0.5s", timing = "ease-in", delay = "0s" }: transition = { duration: "0.5s", timing: "ease-in", delay: "0s" },
    disabled = false
) {
    const maxDuration = parseFloat(duration);
    applyValues(node,
        [
            { property: "transform", duration: duration, timing: timing, delay: delay },
            { property: "opacity", duration: duration, timing: timing, delay: delay }
        ],
        { transform: "scale(1)", opacity: 1 }, maxDuration, disabled);
    setTimeout(function () {
        node.style.transform = "";
        node.style.opacity = "";
    }, +!disabled * maxDuration * 1200);
}
export function zoomOut(node: HTMLElement,
    { duration = "0.5s", timing = "ease-in", delay = "0s" }: transition = { duration: "0.5s", timing: "ease-in", delay: "0s" },
    disabled = false
) {
    applyValues(node,
        [
            { property: "transform", duration: duration, timing: timing, delay: delay },
            { property: "opacity", duration: duration, timing: timing, delay: delay }
        ],
        { transform: "scale(0)", opacity: 0 }, parseFloat(duration), disabled);
}

interface transition {
    property?: string,
    duration?: string,
    timing?: string,
    delay?: string
}
function applyTransition(node: HTMLElement,
    { property, duration = "0.5s", timing = "ease-in", delay = "0s" }: transition
) {
    if (node) {
        let transition = `${property} ${duration} ${timing} ${delay}`;
        node.style.transition += (node.style.transition === "" ? "" : ",") + transition;
    }
}
function applyTransitions(node: HTMLElement,
    transitions: transition[]
) {
    transitions.forEach(e => {
        applyTransition(node, e);
    });
}
function applyValues(node: HTMLElement
    , transitions: transition[], values: object, maxDuration: number, disabled: boolean) {
    if (node) {
        let elementTransition = node.style.transition;
        applyTransitions(node, transitions);
        requestAnimationFrame(function () {
            Object.entries(values).forEach(([k, v]) => {
                (node.style as any)[k] = v;
            });
            setTimeout(function () {
                node.style.transition = elementTransition;
            }, +!disabled * maxDuration * 1000);
        });
    }
}