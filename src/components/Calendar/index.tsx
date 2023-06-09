import {
    CalendarActions,
    CalendarBody,
    CalendarContainer,
    CalendarDay,
    CalendarHeader,
    CalendarTitle
} from './styles';
import { CaretLeft, CaretRight } from 'phosphor-react';

import { getShortWeekDays } from '@/utils/datetime-formatters';

export function Calendar() {
    const shortWeekDays = getShortWeekDays();

    return (
        <CalendarContainer>
            <CalendarHeader>
                <CalendarTitle>
                    Setembro <span> 2023</span>
                </CalendarTitle>

                <CalendarActions>
                    <button>
                        <CaretLeft />
                    </button>
                    <button>
                        <CaretRight />
                    </button>
                </CalendarActions>
            </CalendarHeader>

            <CalendarBody>
                <thead>
                    <tr>
                        {shortWeekDays.map((weekDay) => (
                            <th key={weekDay}>{weekDay}.</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <CalendarDay>1</CalendarDay>
                        </td>
                        <td>
                            <CalendarDay>2</CalendarDay>
                        </td>
                        <td>
                            <CalendarDay>3</CalendarDay>
                        </td>
                    </tr>
                </tbody>
            </CalendarBody>
        </CalendarContainer>
    );
}
