import NextAuth, { NextAuthOptions } from 'next-auth';

import GoogleProvider from 'next-auth/providers/google';
import async from '../users/index.api';
import { signIn } from 'next-auth/react';

if (!process.env.GOOGLE_CLIENT_ID) throw new Error('Missing GOOGLE_CLIENT_ID env var');
if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error('Missing GOOGLE_CLIENT_SECRET env var');

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile  https://www.googleapis.com/auth/calendar'
                }
            }
        })
    ],

    callbacks: {
        async signIn({ account }) {
            if (!account?.scope?.includes('https://www.googleapis.com/auth/calendar')) {
                return '/register/connect-calendar/?error=permissions';
            }

            return true;
        }
    }
};

export default NextAuth(authOptions);
