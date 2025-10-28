import NativeModule from "./specs/NativeRNLocalize";
import type {
  Calendar,
  Locale,
  LocalizeApi,
  NumberFormatSettings,
  ServerLanguagesProviderProps,
  TemperatureUnit,
} from "./types";
import { getFindBestLanguageTag } from "./utils";

export const getCalendar = (): Calendar =>
  NativeModule.getCalendar() as Calendar;

export const getCountry = (): string => NativeModule.getCountry();
export const getCurrencies = (): string[] => NativeModule.getCurrencies();
export const getLocales = (): Locale[] => NativeModule.getLocales() as Locale[];

export const getNumberFormatSettings = (): NumberFormatSettings =>
  NativeModule.getNumberFormatSettings() as NumberFormatSettings;

export const getTemperatureUnit = (): TemperatureUnit =>
  NativeModule.getTemperatureUnit() as TemperatureUnit;

export const getTimeZone = (): string => NativeModule.getTimeZone();
export const uses24HourClock = (): boolean => NativeModule.uses24HourClock();
export const usesMetricSystem = (): boolean => NativeModule.usesMetricSystem();

export const usesAutoDateAndTime = (): boolean | undefined =>
  NativeModule.usesAutoDateAndTime() ?? undefined;

export const usesAutoTimeZone = (): boolean | undefined =>
  NativeModule.usesAutoTimeZone() ?? undefined;

export const findBestLanguageTag = getFindBestLanguageTag(getLocales());

export const openAppLanguageSettings = async (): Promise<void> => {
  await NativeModule.openAppLanguageSettings();
};

export const ServerLanguagesProvider = ({
  children,
}: ServerLanguagesProviderProps) => children;

const api: LocalizeApi = {
  getCalendar,
  getCountry,
  getCurrencies,
  getLocales,
  getNumberFormatSettings,
  getTemperatureUnit,
  getTimeZone,
  uses24HourClock,
  usesMetricSystem,
  usesAutoDateAndTime,
  usesAutoTimeZone,
  findBestLanguageTag,
  openAppLanguageSettings,
};

export const useLocalize = (): LocalizeApi => api;
