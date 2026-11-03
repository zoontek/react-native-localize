// swift-tools-version: 6.0

import Foundation
import PackageDescription

// React Native links this package under ios/build/generated/autolinking/libs/.
// These dependencies resolve relative to that location in the consuming app.
// Exclude unused root entries so examples and repository metadata are not scanned.
let usedRootEntries: Set<String> = ["ios", "include", "Package.swift"]
let unusedRootEntries = try! FileManager.default.contentsOfDirectory(atPath: Context.packageDirectory)
    .filter { !usedRootEntries.contains($0) }
    .sorted()

let package = Package(
    name: "RNLocalize",
    platforms: [.iOS("15.1")],
    products: [
        .library(name: "RNLocalize", targets: ["RNLocalize"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .target(
            name: "RNLocalize",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
            ],
            path: ".",
            exclude: ["ios/RNLocalize.xcodeproj"] + unusedRootEntries,
            sources: ["ios"],
            publicHeadersPath: "include",
            cSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .headerSearchPath("ios"),
            ],
            cxxSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .headerSearchPath("ios"),
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ],
            linkerSettings: [.linkedFramework("Foundation")]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
