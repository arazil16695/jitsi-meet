import COUNTRIES_RESOURCES from 'i18n-iso-countries/langs/en.json';
import i18next, { InitOptions } from 'i18next';
import { merge } from 'lodash-es';

import LANGUAGES_RESOURCES from '../../../../lang/languages.json';
import MAIN_RESOURCES from '../../../../lang/main.json';
import TRANSLATION_LANGUAGES_RESOURCES from '../../../../lang/translation-languages.json';

import { I18NEXT_INITIALIZED, LANGUAGE_CHANGED } from './actionTypes';
import languageDetector from './languageDetector';

/**
 * Override certain country names.
 */
const COUNTRIES_RESOURCES_OVERRIDES = {
    countries: {
        TW: 'Taiwan'
    }
};

/**
 * Merged country names.
 */
const COUNTRIES = merge({}, COUNTRIES_RESOURCES, COUNTRIES_RESOURCES_OVERRIDES);

/**
 * The available/supported languages.
 *
 * @public
 * @type {Array<string>}
 */
export const LANGUAGES: Array<string> = Object.keys(LANGUAGES_RESOURCES);

/**
 * The available/supported translation languages.
 *
 * @public
 * @type {Array<string>}
 */
export const TRANSLATION_LANGUAGES: Array<string> = Object.keys(TRANSLATION_LANGUAGES_RESOURCES);

/**
 * The default language.
 *
 * English is the default language.
 *
 * @public
 * @type {string} The default language.
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * The available/supported translation languages head. (Languages displayed on the top ).
 *
 * @public
 * @type {Array<string>}
 */
export const TRANSLATION_LANGUAGES_HEAD: Array<string> = [ DEFAULT_LANGUAGE ];

/**
 * The options to initialize i18next with.
 *
 * @type {i18next.InitOptions}
 */
const options: i18next.InitOptions = {
    backend: {
        loadPath: (lng: string[], ns: string[]) => {
            switch (ns[0]) {
            case 'countries':
            case 'main':
                return 'lang/{{ns}}-{{lng}}.json';
            default:
                return 'lang/{{ns}}.json';
            }
        }
    },
    defaultNS: 'main',
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
        escapeValue: false // not needed for react as it escapes by default
    },
    load: 'languageOnly',
    ns: [ 'main', 'languages', 'countries', 'translation-languages' ],
    react: {
        bindI18nStore: 'added',
        useSuspense: false
    },
    returnEmptyString: false,
    returnNull: false,
    whitelist: LANGUAGES.slice()
};

// Check if React Native is being used
if (navigator.product !== 'ReactNative') {
    // Only use HTTP backend on web
    const I18nextXHRBackend = require('i18next-http-backend').default;
    i18next.use(I18nextXHRBackend);
}

// Initialize i18next
i18next
    .use(languageDetector)
    .init(options);

// Add default language which is preloaded from the source code.
i18next.addResourceBundle(DEFAULT_LANGUAGE, 'countries', COUNTRIES, true, true);
i18next.addResourceBundle(DEFAULT_LANGUAGE, 'languages', LANGUAGES_RESOURCES, true, true);
i18next.addResourceBundle(DEFAULT_LANGUAGE, 'translation-languages', TRANSLATION_LANGUAGES_RESOURCES, true, true);
i18next.addResourceBundle(DEFAULT_LANGUAGE, 'main', MAIN_RESOURCES, true, true);

// Event listeners - Remove APP references, use your store or context here
i18next.on('initialized', () => {
    // Perform actions here, such as dispatching to your store if needed
    // If you're using Redux or another store, dispatch the actions there
    console.log('i18next initialized');
});

i18next.on('languageChanged', () => {
    // Handle language change logic here
    console.log('Language changed');
});

export default i18next;
