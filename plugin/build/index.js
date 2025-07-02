"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
function withAppLanguageSettingAndroid(config, data) {
    const { supportedLocales } = data;
    const androidLocales = Array.isArray(supportedLocales) ? supportedLocales : supportedLocales.android;
    if (androidLocales) {
        config = (0, config_plugins_1.withDangerousMod)(config, [
            'android',
            (config) => {
                const projectRootPath = path_1.default.join(config.modRequest.platformProjectRoot);
                const folder = path_1.default.join(projectRootPath, 'app/src/main/res/xml');
                fs_1.default.mkdirSync(folder, { recursive: true });
                fs_1.default.writeFileSync(path_1.default.join(folder, 'locales_config.xml'), [
                    '<?xml version="1.0" encoding="utf-8"?>',
                    '<locale-config xmlns:android="http://schemas.android.com/apk/res/android">',
                    ...androidLocales.map((locale) => `  <locale android:name="${locale}"/>`),
                    '</locale-config>',
                ].join('\n'));
                return config;
            },
        ]);
        config = (0, config_plugins_1.withAndroidManifest)(config, (config) => {
            const mainApplication = config_plugins_1.AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
            mainApplication.$ = {
                ...mainApplication.$,
                'android:localeConfig': '@xml/locales_config',
            };
            return config;
        });
        config = (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
            if (config.modResults.language === 'groovy') {
                config.modResults.contents = (0, utils_1.appendContentsInsideDeclarationBlock)(config.modResults.contents, 'defaultConfig', `    resourceConfigurations += [${androidLocales.map((lang) => `"${lang}"`).join(', ')}]\n    `);
            }
            else {
                config_plugins_1.WarningAggregator.addWarningAndroid('react-native-localize languages', `Cannot automatically configure app build.gradle if it's not groovy`);
            }
            return config;
        });
    }
    return config;
}
function withAppLanguageSettingIos(config, data) {
    if (!config.ios) {
        config.ios = {};
    }
    if (!config.ios.infoPlist) {
        config.ios.infoPlist = {};
    }
    const { supportedLocales } = data;
    const iosLocales = Array.isArray(supportedLocales) ? supportedLocales : supportedLocales.ios;
    config.ios.infoPlist.CFBundleLocalizations = iosLocales;
    return config;
}
function withAppLanguageSetting(config, data) {
    return (0, config_plugins_1.withPlugins)(config, [
        [withAppLanguageSettingIos, data],
        [withAppLanguageSettingAndroid, data],
    ]);
}
exports.default = withAppLanguageSetting;
