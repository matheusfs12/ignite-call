import { Button, Text, TextInput } from '@ignite-ui/react';
import { Form, FormAnnotation } from './styles';

import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { usernameSchema } from '@/utils/schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const claimUsernameFormSchema = z.object({
    username: usernameSchema
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ClaimUsernameFormData>({
        resolver: zodResolver(claimUsernameFormSchema)
    });

    const router = useRouter();

    async function handleClaimUsername({ username }: ClaimUsernameFormData) {
        await router.push(`/register?username=${username}`);
    }

    return (
        <>
            <Form as='form' onSubmit={handleSubmit(handleClaimUsername)}>
                <TextInput
                    size='sm'
                    prefix='ignite.com/'
                    placeholder='seu-usuario'
                    {...register('username')}
                />

                <Button size='sm' type='submit' disabled={isSubmitting}>
                    Reservar
                    <ArrowRight />
                </Button>
            </Form>
            <FormAnnotation>
                <Text size='sm'>
                    {errors.username?.message ?? 'Digite o nome do usuário desejado'}
                </Text>
            </FormAnnotation>
        </>
    );
}
