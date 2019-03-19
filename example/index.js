/**
 * @format
 */

import { AppRegistry } from "react-native";
import SyncExample from "./src/SyncExample";
import AsyncExample from "./src/AsyncExample";
import { name as appName } from "./app.json";

// you can switch between SyncExample / AsyncExample
AppRegistry.registerComponent(appName, () => SyncExample);
