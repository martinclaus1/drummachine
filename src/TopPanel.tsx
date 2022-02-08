import * as React from 'react';
import {Button, Container, createStyles, Select} from '@mantine/core';
import {SelectablePattern} from './DrumMachine';
import {useStateIfMounted} from './UseStateIfMounted';
import {Pattern} from './Patterns';

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
    pattern?: Pattern,
    patterns: Pattern[],
    patternChangeHandler: (arg0: string) => void
}

export const TopPanel: React.FC<TopPanelProps> = ({
                                                      playing,
                                                      startClickHandler,
                                                      stopClickHandler,
                                                      pattern,
                                                      patternChangeHandler,
                                                      patterns
                                                  }) => {
    const {classes} = useStyles();
    const [selectablePatterns, setSelectablePatterns] = useStateIfMounted<SelectablePattern[]>([]);

    React.useEffect(() => {
        const selectablePatterns = patterns.map((pattern) => ({label: pattern.name, value: pattern.name}));
        setSelectablePatterns(selectablePatterns);
    }, [patterns]);

    return (
            <Container className={classes.topPanel}>
                <Select
                        label="Pattern"
                        onChange={patternChangeHandler}
                        placeholder="Pick one"
                        value={pattern?.name}
                        data={selectablePatterns}
                />
                <Button disabled={playing} onClick={startClickHandler}>
                    Start
                </Button>
                <Button disabled={!playing} onClick={stopClickHandler}>
                    Stop
                </Button>
            </Container>);
};