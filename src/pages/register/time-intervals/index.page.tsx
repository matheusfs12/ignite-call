import { Button, Checkbox, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react';
import { Container, Header } from '../styles';
import { Control, Controller, FieldValues, useFieldArray, useForm } from 'react-hook-form';
import {
    FormError,
    IntervalBox,
    IntervalDay,
    IntervalInputs,
    IntervalItem,
    IntervalsContainer
} from './styles';
import { convertTimeStringToMinutes, getWeekDayLong } from '@/utils/datetime-formatters';

import { ArrowRight } from 'phosphor-react';
import { api } from '@/lib/axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const timeIntervalsFormSchema = z.object({
    intervals: z
        .array(
            z.object({
                weekDay: z.number().min(0).max(6),
                checked: z.boolean(),
                startTime: z.string(),
                endTime: z.string()
            })
        )
        .length(7)
        .transform((intervals) => intervals.filter((interval) => interval.checked))
        .refine((intervals) => intervals.length > 0, {
            message: 'Você precisa selecionar pelo menos um dia da semana'
        })
        .transform((intervals) =>
            intervals.map((interval) => ({
                weekDay: interval.weekDay,
                startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
                endTimeInMinutes: convertTimeStringToMinutes(interval.endTime)
            }))
        )
        .refine(
            (intervals) =>
                intervals.every(
                    (interval) => interval.startTimeInMinutes < interval.endTimeInMinutes
                ),
            {
                message: 'O horário de início precisa ser antes do horário de fim'
            }
        )
        .refine(
            (intervals) =>
                intervals.every(
                    (interval) => interval.endTimeInMinutes - interval.startTimeInMinutes >= 60
                ),
            {
                message: 'O intervalo de horário precisa ser de pelo menos 1 hora'
            }
        )
});

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>;
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>;

export default function TimeIntervals() {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { isSubmitting, errors }
    } = useForm<TimeIntervalsFormInput, any, TimeIntervalsFormOutput>({
        resolver: zodResolver(timeIntervalsFormSchema),
        defaultValues: {
            intervals: [
                { weekDay: 0, checked: false, startTime: '08:00', endTime: '18:00' },
                { weekDay: 1, checked: false, startTime: '08:00', endTime: '18:00' },
                { weekDay: 2, checked: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 3, checked: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 4, checked: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 5, checked: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 6, checked: false, startTime: '08:00', endTime: '18:00' }
            ]
        }
    });

    const { fields } = useFieldArray({
        control,
        name: 'intervals'
    });

    const intervals = watch('intervals');

    async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
        await api.post('/users/time-intervals', { intervals: data.intervals });
    }

    return (
        <Container>
            <Header>
                <Heading as='strong'>Quase lá</Heading>
                <Text>
                    Defina o intervalo de horários que você está disponível em cada dia da semana.
                </Text>

                <MultiStep size={4} currentStep={3} />
            </Header>

            <IntervalBox as='form' onSubmit={handleSubmit(handleSetTimeIntervals)}>
                <IntervalsContainer>
                    {fields.map(({ id, weekDay }, index) => (
                        <IntervalItem key={id}>
                            <IntervalDay>
                                <IntervalCheckbox index={index} control={control} />
                                <Text>{getWeekDayLong(weekDay)}</Text>
                            </IntervalDay>
                            <IntervalInputs>
                                <TextInput
                                    size='sm'
                                    type='time'
                                    step={60}
                                    disabled={!intervals[index].checked}
                                    {...register(`intervals.${index}.startTime`)}
                                />
                                <TextInput
                                    size='sm'
                                    type='time'
                                    step={60}
                                    disabled={!intervals[index].checked}
                                    {...register(`intervals.${index}.endTime`)}
                                />
                            </IntervalInputs>
                        </IntervalItem>
                    ))}
                </IntervalsContainer>

                {errors.intervals && <FormError size='sm'>{errors.intervals.message}</FormError>}

                <Button type='submit' disabled={isSubmitting}>
                    Próximo passo
                    <ArrowRight />
                </Button>
            </IntervalBox>
        </Container>
    );
}

function IntervalCheckbox({
    index,
    control
}: {
    index: number;
    control: Control<any> | undefined;
}) {
    return (
        <Controller
            name={`intervals.${index}.checked`}
            control={control}
            render={({ field }) => (
                <Checkbox
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    checked={field.value}
                />
            )}
        />
    );
}
