# 🌍  react-native-localize

A toolbox for your React Native app localization.

[![npm version](https://badge.fury.io/js/react-native-localize.svg)](https://badge.fury.io/js/react-native-localize) [![npm](https://img.shields.io/npm/dt/react-native-localize.svg)](https://www.npmjs.org/package/react-native-localize) ![Platform - Android and iOS](https://img.shields.io/badge/platform-Android%20%7C%20iOS-yellow.svg) ![MIT](https://img.shields.io/dub/l/vibe-d.svg) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

### ⚠️  Breaking change

This project was known as [react-native-languages](https://www.npmjs.com/package/react-native-languages) and has been renamed to reflect new APIs possibilities.<br>Find more informations about this change [here](https://github.com/react-native-community/react-native-localize/pull/29).

<img width="400" height="auto" center src="https://github.com/react-native-community/react-native-localize/blob/master/docs/screenshot.png?raw=true" />

## Support

| package name           | version | react-native version |
| ---------------------- | ------- | -------------------- |
| react-native-localize  | 1.0.0+  | 0.56.0+              |
| react-native-languages | 2.0.1   | 0.48.0 - 0.55.4      |

## Installation

#### Using yarn

```bash
$ npm install --save react-native-localize
# --- or ---
$ yarn add react-native-localize
```

## Linking

#### Using react-native-cli (recommended)

```bash
$ react-native link react-native-localize
```

#### Manual (iOS)

1.  In the XCode's "Project navigator", right click on your project's Libraries folder ➜ `Add Files to <...>`
2.  Go to `node_modules` ➜ `react-native-localize` ➜ `ios` ➜ select `RNLocalize.xcodeproj`
3.  Add `RNLocalize.a` to `Build Phases -> Link Binary With Libraries`

#### Manual (Android)

1.  Add the following lines to `android/settings.gradle`:

```gradle
include ':react-native-localize'
project(':react-native-localize').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-localize/android')
```

2.  Add the compile line to the dependencies in `android/app/build.gradle`:

```gradle
dependencies {
  // ...
  compile project(':react-native-localize')
}
```

3.  Add the import and link the package in `MainApplication.java`:

```java
import com.reactcommunity.rnlocalize.RNLocalizePackage; // <-- Add the RNLocalize import

public class MainApplication extends Application implements ReactApplication {

  // …

  @Override
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      // …
      new RNLocalizePackage() // <-- Add it to the packages list
    );
  }

  // …
}
```

## Basic usage example

```js
import * as RNLocalize from "react-native-localize";

console.log(RNLocalize.getLocales());
console.log(RNLocalize.getCurrencies());

RNLocalize.addEventListener("change", () => {
  // do localization related stuff…
});
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

```js
console.log(RNLocalize.getLocales());
/* -> [
  { countryCode: "GB", languageTag: "en-GB", languageCode: "en", isRTL: false },
  { countryCode: "US", languageTag: "en-US", languageCode: "en", isRTL: false },
  { countryCode: "FR", languageTag: "fr-FR", languageCode: "fr", isRTL: false },
] */
```

---

### getCurrencies()

Returns the user preferred currency codes, in order.

#### Method type

```ts
type getCurrencies = () => Array<string>;
```

#### Usage example

```js
console.log(RNLocalize.getCurrencies());
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

```js
console.log(RNLocalize.getCountry());
// -> "FR"
```

---

### getCalendar()

Returns the user preferred calendar format.

#### Method type

```ts
type getCalendar = () => "gregorian" | "japanese" | "buddhist";
```

#### Usage example

```js
console.log(RNLocalize.getCalendar());
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

```js
console.log(RNLocalize.getTemperatureUnit());
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

```js
console.log(RNLocalize.getTimeZone());
// -> "Europe/Paris"
```

---

### uses24HourClock()

Returns `true` if the user prefers 24h clock format, `false` if he prefers 12h clock format.

#### Method type

```ts
type uses24HourClock = () => boolean;
```

#### Usage example

```js
console.log(RNLocalize.uses24HourClock());
// -> true
```

---

### usesMetricSystem()

Returns `true` if the user prefers metric measure system, `false` if he prefers imperial.

#### Method type

```ts
type usesMetricSystem = () => boolean;
```

#### Usage example

```js
console.log(RNLocalize.usesMetricSystem());
// -> true
```

---

### addEventListener() / removeEventListener()

Allows you to listen for any localization change.

#### Methods type

```ts
type addEventListener = (type: "change", handler: Function) => void;
type removeEventListener = (type: "change", handler: Function) => void;
```

#### Usage example

```js
function handleLocalizationChange() {
  console.log(RNLocalize.getLocales());
}

RNLocalize.addEventListener("change", handleLocalizationChange);
// …later (ex: component unmount)
RNLocalize.removeEventListener("change", handleLocalizationChange);
```

---

### findBestAvailableLanguage()

Returns the best language tag possible and its direction (if it can find one). Useful to choose the best translation available.

#### Method type

```ts
type findBestAvailableLanguage = (
  languageTags: Array<string>,
) => { languageTag: string; isRTL: boolean } | void;
```

#### Usage example

```js
console.log(RNLocalize.findBestAvailableLanguage(["en-US", "en", "fr"]));
// -> { languageTag: "en-US", isRTL: false }
```

## Add project's supported localizations (iOS)

![](https://github.com/react-native-community/react-native-localize/blob/master/docs/xcode-adding-locales.png?raw=true)

## Examples with [i18n-js](https://github.com/fnando/i18n-js)

Browse the files in the [/example](https://github.com/react-native-community/react-native-localize/tree/master/example) directory.
