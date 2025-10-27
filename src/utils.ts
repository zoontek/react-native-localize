import type { Locale } from "./types";

export const getFindBestLanguageTag =
  (locales: Locale[]) =>
  <T extends string>(
    languageTags: readonly T[],
  ): { languageTag: T; isRTL: boolean } | undefined => {
    const loweredLanguageTags = languageTags.map((tag) => tag.toLowerCase());

    for (const currentLocale of locales) {
      const { languageTag, languageCode, scriptCode, countryCode, isRTL } =
        currentLocale;

      const combinaisons = [
        languageTag,
        !!scriptCode ? languageCode + "-" + scriptCode : null,
        languageCode + "-" + countryCode,
        languageCode,
      ].filter((value): value is string => !!value);

      for (const combinaison of combinaisons) {
        const loweredCombinaison = combinaison.toLowerCase();
        const tagIndex = loweredLanguageTags.indexOf(loweredCombinaison);
        const languageTag = languageTags[tagIndex];

        if (languageTag && tagIndex !== -1) {
          return { languageTag, isRTL };
        }
      }
    }
  };
