import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';

import { PrismaAdapter } from '@/lib/auth/prisma-adapter';

export function buildNextAuthOptions(req: NextApiRequest, res: NextApiResponse): NextAuthOptions {
    if (!process.env.GOOGLE_CLIENT_ID) throw new Error('Missing GOOGLE_CLIENT_ID env var');
    if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error('Missing GOOGLE_CLIENT_SECRET env var');

    return {
        adapter: PrismaAdapter(req, res),

        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                authorization: {
                    params: {
                        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile  https://www.googleapis.com/auth/calendar',
                        access_type: 'offline'
                    }
                },
                profile(profile: GoogleProfile) {
                    return {
                        id: profile.sub,
                        name: profile.name,
                        username: '',
                        email: profile.email,
                        avatar_url: profile.picture
                    };
                }
            })
        ],

        callbacks: {
            async signIn({ account }) {
                if (!account?.scope?.includes('https://www.googleapis.com/auth/calendar')) {
                    return '/register/connect-calendar/?error=permissions';
                }

                return true;
            },

            async session({ session, user }) {
                return {
                    ...session,
                    user
                };
            }
        }
    };
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return await NextAuth(req, res, buildNextAuthOptions(req, res));
}
