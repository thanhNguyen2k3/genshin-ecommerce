import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    className?: string;
};

const Wrapper = ({ children, className }: Props) => {
    return (
        <div
            className={`w-layout mx-auto max-w-full mt-0 mb-0 lg:mt-10 lg:mb-10 px-2 lg:px-0 relative z-50 ${className}`}
        >
            {children}
        </div>
    );
};

export default Wrapper;
