import type { ExpoConfig } from 'expo/config';
import {
  WarningAggregator,
  withAndroidManifest,
  withAppBuildGradle,
  withDangerousMod,
  withPlugins,
  AndroidConfig,
  createRunOncePlugin,
} from 'expo/config-plugins';

import fs from 'fs';
import path from 'path';

import { appendContentsInsideDeclarationBlock } from './utils';

const pkg = require('react-native-localize/package.json');

type ConfigPluginProps = {
  supportedLocales: string[] | {
    ios?: string[];
    android?: string[];
  };
};

function withAppLanguageSettingAndroid(config: ExpoConfig, data: ConfigPluginProps) {
  const { supportedLocales } = data;
  const androidLocales = Array.isArray(supportedLocales) ? supportedLocales : supportedLocales.android;

  if (androidLocales) {
    config = withDangerousMod(config, [
      'android',
      (config) => {
        const projectRootPath = path.join(config.modRequest.platformProjectRoot);
        const folder = path.join(projectRootPath, 'app/src/main/res/xml');

        fs.mkdirSync(folder, { recursive: true });
        fs.writeFileSync(
          path.join(folder, 'locales_config.xml'),
          [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<locale-config xmlns:android="http://schemas.android.com/apk/res/android">',
            ...androidLocales.map((locale) => `  <locale android:name="${locale}"/>`),
            '</locale-config>',
          ].join('\n')
        );

        return config;
      },
    ]);
    config = withAndroidManifest(config, (config) => {
      const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

      mainApplication.$ = {
        ...mainApplication.$,
        'android:localeConfig': '@xml/locales_config',
      };

      return config;
    });
    config = withAppBuildGradle(config, (config) => {
      if (config.modResults.language === 'groovy') {
        config.modResults.contents = appendContentsInsideDeclarationBlock(
          config.modResults.contents,
          'defaultConfig',
          `    resourceConfigurations += [${androidLocales.map((lang) => `"${lang}"`).join(', ')}]\n    `
        );
      } else {
        WarningAggregator.addWarningAndroid(
          'react-native-localize languages',
          `Cannot automatically configure app build.gradle if it's not groovy`
        );
      }

      return config;
    });
  }

  return config;
}

function withAppLanguageSettingIos(
  config: ExpoConfig,
  data: ConfigPluginProps
) {
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

  
function withAppLanguageSetting(
  config: ExpoConfig,
  data: ConfigPluginProps
) {
  return withPlugins(config, [
    [withAppLanguageSettingIos, data],
    [withAppLanguageSettingAndroid, data],
  ]);
}

export default createRunOncePlugin(withAppLanguageSetting, pkg.name, pkg.version);