import { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie, parseCookies } from 'nookies';

import { Adapter } from 'next-auth/adapters';
import { User } from '@prisma/client';
import { prisma } from '../prisma';

function mapUserAdapter(user: User) {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!
    };
}

export function PrismaAdapter(req: NextApiRequest, res: NextApiResponse): Adapter {
    return {
        async createUser(user) {
            const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req });

            if (!userIdOnCookies) {
                throw new Error('Missing user id on cookies');
            }

            const prismaUser = await prisma.user.update({
                where: {
                    id: userIdOnCookies
                },
                data: {
                    name: user.name,
                    email: user.email,
                    avatar_url: user.avatar_url
                }
            });

            destroyCookie({ res }, '@ignitecall:userId', {
                path: '/'
            });

            return mapUserAdapter(prismaUser);
        },

        async getUser(id) {
            const user = await prisma.user.findUnique({
                where: {
                    id
                }
            });

            if (!user) {
                return null;
            }

            return mapUserAdapter(user);
        },

        async getUserByEmail(email) {
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if (!user) {
                return null;
            }

            return mapUserAdapter(user);
        },

        async getUserByAccount({ provider, providerAccountId }) {
            const account = await prisma.account.findUnique({
                where: {
                    provider_id_provider_account_id: {
                        provider_id: provider,
                        provider_account_id: providerAccountId
                    }
                },
                include: {
                    user: true
                }
            });

            if (!account) {
                return null;
            }

            return mapUserAdapter(account.user);
        },

        async updateUser(user) {
            const prismaUser = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    name: user.name,
                    email: user.email,
                    avatar_url: user.avatar_url
                }
            });

            return mapUserAdapter(prismaUser);
        },

        async linkAccount(account) {
            await prisma.account.create({
                data: {
                    user_id: account.userId,
                    provider_id: account.provider,
                    provider_type: account.type,
                    provider_account_id: account.providerAccountId,
                    refresh_token: account.refresh_token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state
                }
            });
        },

        async createSession({ sessionToken, userId, expires }) {
            await prisma.session.create({
                data: {
                    session_token: sessionToken,
                    user_id: userId,
                    expires: expires
                }
            });

            return {
                userId,
                sessionToken,
                expires
            };
        },

        async getSessionAndUser(sessionToken) {
            const session = await prisma.session.findUnique({
                where: {
                    session_token: sessionToken
                },
                include: {
                    user: true
                }
            });

            if (!session) {
                return null;
            }

            return {
                user: mapUserAdapter(session.user),
                session: {
                    userId: session.user_id,
                    sessionToken: session.session_token,
                    expires: session.expires
                }
            };
        },

        async updateSession({ sessionToken, expires, userId }) {
            const prismaSession = await prisma.session.update({
                where: {
                    session_token: sessionToken
                },
                data: {
                    expires: expires,
                    user_id: userId
                }
            });

            return {
                sessionToken: prismaSession.session_token,
                userId: prismaSession.user_id,
                expires: prismaSession.expires
            };
        },

        async deleteSession(sessionToken) {
            await prisma.session.delete({
                where: {
                    session_token: sessionToken
                }
            });
        }
    };
}
