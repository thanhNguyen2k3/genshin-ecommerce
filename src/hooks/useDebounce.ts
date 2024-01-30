import { useEffect, useState } from 'react';

export const useDebounce = (value: string, delay: number) => {
    const [debounceValue, setDebounceValue] = useState<string>();

    useEffect(() => {
        const handler = setTimeout(() => {
            return setDebounceValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value]);

    return debounceValue;
};
