package com.zoontek.rnlocalize;

import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.res.Configuration;
import android.os.Build;
import android.os.LocaleList;
import android.provider.Settings;
import android.text.TextUtils;
import android.text.format.DateFormat;
import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import java.lang.reflect.Method;
import java.text.DecimalFormatSymbols;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Currency;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.TimeZone;

@ReactModule(name = RNLocalizeModule.NAME)
public class RNLocalizeModule extends ReactContextBaseJavaModule {

  public static final String NAME = "RNLocalize";

  private final List<String> USES_FAHRENHEIT =
    Arrays.asList("BS", "BZ", "KY", "PR", "PW", "US");
  private final List<String> USES_IMPERIAL=
    Arrays.asList("LR", "MM", "US");

  public RNLocalizeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }

  // Internal

  private @NonNull String createLanguageTag(@NonNull String languageCode,
                                            @NonNull String scriptCode,
                                            @NonNull String countryCode) {
    String languageTag = languageCode;

    if (!TextUtils.isEmpty(scriptCode)) {
      languageTag += "-" + scriptCode;
    }

    return languageTag + "-" + countryCode;
  }

  private @NonNull String getCountryCodeForLocale(Locale locale) {
    try {
      String countryCode = locale.getCountry();

      if (countryCode.equals("419")) {
        return "UN";
      }

      return TextUtils.isEmpty(countryCode) ? "" : countryCode.toUpperCase();
    } catch (Exception ignored) {
      return "";
    }
  }

  private @NonNull String getCurrencyCodeForLocale(@NonNull Locale locale) {
    try {
      Currency currency = Currency.getInstance(locale);
      return currency == null ? "" : currency.getCurrencyCode();
    } catch (Exception ignored) {
      return "";
    }
  }

  private boolean getIsRTLForLocale(@NonNull Locale locale) {
    return TextUtils.getLayoutDirectionFromLocale(locale) == View.LAYOUT_DIRECTION_RTL;
  }

  private @NonNull String getLanguageCodeForLocale(@NonNull Locale locale) {
    String language = locale.getLanguage();

    switch (language) {
      case "iw":
        return "he";
      case "in":
        return "id";
      case "ji":
        return "yi";
    }

    return language;
  }

  private @NonNull String getScriptCodeForLocale(@NonNull Locale locale) {
    String script = locale.getScript();
    return TextUtils.isEmpty(script) ? "" : script;
  }

  private @NonNull Locale getSystemLocale() {
    Configuration config = getReactApplicationContext()
      .getResources()
      .getConfiguration();

    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.N
      ? config.getLocales().get(0)
      : config.locale;
  }

  private @NonNull List<Locale> getSystemLocales() {
    List<Locale> locales = new ArrayList<>();

    Configuration config = getReactApplicationContext()
      .getResources()
      .getConfiguration();

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
      locales.add(config.locale);
      return locales;
    }

    LocaleList list = config.getLocales();

    for (int i = 0; i < list.size(); i++) {
      locales.add(list.get(i));
    }

    return locales;
  }

  private @NonNull String getSystemProperty(String key) {
    try {
      @SuppressLint("PrivateApi")
      Class<?> systemProperties = Class.forName("android.os.SystemProperties");
      Method get = systemProperties.getMethod("get", String.class);

      return (String) Objects.requireNonNull(get.invoke(systemProperties, key));
    } catch (Exception ignored) {
      return "";
    }
  }

  // Implementation

  private @NonNull String getCurrentCalendar() {
    return "gregorian";
  }

  private @NonNull String getCurrentCountryCode() {
    String miuiRegionCode = getSystemProperty("ro.miui.region");

    if (!TextUtils.isEmpty((miuiRegionCode))) {
      return miuiRegionCode;
    }

    Locale systemLocale = getSystemLocale();
    String countryCode = getCountryCodeForLocale(systemLocale);

    if (TextUtils.isEmpty(countryCode)) {
      return "US";
    }

    return countryCode;
  }

  private @NonNull WritableArray getCurrentCurrencies() {
    List<Locale> systemLocales = getSystemLocales();
    List<String> currenciesList = new ArrayList<>();
    WritableArray currencies = Arguments.createArray();

    for (Locale systemLocale: systemLocales) {
      String currencyCode = getCurrencyCodeForLocale(systemLocale);

      if (!TextUtils.isEmpty(currencyCode) && !currenciesList.contains(currencyCode)) {
        currenciesList.add(currencyCode);
        currencies.pushString(currencyCode);
      }
    }

    if (currencies.size() == 0) {
      currencies.pushString("USD");
    }

    return currencies;
  }

  private @NonNull WritableArray getCurrentLocales() {
    List<Locale> systemLocales = getSystemLocales();
    List<String> languageTagsList = new ArrayList<>();
    WritableArray locales = Arguments.createArray();
    String currentCountryCode = getCurrentCountryCode();

    for (Locale systemLocale: systemLocales) {
      String languageCode = getLanguageCodeForLocale(systemLocale);
      String scriptCode = getScriptCodeForLocale(systemLocale);
      String countryCode = getCountryCodeForLocale(systemLocale);

      if (TextUtils.isEmpty(countryCode)) {
        countryCode = currentCountryCode;
      }

      String languageTag = createLanguageTag(languageCode, scriptCode, countryCode);

      WritableMap locale = Arguments.createMap();
      locale.putString("languageCode", languageCode);
      locale.putString("countryCode", countryCode);
      locale.putString("languageTag", languageTag);
      locale.putBoolean("isRTL", getIsRTLForLocale(systemLocale));

      if (!TextUtils.isEmpty(scriptCode)) {
        locale.putString("scriptCode", scriptCode);
      }

      if (!languageTagsList.contains(languageTag)) {
        languageTagsList.add(languageTag);
        locales.pushMap(locale);
      }
    }

    return locales;
  }

  private @NonNull WritableMap getCurrentNumberFormatSettings() {
    Locale systemLocale = getSystemLocale();
    DecimalFormatSymbols symbols = new DecimalFormatSymbols(systemLocale);
    WritableMap settings = Arguments.createMap();

    settings.putString("decimalSeparator", String.valueOf(symbols.getDecimalSeparator()));
    settings.putString("groupingSeparator", String.valueOf(symbols.getGroupingSeparator()));

    return settings;
  }

  private @NonNull String getCurrentTemperatureUnit() {
    String currentCountryCode = getCurrentCountryCode();
    return USES_FAHRENHEIT.contains(currentCountryCode) ? "fahrenheit" : "celsius";
  }

  private @NonNull String getCurrentTimeZone() {
    return TimeZone.getDefault().getID();
  }

  private boolean getUses24HourClock() {
    return DateFormat.is24HourFormat(getReactApplicationContext());
  }

  private boolean getUsesAutoDateAndTime() {
    ContentResolver resolver = getReactApplicationContext().getContentResolver();
    return Settings.Global.getInt(resolver, Settings.Global.AUTO_TIME, 0) != 0;
  }

  private boolean getUsesAutoTimeZone() {
    ContentResolver resolver = getReactApplicationContext().getContentResolver();
    return Settings.Global.getInt(resolver, Settings.Global.AUTO_TIME_ZONE, 0) != 0;
  }

  private boolean getUsesMetricSystem() {
    String currentCountryCode = getCurrentCountryCode();
    return !USES_IMPERIAL.contains(currentCountryCode);
  }

  // Exposed

  @ReactMethod(isBlockingSynchronousMethod = true)
  private @NonNull String getCalendar() {
    return getCurrentCalendar();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  private @NonNull String getCountry() {
    return getCurrentCountryCode();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  private @NonNull WritableArray getCurrencies() {
    return getCurrentCurrencies();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  private @NonNull WritableArray getLocales() {
    return getCurrentLocales();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  private @NonNull WritableMap getNumberFormatSettings() {
    return getCurrentNumberFormatSettings();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  private @NonNull String getTemperatureUnit() {
    return getCurrentTemperatureUnit();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  private @NonNull String getTimeZone() {
    return getCurrentTimeZone();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  private boolean uses24HourClock() {
    return getUses24HourClock();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  private boolean usesAutoDateAndTime() {
    return getUsesAutoDateAndTime();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  private boolean usesAutoTimeZone() {
    return getUsesAutoTimeZone();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  private boolean usesMetricSystem() {
    return getUsesMetricSystem();
  }
}
