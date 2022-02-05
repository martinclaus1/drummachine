import {AppShell, Header, MantineProvider, Text, ThemeIcon} from '@mantine/core';
import {PlayIcon} from '@modulz/radix-icons';
import * as React from 'react';
import DrumMachine from './DrumMachine';

const App: React.FC = () => (
        <MantineProvider>
            <AppShell
                    header={
                        <Header height="auto" style={{display: 'flex'}} padding="xs">
                            <ThemeIcon radius="lg">
                                <PlayIcon/>
                            </ThemeIcon>
                            <Text ml="xs" weight="bold">
                                Drum Machine
                            </Text>
                        </Header>
                    }
            >
                <DrumMachine/>
            </AppShell>
        </MantineProvider>
);

export default App;
