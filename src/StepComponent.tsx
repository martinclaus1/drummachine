import * as React from 'react';
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
            background: theme.colors.gray[4],
            transition: 'border-color 950ms ease-out, background-color 400ms ease-out',
        },
        stepOn: {
            label: 'stepOn',
            ref: stepOn,
            background: theme.colors.blue[4],
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
            background: theme.colors.gray[6],
            [`&.${stepOn}`]: {
                background: theme.colors.yellow[4],
                transition: 'background-color 10ms !important',
            }
        },
    });
});

interface StepComponentProps {
    enabled: boolean;
    currentStep?: number;
    stepChangeHandler: () => void,
    onSetStepRef: (element: HTMLDivElement | null) => void
}

export const StepComponent: React.FC<StepComponentProps> = ({enabled, stepChangeHandler, onSetStepRef}) => {
    const {classes} = stepStyles();
    const className = `${classes.step} ${enabled ? classes.stepOn : ''}`;

    return <div className={className} onClick={stepChangeHandler} ref={el => onSetStepRef(el)}/>;
};