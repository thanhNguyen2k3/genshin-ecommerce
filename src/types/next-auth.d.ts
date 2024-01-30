import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

type UserId = string;

declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId;
        username?: string | null;
        fullName?: string | null;
        phoneNumber?: string | null;
        detailAddress?: string | null;
        isAdmin: boolean;
        inActive: boolean;
    }
}

declare module 'next-auth' {
    interface Session {
        user: User & {
            id: UserId;
            username?: string | null;
            isAdmin: boolean;
            inActive: boolean;
            fullName?: string | null;
            phoneNumber?: string | null;
            detailAddress?: string | null;
        };
    }
}
