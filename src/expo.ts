import * as Expo from "@expo/config-plugins";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const pkg = require("react-native-localize/package.json");

type Props = {
  supportedLocales?: string[] | { android?: string[]; ios?: string[] };
};

type Bracket = "(" | "{" | ")" | "}";

const matchingBrackets: Record<Bracket, Bracket> = {
  "(": ")",
  ")": "(",
  "{": "}",
  "}": "{",
};

const findMatchingBracketPosition = (
  contents: string,
  bracket: Bracket,
  offset: number = 0,
): number => {
  // search first occurrence of `bracket`
  const firstBracketPos = contents.indexOf(bracket, offset);

  if (firstBracketPos < 0) {
    return -1;
  }

  let stackCounter = 0;
  const matchingBracket = matchingBrackets[bracket];

  if (bracket === "(" || bracket === "{") {
    const contentsLength = contents.length;
    // search forward
    for (let i = firstBracketPos + 1; i < contentsLength; ++i) {
      const c = contents[i];
      if (c === bracket) {
        stackCounter += 1;
      } else if (c === matchingBracket) {
        if (stackCounter === 0) {
          return i;
        }
        stackCounter -= 1;
      }
    }
  } else {
    // search backward
    for (let i = firstBracketPos - 1; i >= 0; --i) {
      const c = contents[i];
      if (c === bracket) {
        stackCounter += 1;
      } else if (c === matchingBracket) {
        if (stackCounter === 0) {
          return i;
        }
        stackCounter -= 1;
      }
    }
  }

  return -1;
};

const insertContentsAtOffset = (
  srcContents: string,
  insertion: string,
  offset: number,
): string => {
  const srcContentsLength = srcContents.length;
  if (offset < 0 || offset > srcContentsLength) {
    throw new Error("Invalid parameters.");
  }
  if (offset === 0) {
    return `${insertion}${srcContents}`;
  } else if (offset === srcContentsLength) {
    return `${srcContents}${insertion}`;
  }

  const prefix = srcContents.substring(0, offset);
  const suffix = srcContents.substring(offset);
  return `${prefix}${insertion}${suffix}`;
};

const appendContentsInsideDeclarationBlock = (
  srcContents: string,
  declaration: string,
  insertion: string,
): string => {
  const start = srcContents.search(new RegExp(`\\s*${declaration}.*?[\\(\\{]`));
  if (start < 0) {
    throw new Error(`Unable to find code block - declaration[${declaration}]`);
  }
  const end = findMatchingBracketPosition(srcContents, "{", start);
  return insertContentsAtOffset(srcContents, insertion, end);
};

const withAppLanguageSettingAndroid: Expo.ConfigPlugin<Props> = (
  config,
  props,
) => {
  const { supportedLocales = [] } = props;

  const androidLocales = Array.isArray(supportedLocales)
    ? supportedLocales
    : supportedLocales.android;

  if (androidLocales) {
    config = Expo.withDangerousMod(config, [
      "android",
      (config) => {
        const projectRootPath = join(config.modRequest.platformProjectRoot);
        const folder = join(projectRootPath, "app/src/main/res/xml");

        mkdirSync(folder, { recursive: true });

        writeFileSync(
          join(folder, "locales_config.xml"),
          [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<locale-config xmlns:android="http://schemas.android.com/apk/res/android">',
            ...androidLocales.map(
              (locale) => `  <locale android:name="${locale}"/>`,
            ),
            "</locale-config>",
          ].join("\n"),
        );

        return config;
      },
    ]);
    config = Expo.withAndroidManifest(config, (config) => {
      const mainApplication =
        Expo.AndroidConfig.Manifest.getMainApplicationOrThrow(
          config.modResults,
        );

      mainApplication.$ = {
        ...mainApplication.$,
        "android:localeConfig": "@xml/locales_config",
      };

      return config;
    });
    config = Expo.withAppBuildGradle(config, (config) => {
      if (config.modResults.language === "groovy") {
        config.modResults.contents = appendContentsInsideDeclarationBlock(
          config.modResults.contents,
          "defaultConfig",
          `    resourceConfigurations += [${androidLocales.map((lang) => `"${lang}"`).join(", ")}]\n    `,
        );
      } else {
        Expo.WarningAggregator.addWarningAndroid(
          "react-native-localize languages",
          `Cannot automatically configure app build.gradle if it's not groovy`,
        );
      }

      return config;
    });
  }

  return config;
};

const withAppLanguageSettingIos: Expo.ConfigPlugin<Props> = (config, props) => {
  if (!config.ios) {
    config.ios = {};
  }
  if (!config.ios.infoPlist) {
    config.ios.infoPlist = {};
  }

  const { supportedLocales = [] } = props;

  const iosLocales = Array.isArray(supportedLocales)
    ? supportedLocales
    : supportedLocales.ios;

  config.ios.infoPlist.CFBundleLocalizations = iosLocales;
  return config;
};

const withAppLanguageSetting: Expo.ConfigPlugin<Props | undefined> = (
  config,
  props = {},
) => {
  const plugins: Expo.ConfigPlugin<Props>[] = [];
  const { platforms = [] } = config;

  if (platforms.includes("android")) {
    plugins.push(withAppLanguageSettingAndroid);
  }
  if (platforms.includes("ios")) {
    plugins.push(withAppLanguageSettingIos);
  }

  return Expo.withPlugins(
    config,
    plugins.map((plugin) => [plugin, props]),
  );
};

export const withLocalize = Expo.createRunOncePlugin(
  withAppLanguageSetting,
  pkg.name,
  pkg.version,
);
