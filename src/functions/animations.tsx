export function collapse(ref: React.MutableRefObject<HTMLElement>,
    { duration = "0.5s", timing = "ease-in", delay = "0s" }: transition = { duration: "0.5s", timing: "ease-in", delay: "0s" },
    auto = true,
    disabled = false
) {
    let elementTransition = ref.current.style.transition;
    let sectionHeight = ref.current.scrollHeight;
    if (auto) {
        ref.current.style.transition = '';
        ref.current.style.height = sectionHeight + 'px';
        ref.current.style.transition = elementTransition;
    }
    applyValues(ref,
        [{ property: "height", duration: duration, timing: timing, delay: delay }],
        { height: "0px" }, parseFloat(duration), disabled);
}

export function expand(ref: React.MutableRefObject<HTMLElement>,
    { duration = "0.5s", timing = "ease-in", delay = "0s" }: transition = { duration: "0.5s", timing: "ease-in", delay: "0s" },
    auto = true,
    disabled = false
) {
    var sectionHeight = ref.current.scrollHeight;
    applyValues(ref,
        [{ property: "height", duration: duration, timing: timing, delay: delay }],
        { height: auto ? sectionHeight + 'px' : "" }, parseFloat(duration), disabled);
}

interface transition {
    property?: string,
    duration?: string,
    timing?: string,
    delay?: string
}
function applyTransition(ref: React.MutableRefObject<HTMLElement>,
    { property, duration = "0.5s", timing = "ease-in", delay = "0s" }: transition
) {
    let transition = `${property} ${duration} ${timing} ${delay}`;
    ref.current.style.transition = (ref.current.style.transition === "" ? "" : ",") + transition;
}
function applyTransitions(ref: React.MutableRefObject<HTMLElement>,
    transitions: transition[]
) {
    transitions.forEach(e => {
        applyTransition(ref, e);
    });
}
function applyValues(ref: React.MutableRefObject<HTMLElement>
    , transitions: transition[], values: object, maxDuration: number, disabled: boolean) {
    let elementTransition = ref.current.style.transition;
    applyTransitions(ref, transitions);
    requestAnimationFrame(function () {
        Object.entries(values).forEach(([k, v]) => {
            (ref.current.style as any)[k] = v;
        });
        setTimeout(function () {
            ref.current.style.transition = elementTransition;
        }, +!disabled * maxDuration * 1000);
    });
}