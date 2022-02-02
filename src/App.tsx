import { AppShell, Header, MantineProvider, Text, ThemeIcon } from '@mantine/core';
import { PlayIcon } from '@modulz/radix-icons';
import React from 'react';
import './App.scss';
import DrumMachine from './DrumMachine';

const App: React.FC = () => (
  <MantineProvider>
    <AppShell
      header={
        <Header height="auto" style={{ display: 'flex' }} padding="xs">
          <ThemeIcon radius="lg">
            <PlayIcon />
          </ThemeIcon>
          <Text style={{ marginLeft: '1rem' }} weight="bold">
            Drum Computer
          </Text>
        </Header>
      }
    >
      <DrumMachine />
    </AppShell>
  </MantineProvider>
);

export default App;
