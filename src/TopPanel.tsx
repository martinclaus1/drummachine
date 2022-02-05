import * as React from 'react';
import {Button, Container, createStyles, Select} from '@mantine/core';
import {SelectablePattern} from './DrumMachine';

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
    startClock: () => void,
    stopClock: () => void,
    pattern: string,
    patterns: SelectablePattern[],
    onChange: (arg0: string) => void
}

export const TopPanel: React.FC<TopPanelProps> = ({playing, startClock, stopClock, pattern, onChange, patterns}) => {
    const {classes} = useStyles();
    return (
            <Container className={classes.topPanel}>
                <Select
                        label="Pattern"
                        onChange={(value: string) => onChange(value)}
                        placeholder="Pick one"
                        value={pattern}
                        data={patterns}
                />
                <Button disabled={playing} onClick={startClock}>
                    Start
                </Button>
                <Button disabled={!playing} onClick={stopClock}>
                    Stop
                </Button>
            </Container>);
};