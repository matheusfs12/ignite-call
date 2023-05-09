import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react';
import { Container, Form, FormError, Header } from './styles';

import { ArrowRight } from 'phosphor-react';
import { AxiosError } from 'axios';
import { api } from '@/lib/axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { usernameSchema } from '@/utils/schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerFormSchema = z.object({
    username: usernameSchema,
    name: z.string().min(3, { message: 'Nome muito curto' })
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema)
    });

    const router = useRouter();

    useEffect(() => {
        if (!router.query?.username) return;

        setValue('username', String(router.query.username));

        router.replace(router.pathname);
    }, [router.query?.username, setValue, router]);

    async function handleRegister(data: RegisterFormData) {
        try {
            await api.post('/users', {
                username: data.username,
                name: data.name
            });

            await router.push('/register/connect-calendar');
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                alert(error.response.data.message);
                return;
            }

            alert('Ocorreu um erro ao criar seu perfil, tente novamente mais tarde.');
        }
    }

    return (
        <Container>
            <Header>
                <Heading as='strong'>Bem vindo ao Ignite Call!</Heading>
                <Text>
                    Precisamos de algumas informações para criar seu perfil! Ah, você pode editar
                    essas informações depois.
                </Text>

                <MultiStep size={4} currentStep={1} />
            </Header>

            <Form as='form' onSubmit={handleSubmit(handleRegister)}>
                <label>
                    <Text size='sm'>Nome de usuário</Text>
                    <TextInput
                        prefix='ignite.com/'
                        placeholder='seu-usuario'
                        {...register('username')}
                    />
                    {errors.username && <FormError size='sm'>{errors.username.message}</FormError>}
                </label>

                <label>
                    <Text size='sm'>Nome completo</Text>
                    <TextInput placeholder='Seu nome' {...register('name')} />
                    {errors.name && <FormError size='sm'>{errors.name.message}</FormError>}
                </label>

                <Button type='submit' disabled={isSubmitting}>
                    Próximo passo
                    <ArrowRight />
                </Button>
            </Form>
        </Container>
    );
}
