import { AppShell, Header, Text, ThemeIcon } from '@mantine/core';
import { PlayIcon, RocketIcon } from '@modulz/radix-icons';
import React from 'react';
import './App.scss';
import DrumMachine from './DrumMachine';

const App: React.FC = () => (
  <AppShell
    header={
      <Header height={60} style={{display: 'flex'}} padding="xs">
        <ThemeIcon radius="lg">
          <PlayIcon />
        </ThemeIcon>
        <Text style={{marginLeft: "1rem"}}>
          Drum Computer
        </Text>
      </Header>
    }
  >
    <DrumMachine />
  </AppShell>
);

export default App;
