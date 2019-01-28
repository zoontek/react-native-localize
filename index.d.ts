declare module "react-native-localize" {
  export type Calendar = "gregorian" | "japanese" | "buddhist";
  export type TemperatureUnit = "celsius" | "fahrenheit";

  export interface LanguagesConfig {
    readonly languages: string[];
    readonly currencies: string[];
    readonly calendar: Calendar;
    readonly country: string;
    readonly temperatureUnit: TemperatureUnit;
    readonly timeZone: string;
    readonly uses24HourClock: boolean;
    readonly usesMetricSystem: boolean;
  }

  export type LanguagesEmitterSubscription = {
    remove: () => void;
  };
  export type LanguagesEvent = "configDidChange";
  export type LanguagesEventHandler = (config: LanguagesConfig) => any;

  interface RNLocalizeModule extends LanguagesConfig {
    addListener: (
      type: LanguagesEvent,
      handler: LanguagesEventHandler,
    ) => LanguagesEmitterSubscription;
  }

  let Module: RNLocalizeModule;
  export default Module;
}
