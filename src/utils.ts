import type { Locale } from "./types";

/**
 * Creates a function to find the best matching language tag from a device's available locales.
 * The matching algorithm tries the following in order:
 * 1. Full language tag match (e.g., "en-US")
 * 2. Language + script match (e.g., "zh-Hans")
 * 3. Language + country match (e.g., "en-GB")
 * 4. Language only match (e.g., "en")
 *
 * @param {Locale[]} locales - Array of device locales to match against
 * @returns {Function} A function that finds the best matching tag
 * @throws {Error} Throws if called with empty array
 *
 * @example
 * const locales = [
 *   { languageCode: "en", countryCode: "US", languageTag: "en-US", isRTL: false },
 *   { languageCode: "fr", countryCode: "FR", languageTag: "fr-FR", isRTL: false }
 * ];
 * const findBest = getFindBestLanguageTag(locales);
 * const result = findBest(["fr-FR", "en-US"]);
 * // Returns: { languageTag: "fr-FR", isRTL: false }
 */
export const getFindBestLanguageTag =
  (locales: Locale[]) =>
  <T extends string>(
    languageTags: readonly T[],
  ): { languageTag: T; isRTL: boolean } | undefined => {
    // Validate input
    if (!locales || locales.length === 0) {
      return undefined;
    }

    if (!languageTags || languageTags.length === 0) {
      return undefined;
    }

    const loweredLanguageTags = languageTags.map((tag) => tag.toLowerCase());

    for (const currentLocale of locales) {
      const { languageTag, languageCode, scriptCode, countryCode, isRTL } =
        currentLocale;

      // Build list of candidate tags in order of specificity
      const candidates = [
        languageTag, // Most specific: full locale
        scriptCode ? `${languageCode}-${scriptCode}` : null, // With script
        `${languageCode}-${countryCode}`, // Language + country
        languageCode, // Least specific: language only
      ].filter((value): value is string => !!value);

      for (const candidate of candidates) {
        const loweredCandidate = candidate.toLowerCase();
        const matchIndex = loweredLanguageTags.indexOf(loweredCandidate);

        if (matchIndex !== -1) {
          // Safe to access because matchIndex is guaranteed to be a valid array index
          const matchedTag = languageTags[matchIndex]!;
          return { languageTag: matchedTag, isRTL };
        }
      }
    }

    return undefined;
  };
