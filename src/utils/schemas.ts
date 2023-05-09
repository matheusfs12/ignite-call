import { z } from 'zod';

export const usernameSchema = z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .max(20, { message: 'O usuário pode ter no máximo 20 letras.' })
    .regex(/^[a-z0-9\\-]+$/, {
        message: 'O usuário só pode conter letras, números e hifens.'
    })
    .transform((value) => value.toLowerCase());
