import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
// On native, you can switch between SyncExample / AsyncExample
import { App } from "./src/SyncExample";
// import { App } from "./src/AsyncExample";

AppRegistry.registerComponent(appName, () => App);

if (typeof document !== "undefined") {
  const rootTag = document.getElementById("root");
  AppRegistry.runApplication(appName, { rootTag });
}
