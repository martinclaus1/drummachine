import {Track} from './Patterns';
import * as React from 'react';
import {Text} from '@mantine/core';
import {StepComponent} from './StepComponent';

interface TrackComponentProps {
    track: Track;
    trackRefs: Array<HTMLDivElement | null>;
    trackChangeHandler: (steps: number[]) => void;
    titleClass: string,
}

const TrackComponent: React.FC<TrackComponentProps> = ({track, trackChangeHandler, trackRefs, titleClass}) => {
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

    return <>
        <Text className={titleClass}>
            {track.instrument}
        </Text>
        {steps}
    </>;
};

export default TrackComponent;