import {Track} from './Patterns';
import * as React from 'react';
import {Card, createStyles, Title} from '@mantine/core';


const useStyles = createStyles((theme, _params, getRef) => {
    const stepOn = getRef('stepOn');

    return ({
        steps: {
            label: 'steps',
            width: '100%',
            display: 'grid',
            gridAutoFlow: 'column',
            gridColumnGap: '1%',
            marginTop: theme.spacing.sm,
        },
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

        title: {
            textTransform: 'capitalize',
        }
    });
});

interface TrackComponentProps {
    track: Track;
    currentStep?: number;
    trackChangeHandler: (steps: number[]) => void;
}

const TrackComponent: React.FC<TrackComponentProps> = ({track, currentStep, trackChangeHandler}) => {
    const {classes} = useStyles();

    const handleStepChange = (stepIndex: number) => {
        const newSteps = [...track.steps];
        newSteps[stepIndex] = newSteps[stepIndex] === 0 ? 1 : 0;
        trackChangeHandler(newSteps);
    };

    const steps = track.steps.map((trackStep, index) => (
        <StepComponent currentStep={currentStep}
                       enabled={trackStep !== 0}
                       stepIndex={index}
                       stepChangeHandler={() => handleStepChange(index)}
                       key={index}/>));

    return (
        <Card padding="xs" shadow="sm" withBorder>
            <Title order={4} className={classes.title}>
                {track.instrument}
            </Title>
            <div className={classes.steps}>
                {steps}
            </div>
        </Card>
    );
};

interface StepComponentProps {
    enabled: boolean;
    currentStep?: number;
    stepIndex: number;
    stepChangeHandler: () => void,
}

const StepComponent: React.FC<StepComponentProps> = ({enabled, currentStep, stepIndex, stepChangeHandler}) => {
    const {classes} = useStyles();

    const className = `${classes.step} ${currentStep === stepIndex ? classes.stepActive : 'Inactive'} ${
        enabled ? classes.stepOn : 'Off'
    }`;

    return <div className={className} onClick={stepChangeHandler}/>;
};

export default TrackComponent;