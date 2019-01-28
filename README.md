# 🌍  react-native-localize

A toolbox for your app localization.

[![npm version](https://badge.fury.io/js/react-native-localize.svg)](https://badge.fury.io/js/react-native-localize) [![npm](https://img.shields.io/npm/dt/react-native-localize.svg)](https://www.npmjs.org/package/react-native-localize) ![Platform - Android and iOS](https://img.shields.io/badge/platform-Android%20%7C%20iOS-yellow.svg) ![MIT](https://img.shields.io/dub/l/vibe-d.svg) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

<img width="400" height="auto" src="https://github.com/react-community/react-native-localize/blob/master/docs/screenshot.png?raw=true" />

## Support

| Version | Supported react-native version |
| ------- | ------------------------------ |
| 4.+     | 0.56.0+                        |
| 2.0.1   | 0.48.0 - 0.55.4                |

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

_NB: If you use a Cocoapods and have a `Podfile`, `react-native link` will only add this library as a dependency, and you'll need to run `pod install`._

#### Using CocoaPods (iOS)

```ruby
# add this line in your Podfile
pod 'RNLocalize', :path => '../node_modules/react-native-localize/ios'
```

```bash
$ pod install
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

  // ...

  @Override
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      // ...
      new RNLocalizePackage() // <-- Add it to the packages list
    );
  }

  // ...
}
```

## Basic usage

```javascript
import RNLocalize from "react-native-localize";

// User preferred languages list (in order)
console.log("languages", RNLocalize.languages);

// User preferred currencies (in order)
console.log("currencies", RNLocalize.currencies);

// Listening for languages changes (on Android)
RNLocalize.addListener("configDidChange", () => {
  // RNLocalize exported constants changed
  // Do languages related things
});
```

## API

|                  | Type                                                                     | Since |
| ---------------- | ------------------------------------------------------------------------ | :---: |
| languages        | `Array<{ code: string, isRTL: boolean, isFallback: boolean }>`           | 4.0.0 |
| currencies       | `Array<string>`                                                          | 4.0.0 |
| calendar         | `"gregorian" \| "japanese" \| "buddhist"`                                | 4.0.0 |
| country          | `string`                                                                 | 4.0.0 |
| temperatureUnit  | `"celsius" \| "fahrenheit"`                                              | 4.0.0 |
| timeZone         | `string`                                                                 | 4.0.0 |
| uses24HourClock  | `boolean`                                                                | 4.0.0 |
| usesMetricSystem | `boolean`                                                                | 4.0.0 |
| addListener()    | `("configDidChange", LanguagesEventHandler) => ({ remove: () => void })` | 4.0.0 |

## Add project's supported localizations (iOS)

![](https://github.com/react-community/react-native-localize/blob/master/docs/xcode-adding-locales.png?raw=true)

## Examples with [i18n-js](https://github.com/fnando/i18n-js)

Browse the files in the [/example](https://github.com/react-community/react-native-localize/tree/master/example) directory.
