import {Track} from './Patterns';
import * as React from 'react';
import {RefObject} from 'react';
import {Text} from '@mantine/core';
import {StepComponent} from './StepComponent';

interface TrackComponentProps {
    track: Track;
    trackIndex: number,
    stepRefs: Array<RefObject<HTMLDivElement> | null>;
    trackChangeHandler: (steps: number[]) => void;
    titleClass: string,
}

const TrackComponent: React.FC<TrackComponentProps> = props => {
    const {track, trackChangeHandler, stepRefs, titleClass, trackIndex} = props;
    const stepCount = track.steps.length

    const handleStepChange = (stepIndex: number) => {
        const newSteps = [...track.steps];
        newSteps[stepIndex] = newSteps[stepIndex] === 0 ? 1 : 0;
        trackChangeHandler(newSteps);
    };

    const isEndOfQuarterNote = (index: number) => {
        const naturalIndex = index + 1;
        const quarterNotesPerBar = stepCount / 4;
        if (naturalIndex === stepCount) {
            return false;
        }
        return naturalIndex % quarterNotesPerBar === 0;
    };

    const steps = track.steps.map((step, index) => {
        stepRefs[index] = React.createRef<HTMLDivElement>();
        return (
            <StepComponent enabled={step !== 0}
                           endOfQuarterNote={isEndOfQuarterNote(index)}
                           ref={stepRefs[index]}
                           stepChangeHandler={() => handleStepChange(index)}
                           key={`step_${trackIndex}_${index}`}/>);
    });

    return <>
        <Text className={titleClass}>
            {track.instrument}
        </Text>
        {steps}
    </>;
};

export default TrackComponent;