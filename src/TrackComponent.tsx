import {Track} from './Patterns';
import * as React from 'react';
import {createStyles, Text} from '@mantine/core';

interface TrackStyleProps {
    stepCount: number;
}

export const trackStyles = createStyles((theme, {stepCount}: TrackStyleProps) => {
    const stepColumns = `repeat(${stepCount}, minmax(auto, 40px))`;
    return ({
        track: {
            label: 'steps',
            display: 'grid',
            gridColumnGap: '1%',
            marginTop: theme.spacing.sm,
            gridTemplateColumns: `100px ${stepColumns}`,

            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                gridTemplateColumns: stepColumns,
            },
        },
        title: {
            label: 'title',
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                gridColumn: `1/-1`,
            },
            textTransform: "capitalize"
        },
    });
});

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

interface TrackComponentProps {
    track: Track;
    trackRefs: Array<HTMLDivElement | null>;
    trackChangeHandler: (steps: number[]) => void;
}

const TrackComponent: React.FC<TrackComponentProps> = ({track, trackChangeHandler, trackRefs}) => {
    const {classes} = trackStyles({stepCount: track.steps.length});

    const handleStepChange = (stepIndex: number) => {
        const newSteps = [...track.steps];
        newSteps[stepIndex] = newSteps[stepIndex] === 0 ? 1 : 0;
        trackChangeHandler(newSteps);
    };

    const steps = track.steps.map((trackStep, index) => (
        <StepComponent enabled={trackStep !== 0}
                       onSetStepRef={(element) => trackRefs[index] = element}
                       stepChangeHandler={() => handleStepChange(index)}
                       key={`${trackStep}_${index}`}/>));

    return <div className={classes.track}>
        <Text className={classes.title}>
            {track.instrument}
        </Text>
        {steps}
    </div>;
};

interface StepComponentProps {
    enabled: boolean;
    currentStep?: number;
    stepChangeHandler: () => void,
    onSetStepRef: (element: HTMLDivElement | null) => void
}

const StepComponent: React.FC<StepComponentProps> = ({enabled, stepChangeHandler, onSetStepRef}) => {
    const {classes} = stepStyles();

    const className = `${classes.step} ${
        enabled ? classes.stepOn : 'Off'
    }`;

    return <div className={className} onClick={stepChangeHandler} ref={el => onSetStepRef(el)}/>;
};

export default TrackComponent;