import * as React from 'react';

interface Options {
    setLoading?: (loading: boolean) => void;
    setError?: (err: any) => void;
    onComponentUnmount?: () => void;
}

const asyncWrapper = (
    effect: (...args: any[]) => Promise<void>,
    {setLoading, setError, onComponentUnmount}: Options
): React.EffectCallback => {
    return (...args: any[]) => {
        const onUnmount = () => {
            onComponentUnmount && onComponentUnmount();
        };
        setError && setError(undefined);
        setLoading && setLoading(true);

        effect(...args)
            .catch((err) => setError && setError(err))
            .finally(() => setLoading && setLoading(false));

        return onUnmount;
    };
};

export const useAsyncEffect = (effect: () => Promise<void>, deps?: React.DependencyList, options?: Options) =>
    React.useEffect(asyncWrapper(effect, options || {}), deps);
