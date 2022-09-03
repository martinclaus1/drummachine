import * as React from 'react';
import {createStyles} from '@mantine/core';
import {ForwardedRef} from 'react';

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
            transition: 'border-color 950ms ease-out, background-color 400ms ease-out',
        },
        stepOn: {
            label: 'stepOn',
            ref: stepOn,
            backgroundColor: theme.colorScheme === 'light' ? theme.colors.blue[4]: theme.colors.blue[8],
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.colors.gray[5],
            transition: 'background-color 500ms ease-out',
        },
        stepActive: {
            label: 'stepActive',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.colors.red[5],
            backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[6] : theme.colors.gray[1],
            [`&.${stepOn}`]: {
                backgroundColor: theme.colors.yellow[4],
                transition: 'background-color 10ms !important',
            }
        },
    });
});

interface StepComponentProps {
    enabled: boolean;
    stepChangeHandler: () => void,
}

export const StepComponent = React.forwardRef(({enabled, stepChangeHandler}: StepComponentProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {classes} = stepStyles();
    const className = `${classes.step} ${enabled ? classes.stepOn : ''}`;

    return <div className={className} onClick={stepChangeHandler} ref={ref}/>;
});