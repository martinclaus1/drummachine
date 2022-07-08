import {Anchor, AppShell, Header, MantineProvider, Text, ThemeIcon} from '@mantine/core';
import {GitHubLogoIcon, PlayIcon} from '@modulz/radix-icons';
import * as React from 'react';
import DrumMachine from './DrumMachine';

const App: React.FC = () => {
    const header = <Header height={50} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}} p="xs">
        <div style={{display: 'flex', alignItems: 'center'}}>
            <ThemeIcon radius="lg">
                <PlayIcon/>
            </ThemeIcon>
            <Text ml="xs" weight="bold">
                Drum Machine
            </Text>
        </div>
        <div>
            <Anchor href={"https://github.com/martinclaus1/drummachine"} target="_blank">
                <ThemeIcon radius="sm" variant="outline">
                    <GitHubLogoIcon />
                </ThemeIcon>
            </Anchor>
        </div>
    </Header>;

    return (
        <MantineProvider>
            <AppShell header={header}>
                <DrumMachine/>
            </AppShell>
        </MantineProvider>
    );
};

export default App;
