import type { ExpoConfig } from 'expo/config';
type ConfigPluginProps = {
    supportedLocales: string[] | {
        ios?: string[];
        android?: string[];
    };
};
declare function withAppLanguageSetting(config: ExpoConfig, data: ConfigPluginProps): ExpoConfig;
export default withAppLanguageSetting;
