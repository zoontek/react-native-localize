// @flow

import { AppRegistry } from "react-native";
import SyncExample from "./src/SyncExample";
import { name as appName } from "./app.json";

// on mobile, you can switch between SyncExample / AsyncExample
// import AsyncExample from "./src/AsyncExample";
AppRegistry.registerComponent(appName, () => SyncExample);

if (typeof document !== "undefined") {
  const rootTag = document.getElementById("root");
  AppRegistry.runApplication(appName, { rootTag });
}
