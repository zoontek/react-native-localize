import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  getCalendar(): string;
  getCountry(): string;
  getCurrencies(): string[];
  getLocales(): Object[];
  getNumberFormatSettings(): Object;
  getTemperatureUnit(): string;
  getTimeZone(): string;
  uses24HourClock(): boolean;
  usesMetricSystem(): boolean;
  usesAutoDateAndTime(): boolean | null;
  usesAutoTimeZone(): boolean | null;
  openAppLanguageSettings(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("RNLocalize");
