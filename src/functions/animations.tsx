export function collapse(ref: React.MutableRefObject<HTMLElement>,
    { duration = "0.5s", timing = "ease-in", delay = "0s" }: transition = { duration: "0.5s", timing: "ease-in", delay: "0s" },
    auto = true,
    disabled = false
) {
    console.log("col")
    let sectionHeight = ref.current.scrollHeight;
    let elementTransition = ref.current.style.transition;
    if (auto) {
        ref.current.style.transition = '';
        ref.current.style.height = sectionHeight + 'px';
        ref.current.style.transition = elementTransition;
    }
    if (!disabled)
        applyTransition(ref, { property: "height", duration: duration, timing: timing, delay: delay });
    requestAnimationFrame(function () {
        ref.current.style.height = 0 + 'px';
        setTimeout(function () {
            ref.current.style.transition = elementTransition;
        }, parseFloat(duration) * 1000);
    });
}

export function expand(ref: React.MutableRefObject<HTMLElement>,
    { duration = "0.5s", timing = "ease-in", delay = "0s" }: transition = { duration: "0.5s", timing: "ease-in", delay: "0s" },
    auto = true,
    disabled = false
) {
    console.log("exp");
    let elementTransition = ref.current.style.transition;
    if (!disabled)
        applyTransition(ref, { property: "height", duration: duration, timing: timing, delay: delay });
    var sectionHeight = ref.current.scrollHeight;
    if (auto)
        ref.current.style.height = sectionHeight + 'px';
    else
        ref.current.style.height = "";
    setTimeout(function () {
        ref.current.style.transition = elementTransition;
    }, parseFloat(duration) * 1000);
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