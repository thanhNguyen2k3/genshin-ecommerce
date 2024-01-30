import SelectedTabs from '@/components/component/SelectedTabs';
import BreadCumb from '@/components/ui/BreadCumb';
import { db } from '@/lib/db';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

const Layout = async ({ children }: Props) => {
    const visions = await db.vision.findMany();

    return (
        <div className="bg-[#222222] pb-20">
            <BreadCumb />
            <SelectedTabs visions={visions} />
            {children}
        </div>
    );
};

export default Layout;
