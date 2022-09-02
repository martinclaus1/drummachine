import * as React from 'react';
import {Button, Container, createStyles, NumberInput, Select} from '@mantine/core';
import {LapTimerIcon} from '@modulz/radix-icons';
import {patterns} from './Patterns';

const useStyles = createStyles((theme) => {
    return ({
        topPanel: {
            '& > *': {
                marginRight: theme.spacing.sm,
            },
            padding: 0,
            marginBottom: theme.spacing.md,
            display: 'flex',
            alignItems: 'flex-end',
        },
    });
});

export interface SelectablePattern {
    label: string,
    value: string,
}

interface TopPanelProps {
    playing: boolean,
    selectedPattern?: string,
    beatsPerMinute?: number,
    startClickHandler: () => void,
    stopClickHandler: () => void,
    patternChangeHandler: (value: string) => void
    beatsPerMinuteChangeHandler: (arg0: number) => void,
}

export const TopPanel: React.FC<TopPanelProps> =
    ({
         playing,
         selectedPattern,
         beatsPerMinute,
         startClickHandler,
         stopClickHandler,
         patternChangeHandler,
         beatsPerMinuteChangeHandler
     }) => {
        const {classes} = useStyles();
        const selectablePatterns = patterns.map((pattern) => ({label: pattern.name, value: pattern.name}));

        return <Container className={classes.topPanel}>
            <Select label="Pattern" onChange={patternChangeHandler} placeholder="Pick one" value={selectedPattern}
                    data={selectablePatterns}/>
            <Button disabled={playing} onClick={startClickHandler}>
                Start
            </Button>
            <Button disabled={!playing} onClick={stopClickHandler}>
                Stop
            </Button>
            <NumberInput icon={<LapTimerIcon/>} min={0} max={200} label="BPM" value={beatsPerMinute}
                         onChange={beatsPerMinuteChangeHandler} stepHoldDelay={500} stepHoldInterval={100}/>
        </Container>;
    };