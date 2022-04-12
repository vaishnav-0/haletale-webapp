export function keyGen() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
        + Math.random().toString(16).slice(10)
        + Date.now().toString(16).slice(6);
}

export function objectMap(obj: object, func: (key: string | number, value: any) => [string | number, any], nest: boolean | undefined = false, level: number | undefined = 0): object {
    const ret: {
        [i: string | number]: any
    } = {};
    for (const [k, v] of Object.entries(obj)) {
        if (nest && typeof v === 'object') {
            let obj_: any;
            if (typeof level !== 'number')
                throw new Error("Level should be a number")
            if (level < 0)
                throw new Error("Level should be greater than or equal to 0")
            if (level === 0) {
                obj_ = objectMap(v, func);
            }
            else
                obj_ = objectMap(v, func, true, --level);
            ret[k] = obj_;
        }
        else {
            const [k_, v_] = func(k, v);
            ret[k_] = v_;
        }
    }
    return ret;
}

export function objectFilter(obj: object, func: (key: string | number, value: any) => boolean, nest: boolean | undefined = false, level: number | undefined = 0) {
    const ret: {
        [i: string | number]: any
    } = {};
    for (const [k, v] of Object.entries(obj)) {
        if (nest && typeof v === 'object') {
            let obj_: any;
            if (typeof level !== 'number')
                throw new Error("Level should be a number")
            if (level < 0)
                throw new Error("Level should be greater than or equal to 0")
            if (level === 0) {
                obj_ = objectFilter(v, func);
            }
            else
                obj_ = objectFilter(v, func, true, --level);
            ret[k] = obj_;
        }
        else {
            if (func(k, v))
                ret[k] = v;
        }
    }
    return ret;
}

export function objectReduce(obj: object, func: (acc: any, curr: [k: string | number, v: any], obj?: object) => any, init?: any) {
    let ret: any = init;
    for (const [k, v] of Object.entries(obj)) {
        ret = func(ret, [k, v], obj);
    }
    return ret;
}

export function objectStringifiedAccessor(obj: any, s: string, value?: any) {
    const parts = s.split('.');
    let ret = obj;
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] in ret)
            if (ret[parts[i]] === Object(ret[parts[i]])) {
                if (value && i === parts.length - 1)
                    ret[parts[i]] = value;
                ret = ret[parts[i]];
            }
            else
                throw new Error("Object value not accessible");
        else {
            if (value)
                if (i === parts.length - 1)
                    ret[parts[i]] = value;
                else {
                    ret[parts[i]] = {};
                    ret = ret[parts[i]];
                }
            else
                return undefined;
        }
    }
    return obj;
}