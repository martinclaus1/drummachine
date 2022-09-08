import * as React from 'react';
import {ForwardedRef} from 'react';
import {createStyles} from '@mantine/core';

export const stepStyles = createStyles((theme, _params, getRef) => {
    const stepOn = getRef('stepOn');

    return ({
        step: {
            label: 'step',
            aspectRatio: '1',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.colors.gray[5],
            borderRadius: '20%',
            backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.gray[6],
            transition: 'border-color 475ms ease-out, background-color 200ms ease-out',
            position: 'relative',
        },
        endOfQuarterNote: {
            label: 'endOfQuarterNote',
            ['&:after']: {
                position: 'absolute',
                content: '""',
                width: '1px',
                top: `-${theme.spacing.xs/2}px`,
                height: `calc(100% + ${theme.spacing.xs}px)`,
                right: `-${(theme.spacing.xs / 2) + 1}px`,
                borderRight: `1px dashed ${theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.gray[6]}`,
            }
        },
        stepOn: {
            label: 'stepOn',
            ref: stepOn,
            backgroundColor: theme.colorScheme === 'light' ? theme.colors.blue[4] : theme.colors.blue[8],
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.colors.gray[5],
            transition: 'background-color 250ms ease-out',
        },
        stepActive: {
            label: 'stepActive',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.colors.red[5],
            backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[6] : theme.colors.gray[7],
            [`&.${stepOn}`]: {
                backgroundColor: theme.colorScheme === 'light' ?theme.colors.yellow[4]: theme.colors.yellow[6],
                transition: 'background-color 5ms !important',
            }
        },
    });
});

interface StepComponentProps {
    enabled: boolean;
    endOfQuarterNote: boolean,
    stepChangeHandler: () => void,
}

export const StepComponent = React.forwardRef((props: StepComponentProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {enabled, stepChangeHandler, endOfQuarterNote} = props;
    const {classes} = stepStyles();
    const className = `${classes.step} ${enabled ? classes.stepOn : ''} ${endOfQuarterNote ? classes.endOfQuarterNote : ''}`;

    return <div className={className} onClick={stepChangeHandler} ref={ref}/>;
});