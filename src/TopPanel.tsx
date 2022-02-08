import * as React from 'react';
import {Button, Container, createStyles, NumberInput, Select} from '@mantine/core';
import {SelectablePattern} from './DrumMachine';
import {useStateIfMounted} from './UseStateIfMounted';
import {Pattern} from './Patterns';
import {LapTimerIcon} from '@modulz/radix-icons';

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

interface TopPanelProps {
    playing: boolean,
    startClickHandler: () => void,
    stopClickHandler: () => void,
    pattern: Pattern,
    patterns: Pattern[],
    beatsPerMinuteChangeHandler: (arg0: number) => void,
    patternChangeHandler: (newPattern: Pattern) => void
}

export const TopPanel: React.FC<TopPanelProps> = ({
                                                      playing,
                                                      startClickHandler,
                                                      stopClickHandler,
                                                      pattern,
                                                      patternChangeHandler,
                                                      beatsPerMinuteChangeHandler,
                                                      patterns
                                                  }) => {
    const {classes} = useStyles();
    const [patternName, setPatternName] = useStateIfMounted<string>(pattern.name);
    const [beatsPerMinute, setBeatsPerMinute] = useStateIfMounted(pattern.beatsPerMinute);
    const [selectablePatterns, setSelectablePatterns] = useStateIfMounted<SelectablePattern[]>([]);

    React.useEffect(() => {
        setPatternName(pattern.name);
        setBeatsPerMinute(pattern.beatsPerMinute);
    }, [pattern]);

    React.useEffect(() => {
        const selectablePatterns = patterns.map((pattern) => ({label: pattern.name, value: pattern.name}));
        setSelectablePatterns(selectablePatterns);
    }, [patterns]);

    const handlePatternChange = (value: string) => {
        const newPattern = patterns.find((pattern) => pattern.name === value)!;
        setPatternName(value);
        patternChangeHandler(newPattern);
    };

    const handleBeatsPerMinuteChange = (value: number) => {
        setBeatsPerMinute(value);
        beatsPerMinuteChangeHandler(value);
    };

    return (
            <Container className={classes.topPanel}>
                <Select
                        label="Pattern"
                        onChange={handlePatternChange}
                        placeholder="Pick one"
                        value={patternName}
                        data={selectablePatterns}
                />
                <Button disabled={playing} onClick={startClickHandler}>
                    Start
                </Button>
                <Button disabled={!playing} onClick={stopClickHandler}>
                    Stop
                </Button>
                <NumberInput
                        icon={<LapTimerIcon/>}
                        min={0}
                        max={200}
                        label="BPM"
                        value={beatsPerMinute}
                        onChange={handleBeatsPerMinuteChange}
                        stepHoldDelay={500}
                        stepHoldInterval={100}
                />
            </Container>);
};