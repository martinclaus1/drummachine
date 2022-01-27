import * as React from 'react';

export function useStateIfMounted<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];
export function useStateIfMounted<T = undefined>(initialState?: T | (() => T)): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];

export function useStateIfMounted<T>(initialState: T | (() => T)): [any, any] {
    const isComponentMounted = useIsComponentMounted();
    const [state, setState] = React.useState<T>(initialState);

    const newSetState = (value: React.SetStateAction<T>) => {
        if (isComponentMounted.current) {
            setState(value);
        }
    };

    return [state, newSetState];
}

const useIsComponentMounted = () => {
    const isMounted = React.useRef(false);
    React.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    return isMounted;
};