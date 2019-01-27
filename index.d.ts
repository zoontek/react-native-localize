declare module "react-native-languages" {
  export type Calendar = "gregorian" | "japanese" | "buddhist";
  export type TemperatureUnit = "°C" | "°F";

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

  interface RNLanguagesModule extends LanguagesConfig {
    addListener: (
      type: LanguagesEvent,
      handler: LanguagesEventHandler,
    ) => LanguagesEmitterSubscription;
  }

  let Module: RNLanguagesModule;
  export default Module;
}
