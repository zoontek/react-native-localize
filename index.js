// @flow

// $FlowFixMe
import { NativeModules, NativeEventEmitter } from "react-native";
const { RNLocalize } = NativeModules;

export type Calendar = "gregorian" | "japanese" | "buddhist";
export type TemperatureUnit = "celsius" | "fahrenheit";

export type LanguagesConfig = {|
  +languages: string[],
  +currencies: string[],
  +calendar: Calendar,
  +country: string,
  +temperatureUnit: TemperatureUnit,
  +timeZone: string,
  +uses24HourClock: boolean,
  +usesMetricSystem: boolean,
|};

export type LanguagesEmitterSubscription = {|
  remove: () => void,
|};
export type LanguagesEvent = "configDidChange";
export type LanguagesEventHandler = (config: LanguagesConfig) => any;

type RNLocalizeModule = {|
  ...LanguagesConfig,
  addListener: (
    type: LanguagesEvent,
    handler: LanguagesEventHandler,
  ) => LanguagesEmitterSubscription,
|};

const emitter = new NativeEventEmitter(RNLocalize);
const handlers: Set<LanguagesEventHandler> = new Set();

let Module: RNLocalizeModule = {
  ...RNLocalize.config,

  addListener(
    type: LanguagesEvent,
    handler: LanguagesEventHandler,
  ): LanguagesEmitterSubscription {
    let remove = () => {};

    if (type !== "configDidChange") {
      console.error(`Trying to subscribe to unknown event: "${type}"`);
    } else {
      if (!handlers.has(handler)) {
        handlers.add(handler);
      }
      remove = () => {
        handlers.delete(handler);
      };
    }

    return { remove };
  },
};

emitter.addListener("languagesConfigDidChange", (config: LanguagesConfig) => {
  Object.keys(config).forEach((k: string) => (Module[k] = config[k]));
  handlers.forEach(handler => handler(config));
});

export default Module;
