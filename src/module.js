// @flow

import { NativeModules, NativeEventEmitter } from "react-native";
import type { LocalizationConstants } from "./types";

const { RNLocalize } = NativeModules;
const emitter = new NativeEventEmitter(RNLocalize);

export const handlers: Set<Function> = new Set();
export let constants: LocalizationConstants = RNLocalize.initialConstants;

emitter.addListener("localizationDidChange", (next: LocalizationConstants) => {
  if (JSON.stringify(next) !== JSON.stringify(constants)) {
    constants = next;
    handlers.forEach(handler => handler());
  }
});
