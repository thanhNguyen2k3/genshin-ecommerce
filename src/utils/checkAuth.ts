import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const checkAuth = () => {
    const router = useRouter();

    const { data, status } = useSession();

    useEffect(() => {
        if (data?.user.isAdmin) {
            router.replace('/admin/dashboard');
        } else {
            return;
        }
    }, [router, data, status]);

    return {
        data,
        status,
    };
};
