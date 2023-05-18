import { NextApiRequest, NextApiResponse } from 'next';

import { buildNextAuthOptions } from '../auth/[...nextauth].api';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const timeIntervalsBodySchema = z.object({
    intervals: z.array(
        z.object({
            weekDay: z.number(),
            startTimeInMinutes: z.number(),
            endTimeInMinutes: z.number()
        })
    )
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const session = await getServerSession(req, res, buildNextAuthOptions(req, res));
    if (!session || !session.user) {
        return res.status(401).end();
    }

    const { intervals } = timeIntervalsBodySchema.parse(req.body);

    await prisma.userTimeInterval.createMany({
        data: intervals.map((interval) => ({
            user_id: session.user.id,
            week_day: interval.weekDay,
            time_start_in_minutes: interval.startTimeInMinutes,
            time_end_in_minutes: interval.endTimeInMinutes
        }))
    });

    return res.status(201).end();
}
