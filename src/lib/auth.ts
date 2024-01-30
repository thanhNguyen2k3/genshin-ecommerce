import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';
import instance from './axios';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: 'Credentials',
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                if (!credentials?.email || !credentials.password) {
                    throw new Error('Invalid email or password');
                }

                const user = await db.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user.password) {
                    throw new Error('Invalid email or password');
                }

                const isCorrectPassword = await bcrypt.compare(credentials?.password, user?.password!);

                if (!isCorrectPassword) {
                    throw new Error('Invalid email or password');
                }

                if (!user.inActive) {
                    throw new Error('User not found');
                }

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),
        GoogleProvider({
            // clientId: process.env.GOOGLE_ID as string,
            // clientSecret: process.env.GOOGLE_SECRET as string,
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.username = token.username;
                session.user.isAdmin = token.isAdmin;
                session.user.inActive = token.inActive;
                session.user.fullName = token.fullName;
                session.user.detailAddress = token.detailAddress;
                session.user.phoneNumber = token.phoneNumber;
            }

            return session;
        },

        async jwt({ token, user }) {
            const dbUser = await db.user.findFirst({
                where: {
                    email: token.email,
                },
            });

            if (!dbUser) {
                token.id = user!.id;
                return token;
            }

            if (!dbUser.username) {
                await db.user.update({
                    where: {
                        id: dbUser.id,
                    },
                    data: {
                        username: nanoid(10),
                        inActive: true,
                    },
                });
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
                username: dbUser.username,
                isAdmin: dbUser.isAdmin,
                inActive: dbUser.inActive,
                fullName: dbUser.fullName,
                detailAddress: dbUser.detailAddress,
                phoneNumber: dbUser.phoneNumber,
            };
        },
        redirect() {
            return `${process.env.NEXT_URL}`;
        },
    },
};

export const getAuthSession = () => getServerSession(authOptions);
