import { ReactNode } from 'react';

type Props = {
    title: ReactNode;
};

const Heading = ({ title }: Props) => {
    return (
        <div className="text-center">
            <header className="py-2 relative uppercase inline-block text-center text-base text-content font-semibold">
                {title}

                <span className="absolute bottom-2 left-0 right-0 border-b-2 rounded border-primary"></span>
            </header>
        </div>
    );
};

export default Heading;
