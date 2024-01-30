import { db } from '@/lib/db';

export const getUserCount = async () => {
    const user = await db.user.count({
        where: {
            NOT: {
                isAdmin: true,
            },
        },
    });

    return user;
};
