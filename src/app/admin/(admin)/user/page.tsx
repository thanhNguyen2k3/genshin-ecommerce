import UserData from '@/components/client/admin/UserData';
import { db } from '@/lib/db';

type DynamicParams = {
    searchParams: { [key: string]: string | string[] | undefined };
};

const Page = async ({ searchParams }: DynamicParams) => {
    const search = searchParams['q'] ?? '';

    const users = await db.user.findMany({
        where: {
            OR:
                search.length > 0
                    ? [
                          {
                              name: {
                                  contains: search?.toString()?.toLowerCase() || undefined,
                                  mode: 'insensitive',
                              },
                          },
                          {
                              email: {
                                  contains: search?.toString()?.toLowerCase() || undefined,
                                  mode: 'insensitive',
                              },
                          },
                          {
                              fullName: {
                                  contains: search?.toString()?.toLowerCase() || undefined,
                                  mode: 'insensitive',
                              },
                          },
                          {
                              phoneNumber: {
                                  contains: search?.toString()?.toLowerCase() || undefined,
                                  mode: 'insensitive',
                              },
                          },
                      ]
                    : undefined,
        },
        include: {
            sessions: true,
        },
    });

    return <UserData users={users} />;
};

export default Page;
