import { NextApiRequest, NextApiResponse } from 'next';

import { buildNextAuthOptions } from '../auth/[...nextauth].api';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProfileBodySchema = z.object({
    bio: z.string()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') return res.status(405).end();

    const session = await getServerSession(req, res, buildNextAuthOptions(req, res));
    if (!session || !session.user) {
        return res.status(401).end();
    }

    const { bio } = updateProfileBodySchema.parse(req.body);

    await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            bio
        }
    });

    return res.status(204).end();
}
