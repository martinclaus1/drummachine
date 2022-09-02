import {ActionIcon, Anchor, AppShell, Group, Header, Text, ThemeIcon, useMantineColorScheme} from '@mantine/core';
import {GitHubLogoIcon, MoonIcon, PlayIcon, SunIcon} from '@modulz/radix-icons';
import * as React from 'react';
import DrumMachine from './DrumMachine';

const App: React.FC = () => {
    return <AppShell header={<CustomHeader/>}>
        <DrumMachine/>
    </AppShell>;
};

const CustomHeader: React.FC = () => {
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return <Header height={50} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
                   p="xs">
        <Group spacing="xs">
            <ThemeIcon radius="lg">
                <PlayIcon/>
            </ThemeIcon>
            <Text weight="bold">
                Drum Machine
            </Text>
        </Group>
        <Group spacing="xs">
            <Anchor href={'https://github.com/martinclaus1/drummachine'} target="_blank">
                <ThemeIcon radius="sm" variant="outline">
                    <GitHubLogoIcon/>
                </ThemeIcon>
            </Anchor>
            <ActionIcon
                variant="outline"
                color={dark ? 'yellow' : 'blue'}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
            >
                {dark ? <SunIcon/> : <MoonIcon/>}
            </ActionIcon>
        </Group>
    </Header>;
};

export default App;
