import {
  AndroidConfig,
  createRunOncePlugin,
  withAndroidManifest,
  withAppBuildGradle,
  withDangerousMod,
  withPlugins,
  type ConfigPlugin,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const PACKAGE_NAME = "react-native-localize";

type LocalizePluginConfig = {
  /**
   * List of supported locale codes (e.g. `["en", "fr", "zh-Hans-CN"]`).
   * Can be a single array shared by both platforms, or platform-specific arrays.
   */
  locales?: string[] | { android?: string[]; ios?: string[] };
};

const withIosAppLocales: ConfigPlugin<string[]> = (
  { ios = {}, ...config },
  locales,
) => ({
  ...config,
  ios: {
    ...ios,
    infoPlist: { ...ios.infoPlist, CFBundleLocalizations: locales },
  },
});

const withAndroidAppLocales: ConfigPlugin<string[]> = (config, locales) => {
  const withLocalesConfig = withDangerousMod(config, [
    "android",
    (config) => {
      const xmlDir = join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "xml",
      );

      mkdirSync(xmlDir, { recursive: true });

      writeFileSync(
        join(xmlDir, "locales_config.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<locale-config xmlns:android="http://schemas.android.com/apk/res/android">
${locales.map((locale) => `  <locale android:name="${locale}"/>`).join("\n")}
</locale-config>
`,
      );

      return config;
    },
  ]);

  const withMainApplication = withAndroidManifest(
    withLocalesConfig,
    (config) => {
      const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
        config.modResults,
      );

      mainApplication.$ = {
        ...mainApplication.$,
        "android:localeConfig": "@xml/locales_config",
      };

      return config;
    },
  );

  return withAppBuildGradle(withMainApplication, (config) => {
    const { modResults } = config;

    const list = locales
      .reduce<string[]>((acc, item) => {
        const [language, scriptOrRegion, region] = item.split("-");

        if (language == null) {
          return acc;
        }

        // https://developer.android.com/guide/topics/resources/app-languages#gradle-config
        if (scriptOrRegion != null && region != null) {
          return [...acc, `b+${language}+${scriptOrRegion}+${region}`];
        }
        if (scriptOrRegion != null) {
          return [...acc, `${language}-r${scriptOrRegion}`];
        }

        return [...acc, language];
      }, [])
      .filter((item, index, array) => array.indexOf(item) === index)
      .map((item) => `"${item}"`)
      .join(", ");

    const { contents } = mergeContents({
      src: modResults.contents,
      comment: "//",
      tag: PACKAGE_NAME,
      offset: 1,
      anchor: /versionName "[\d.]+"/,
      newSrc: `        resourceConfigurations += ${modResults.language === "kt" ? `listOf(${list})` : `[${list}]`}`,
    });

    return {
      ...config,
      modResults: { ...modResults, contents },
    };
  });
};

const plugin: ConfigPlugin<LocalizePluginConfig | undefined> = (
  config,
  { locales = [] } = {},
) => {
  const plugins: Array<[ConfigPlugin<string[]>, string[]]> = [];
  const { platforms = [] } = config;

  const { android, ios } = Array.isArray(locales)
    ? { android: locales, ios: locales }
    : { android: locales.android ?? [], ios: locales.ios ?? [] };

  if (platforms.includes("ios") && ios.length > 0) {
    plugins.push([withIosAppLocales, ios]);
  }
  if (platforms.includes("android") && android.length > 0) {
    plugins.push([withAndroidAppLocales, android]);
  }

  return withPlugins(config, plugins);
};

export const withLocalize = createRunOncePlugin(plugin, PACKAGE_NAME);

export default (
  config: LocalizePluginConfig,
): [typeof PACKAGE_NAME, LocalizePluginConfig] => [PACKAGE_NAME, config];
