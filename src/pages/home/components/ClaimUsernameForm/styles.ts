import { Box, Text, styled } from '@ignite-ui/react';

export const Form = styled(Box, {
    display: 'flex',
    gap: '$2',
    marginTop: '$4',
    padding: '$4',

    '@media(max-width: 600px)': {
        flexDirection: 'column'
    }
});

export const FormAnnotation = styled('div', {
    marginTop: '$2',

    [`> ${Text}`]: {
        color: '$gray400'
    }
});
