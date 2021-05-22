# react-native-localize Windows Implementation

## Module Installation

You can either use autolinking on react-native-windows 0.63 and later or manually link the module on earlier realeases.

## Automatic install with autolinking on RNW >= 0.63

RNLocalize supports autolinking. Just call: `npm i react-native-localize --save`

## Manual installation on RNW >= 0.62

1. `npm install react-native-localize --save`
2. Open your solution in Visual Studio 2019 (eg. `windows\yourapp.sln`)
3. Right-click Solution icon in Solution Explorer > Add > Existing Project...
4. Add `node_modules\react-native-localize\windows\RNLocalize\RNLocalize.vcxproj`
5. Right-click main application project > Add > Reference...
6. Select `RNLocalize` in Solution Projects
7. In app `pch.h` add `#include "winrt/RNLocalize.h"`
8. In `App.cpp` add `PackageProviders().Append(winrt::RNLocalize::ReactPackageProvider());` before `InitializeComponent();`

## Module development

If you want to contribute to this module Windows implementation, first you must install the [Windows Development Dependencies](https://microsoft.github.io/react-native-windows/docs/rnw-dependencies).

You must temporary install `react-native-windows` package. Versions of `react-native-windows` and `react-native` must match. E.g. if the module uses `react-native@0.62`, install `npm i react-native-windows@^0.62 --dev`.
