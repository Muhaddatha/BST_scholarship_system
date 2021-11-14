import { createTheme } from '@mui/material/styles';
import lessToJs from 'less-vars-to-js';

// eslint-disable-next-line import/no-webpack-loader-syntax
const lessVariables = require('!!raw-loader!./styling/styleVariables.less').default;
export const vars = lessToJs(lessVariables, { resolveVariables: true, stripPrefix: true });

export const { primaryColor, secondaryColor } = vars;

const theme = {
    lightMode: true,
    palette: {
        type: 'light',
        primary: {
            main: primaryColor,
            dark: secondaryColor,
            contrastColor: '#FFFFFF',
        },
        secondary: {
            main: secondaryColor,
            dark: primaryColor,
        },
    }
}