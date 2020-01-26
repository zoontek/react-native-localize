// @flow

import type { Locale } from "./types";

export function logUnknownEvent(type: string) {
  console.error(`\`${type}\` is not a valid react-native-localize event`);
}

function getPartialTag({ languageCode, scriptCode }: Locale) {
  return languageCode + (scriptCode ? "-" + scriptCode : "");
}

export function findBestLanguageForLocales(
  languageTags: string[],
  locales: Locale[],
): {|
  languageTag: string,
  isRTL: boolean,
|} | void {
  for (let i = 0; i < locales.length; i++) {
    const currentLocale = locales[i];
    const { languageTag, languageCode, isRTL } = currentLocale;

    if (languageTags.includes(languageTag)) {
      return { languageTag, isRTL };
    }

    const partial = getPartialTag(currentLocale);
    const next = locales[i + 1];

    if (
      (!next || partial !== getPartialTag(next)) &&
      languageTags.includes(partial)
    ) {
      return { languageTag: partial, isRTL };
    }

    if (
      (!next || languageCode !== next.languageCode) &&
      languageTags.includes(languageCode)
    ) {
      return { languageTag: languageCode, isRTL };
    }
  }
}
