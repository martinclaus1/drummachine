import * as React from 'react';

import {createRoot} from 'react-dom/client';
import './index.scss';
import './globals';
import App from './App';
import {useColorScheme} from '@mantine/hooks';
import {useStateIfMounted} from './helpers/UseStateIfMounted';
import {ColorScheme, ColorSchemeProvider, MantineProvider} from '@mantine/core';

const Root: React.FC = () => {
    const preferredColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useStateIfMounted<ColorScheme>(preferredColorScheme);
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
            <App/>
        </MantineProvider>
    </ColorSchemeProvider>;
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<Root/>);
}


