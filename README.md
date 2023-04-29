# 🌍  react-native-localize

A toolbox for your React Native app localization.

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/zoontek/react-native-localize/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-native-localize?style=for-the-badge)](https://www.npmjs.org/package/react-native-localize)
[![npm downloads](https://img.shields.io/npm/dt/react-native-localize.svg?label=downloads&style=for-the-badge)](https://www.npmjs.org/package/react-native-localize)
<br />
[![platform - android](https://img.shields.io/badge/platform-Android-3ddc84.svg?logo=android&style=for-the-badge)](https://www.android.com)
[![platform - ios](https://img.shields.io/badge/platform-iOS-000.svg?logo=apple&style=for-the-badge)](https://developer.apple.com/ios)
[![platform - macos](https://img.shields.io/badge/platform-macOS-000.svg?logo=apple&style=for-the-badge)](https://developer.apple.com/macos)
[![platform - web](https://img.shields.io/badge/platform-Web-1977f2.svg?logo=html5&logoColor=fff&style=for-the-badge)](https://developer.mozilla.org)

<img width="400" height="auto" center src="https://github.com/zoontek/react-native-localize/blob/master/docs/screenshot.png?raw=true" />

## Funding

<a href="https://github.com/sponsors/zoontek">
  <img align="right" width="150" alt="This library helped you? Consider sponsoring!" src=".github/funding-octocat.svg">
</a>

This module is provided **as is**, I work on it in my free time.

If your company uses it in a production app, consider sponsoring this project 💰. You also can contact me for **premium** enterprise support, help with issues, prioritize bugfixes, feature requests, etc.

## Support

| package version | react-native version |
| --------------- | -------------------- |
| 3.0.0+          | 0.70.0+              |
| 2.0.0+          | 0.60.0+              |

## Setup

```bash
$ npm install --save react-native-localize
# --- or ---
$ yarn add react-native-localize
```

_Don't forget to run `pod install` after that !_

### Web support

This package supports `react-native-web`. Follow their [official guide](https://necolas.github.io/react-native-web/docs/multi-platform/#compiling-and-bundling) to configure `webpack`.

### Debugging

As this library uses synchronous native methods, remote debugging (e.g. with Chrome) is no longer possible.<br />
Instead, you should use [Flipper 🐬](https://fbflipper.com).

## Basic usage example

```ts
import { getCurrencies, getLocales } from "react-native-localize";

console.log(getLocales());
console.log(getCurrencies());
```

## API

### getLocales()

Returns the user preferred locales, in order.

#### Method type

```ts
type getLocales = () => Array<{
  languageCode: string;
  scriptCode?: string;
  countryCode: string;
  languageTag: string;
  isRTL: boolean;
}>;
```

#### Usage example

```ts
import { getLocales } from "react-native-localize";

console.log(getLocales());
/* -> [
  { countryCode: "GB", languageTag: "en-GB", languageCode: "en", isRTL: false },
  { countryCode: "US", languageTag: "en-US", languageCode: "en", isRTL: false },
  { countryCode: "FR", languageTag: "fr-FR", languageCode: "fr", isRTL: false },
] */
```

---

### getNumberFormatSettings()

Returns number formatting settings.

#### Method type

```ts
type getNumberFormatSettings = () => {
  decimalSeparator: string;
  groupingSeparator: string;
};
```

#### Usage example

```ts
import { getNumberFormatSettings } from "react-native-localize";

console.log(getNumberFormatSettings());
/* -> {
  decimalSeparator: ".",
  groupingSeparator: ",",
} */
```

---

### getCurrencies()

Returns the user preferred currency codes, in order.

#### Method type

```ts
type getCurrencies = () => string[];
```

#### Usage example

```ts
import { getCurrencies } from "react-native-localize";

console.log(getCurrencies());
// -> ["EUR", "GBP", "USD"]
```

---

### getCountry()

Returns the user current country code (based on its device locale, **not** on its position).

#### Method type

```ts
type getCountry = () => string;
```

#### Usage example

```ts
import { getCountry } from "react-native-localize";

console.log(getCountry());
// -> "FR"
```

#### Note

Devices using Latin American regional settings will return "UN" instead of "419", as the latter is not a standard country code.

---

### getCalendar()

Returns the user preferred calendar format.

#### Method type

```ts
type getCalendar = () =>
  | "gregorian"
  | "buddhist"
  | "coptic"
  | "ethiopic"
  | "ethiopic-amete-alem"
  | "hebrew"
  | "indian"
  | "islamic"
  | "islamic-umm-al-qura"
  | "islamic-civil"
  | "islamic-tabular"
  | "iso8601"
  | "japanese"
  | "persian";
```

#### Usage example

```ts
import { getCalendar } from "react-native-localize";

console.log(getCalendar());
// -> "gregorian"
```

---

### getTemperatureUnit()

Returns the user preferred temperature unit.

#### Method type

```ts
type getTemperatureUnit = () => "celsius" | "fahrenheit";
```

#### Usage example

```ts
import { getTemperatureUnit } from "react-native-localize";

console.log(getTemperatureUnit());
// -> "celsius"
```

---

### getTimeZone()

Returns the user preferred timezone (based on its device settings, **not** on its position).

#### Method type

```ts
type getTimeZone = () => string;
```

#### Usage example

```ts
import { getTimeZone } from "react-native-localize";

console.log(getTimeZone());
// -> "Europe/Paris"
```

---

### uses24HourClock()

Returns `true` if the user prefers 24h clock format, `false` if they prefer 12h clock format.

#### Method type

```ts
type uses24HourClock = () => boolean;
```

#### Usage example

```ts
import { uses24HourClock } from "react-native-localize";

console.log(uses24HourClock());
// -> true
```

---

### usesMetricSystem()

Returns `true` if the user prefers metric measure system, `false` if they prefer imperial.

#### Method type

```ts
type usesMetricSystem = () => boolean;
```

#### Usage example

```ts
import { usesMetricSystem } from "react-native-localize";

console.log(usesMetricSystem());
// -> true
```

---

### usesAutoDateAndTime()

Tells if the automatic date & time setting is enabled on the phone. **Android only**

#### Method type

```ts
type usesAutoDateAndTime = () => boolean | undefined;
```

#### Usage example

```ts
import { usesAutoDateAndTime } from "react-native-localize";

console.log(usesAutoDateAndTime()); // true or false
```

---

### usesAutoTimeZone()

Tells if the automatic time zone setting is enabled on the phone. **Android only**

#### Method type

```ts
type usesAutoTimeZone = () => boolean | undefined;
```

#### Usage example

```ts
import { usesAutoTimeZone } from "react-native-localize";

console.log(usesAutoTimeZone());
```

---

### findBestLanguageTag()

Returns the best language tag possible and its reading direction (⚠️ **it respects the user preferred languages list order, see [explanations](https://github.com/zoontek/react-native-localize/issues/57#issuecomment-508456427)**). Useful to pick the best translation available.

#### Method type

```ts
type findBestLanguageTag = (
  languageTags: string[],
) => { languageTag: string; isRTL: boolean } | void;
```

#### Usage example

```ts
import { findBestLanguageTag } from "react-native-localize";

console.log(findBestLanguageTag(["en-US", "en", "fr"]));
// -> { languageTag: "en-US", isRTL: false }
```

## Examples with [@formatjs/intl](https://formatjs.io/docs/intl)

Browse the files in the [/example](https://github.com/zoontek/react-native-localize/tree/master/example) directory.

## How to update supported localizations (iOS)

You can add / remove supported localizations in your Xcode project infos:

![](https://github.com/zoontek/react-native-localize/blob/master/docs/xcode-adding-locales.png?raw=true)

## How to test your code

Because it's a native module, you need to mock this package.<br />
The package provides a default mock you may use in your \_\_mocks\_\_/react-native-localize.js or jest.setup.js.

```ts
import localizeMock from "react-native-localize/mock";

jest.mock("react-native-localize", () => localizeMock);
```
