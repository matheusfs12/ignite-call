import { Box, Text, styled } from '@ignite-ui/react';

export const IntervalBox = styled(Box, {
    marginTop: '$6',
    display: 'flex',
    flexDirection: 'column',
    gap: '$4'
});

export const IntervalsContainer = styled('div', {
    border: '1px solid $gray600',
    borderRadius: '$md'
});

export const IntervalItem = styled('div', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '$3 $4',

    '& + &': {
        borderTop: '1px solid $gray600'
    }
});

export const IntervalDay = styled('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '$3'
});

export const IntervalInputs = styled('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '$2',

    'input::-webkit-calendar-picker-indicator': {
        // filter: 'invert(1) brightness(0.3) saturate(0)'
        display: 'none'
    }
});

export const FormError = styled(Text, {
    fontWeight: '$regular',
    color: '#f75a68'
});
