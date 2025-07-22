import { ColorPalette } from '../styles/components/styles/ColorPalette';
import { getRGBAFormat } from '../styles/functions.any';

/**
 * The default color scheme of the application.
 */
export default {
    '_defaultTheme': {
        // Generic app theme colors that are used across the entire app.
        // All scheme definitions below inherit these values.
        background: 'rgb(255, 255, 255)',
        errorText: ColorPalette.red,
        icon: 'rgb(28, 32, 37)',
        text: 'rgb(28, 32, 37)'
    },
    'Dialog': {},
    'Header': {
        background: '#e7eeedff',//ColorPalette.blue,
        icon: ColorPalette.white,
        statusBar: '#d7f1eeff',//ColorPalette.blueHighlight,
        statusBarContent: ColorPalette.white,
        text: ColorPalette.white
    },
    'Toolbox': {
        button: 'rgb(255, 255, 255)',
        buttonToggled: 'rgb(38, 58, 76)',
        buttonToggledBorder: getRGBAFormat('#a4b8d1', 0.6),
        hangup: 'rgba(222, 249, 22, 1)'
    }
};
