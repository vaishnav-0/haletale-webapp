import React from "react";
import { ProgressStateEnum } from "./components/FormProgressIndicator";
import { expand, collapse } from "../../functions/animations";
import useListState from "../../functions/hooks/useListState";
import FormProgressIndicator from "./components/FormProgressIndicator";

type PropsType = {
    forms: { description: string, component: (props: { onComplete: () => void, onLoading: (b?:boolean) => void }) => JSX.Element }[],
    parallel?: boolean
    onFinish?:()=>void
}
export default function ProgressiveForm({ forms, parallel = false, onFinish=()=>{}}: PropsType): JSX.Element {
    const { list: progressList, replace: progressListUpdate } = useListState(Array.from({ length: forms.length }, () => 0));
    const formContainerRefs = React.useRef<(HTMLElement | null)[]>([]);
    const getOnLoading = React.useCallback((n: number) => {
        return (b:boolean=true) => progressListUpdate(b?ProgressStateEnum.Processing:ProgressStateEnum.OnProgress, n);
    }, []);
    const getOnClick = React.useCallback((n: number) => {
        return () => {
            if (parallel || progressList[n] === ProgressStateEnum.Done) {
                if (formContainerRefs?.current?.[n]) {
                    if (!formContainerRefs.current[n]?.clientHeight)
                        expand(formContainerRefs.current[n]!);
                    else
                        collapse(formContainerRefs.current[n]!);

                }
            }
        }
    }, [progressList]);
    const getOnComplete = React.useCallback((n: number) => {
        return () => {
            const formContainerRefs_ = formContainerRefs;
            if (formContainerRefs_.current[n]) {
                collapse(formContainerRefs_.current[n]!);
            }
            progressListUpdate(ProgressStateEnum.Done, n);
            if (formContainerRefs_.current[n + 1]) {
                expand(formContainerRefs_.current[n + 1]!);
                progressListUpdate(ProgressStateEnum.OnProgress, n + 1);
            }
        }
    }, []);
    React.useEffect(()=>{
       if(!progressList.some(e=>e !== ProgressStateEnum.Done))
            onFinish();
    },[progressList])
    React.useEffect(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                if (formContainerRefs.current[0])
                    expand(formContainerRefs.current[0]);
            }, 0);

        });
        progressListUpdate(ProgressStateEnum.OnProgress, 0)
    }, []);

    return (
        <>
            {
                forms.map((e, i) => <>
                    <FormProgressIndicator state={progressList[i]}
                        indicator={(i + 1).toString()}
                        description={e.description}
                        onClick={getOnClick(i)}
                    />
                    <div ref={(n) => formContainerRefs.current[i] = n} style={{ height: 0, overflow: "hidden" }}>
                        <e.component onComplete={getOnComplete(i)} onLoading={getOnLoading(i)} />
                    </div>
                </>
                )
            }
        </>
    );

}
