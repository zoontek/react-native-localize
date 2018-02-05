# 🌍 react-native-languages

Get the user preferred languages and use the library of your choice to translate your app !

[![npm version](https://badge.fury.io/js/react-native-languages.svg)](https://badge.fury.io/js/react-native-languages) [![npm](https://img.shields.io/npm/dt/react-native-languages.svg)](https://www.npmjs.org/package/react-native-languages) ![Platform - Android and iOS](https://img.shields.io/badge/platform-Android%20%7C%20iOS-yellow.svg) ![MIT](https://img.shields.io/dub/l/vibe-d.svg) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Requirements

#### On Android

- Android SDK Build-tools 25.0.3

## Installation

#### Using yarn
```bash
$ yarn add react-native-languages
```

#### Using npm
```bash
$ npm i react-native-languages --save
```

## Setup

### Automatic setup

#### Using react-native link (react-native >= 0.29)

```bash
$ react-native link react-native-languages
```

#### Using Cocoapods (iOS only)

```ruby
# Add this line in your Podfile
pod 'ReactNativeLanguages', :path => '../node_modules/react-native-languages'
```

```bash
$ pod install
```

### Manual setup

#### On iOS

1. In the XCode's "Project navigator", right click on your project's Libraries folder ➜ `Add Files to <...>`
2. Go to `node_modules` ➜ `react-native-languages` ➜ `ios` ➜ select `ReactNativeLanguages.xcodeproj`
3. Add `ReactNativeLanguages.a` to `Build Phases -> Link Binary With Libraries`

#### On Android

1. Add the following lines to `android/settings.gradle`:

```gradle
include ':react-native-languages'
project(':react-native-languages').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-languages/android')
```

2. Add the compile line to the dependencies in `android/app/build.gradle`:

```gradle
dependencies {
  // ...
  compile project(':react-native-languages')
}
```

3. Add the import and link the package in `MainApplication.java`:

```java
import com.reactcommunity.reactnativelanguages.ReactNativeLanguagesPackage; // <-- Add the ReactNativeLanguages import

public class MainApplication extends Application implements ReactApplication {

  // ...

  @Override
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      // ...
      new ReactNativeLanguagesPackage() // <-- Add it to the packages list
    );
  }

  // ...
}
```

## Usage

```javascript
import ReactNativeLanguages from 'react-native-languages';

// Current device language
console.log('language', ReactNativeLanguages.language);

// User preferred languages (in order)
console.log('languages', ReactNativeLanguages.languages);
```

### Listening for languages changes (Android)

```javascript
import ReactNativeLanguages from 'react-native-languages';

ReactNativeLanguages.addEventListener('change', ({ language, languages }) => {
  // Do languages related things…
  // ReactNativeLanguages.language and ReactNativeLanguages.languages will be correct too !
});
```

### Add project's supported localizations (iOS)

![](https://github.com/react-community/react-native-languages/blob/master/docs/xcode-adding-locales.png?raw=true)
