package com.zoontek.rnlocalize;

import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.res.Configuration;
import android.icu.number.LocalizedNumberFormatter;
import android.icu.number.NumberFormatter;
import android.icu.util.MeasureUnit;
import android.os.Build;
import android.provider.Settings;
import android.text.TextUtils;
import android.text.format.DateFormat;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.core.os.LocaleListCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.lang.reflect.Method;
import java.text.DecimalFormatSymbols;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Currency;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.TimeZone;

public class RNLocalizeModuleImpl {

  public static final String NAME = "RNLocalize";

  private static final List<String> USES_FAHRENHEIT =
    Arrays.asList("BS", "BZ", "KY", "PR", "PW", "US");
  private static final List<String> USES_IMPERIAL=
    Arrays.asList("LR", "MM", "US");

  // Internal

  private static @NonNull String createLanguageTag(@NonNull String languageCode,
                                                   @NonNull String scriptCode,
                                                   @NonNull String countryCode) {
    String languageTag = languageCode;

    if (!TextUtils.isEmpty(scriptCode)) {
      languageTag += "-" + scriptCode;
    }

    return languageTag + "-" + countryCode;
  }

  private static @NonNull String getCountryCodeForLocale(Locale locale) {
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

  private static @NonNull String getCurrencyCodeForLocale(@NonNull Locale locale) {
    try {
      Currency currency = Currency.getInstance(locale);
      return currency == null ? "" : currency.getCurrencyCode();
    } catch (Exception ignored) {
      return "";
    }
  }

  private static @NonNull String getLanguageCodeForLocale(@NonNull Locale locale) {
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

  private static @NonNull String getScriptCodeForLocale(@NonNull Locale locale) {
    String script = locale.getScript();
    return TextUtils.isEmpty(script) ? "" : script;
  }

  private static @NonNull Locale getSystemLocale(ReactApplicationContext reactContext) {
    Configuration config = reactContext
      .getResources()
      .getConfiguration();

    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.N
      ? config.getLocales().get(0)
      : config.locale;
  }

  private static @NonNull List<Locale> getSystemLocales(ReactApplicationContext reactContext) {
    List<Locale> locales = new ArrayList<>();

    Configuration config = reactContext
      .getResources()
      .getConfiguration();

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
      locales.add(config.locale);
      return locales;
    }

    LocaleListCompat list = LocaleListCompat.getDefault();

    for (int i = 0; i < list.size(); i++) {
      locales.add(list.get(i));
    }

    return locales;
  }

  private static @NonNull String getMiuiRegionCode() {
    try {
      @SuppressLint("PrivateApi")
      Class<?> systemProperties = Class.forName("android.os.SystemProperties");
      Method get = systemProperties.getMethod("get", String.class);

      return (String) Objects.requireNonNull(get.invoke(systemProperties, "ro.miui.region"));
    } catch (Exception ignored) {
      return "";
    }
  }

  // Implementation

  public static @NonNull String getCalendar() {
    return "gregorian";
  }

  public static @NonNull String getCountry(ReactApplicationContext reactContext) {
    String miuiRegionCode = getMiuiRegionCode();

    if (!TextUtils.isEmpty((miuiRegionCode))) {
      return miuiRegionCode;
    }

    Locale systemLocale = getSystemLocale(reactContext);
    String countryCode = getCountryCodeForLocale(systemLocale);

    if (TextUtils.isEmpty(countryCode)) {
      return "US";
    }

    return countryCode;
  }

  public static @NonNull WritableArray getCurrencies(ReactApplicationContext reactContext) {
    List<Locale> systemLocales = getSystemLocales(reactContext);
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

  public static @NonNull WritableArray getLocales(ReactApplicationContext reactContext) {
    List<Locale> systemLocales = getSystemLocales(reactContext);
    List<String> languageTagsList = new ArrayList<>();
    WritableArray locales = Arguments.createArray();
    String currentCountryCode = getCountry(reactContext);

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
      locale.putBoolean("isRTL",
        TextUtils.getLayoutDirectionFromLocale(systemLocale) == View.LAYOUT_DIRECTION_RTL);

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

  public static @NonNull WritableMap getNumberFormatSettings(ReactApplicationContext reactContext) {
    Locale systemLocale = getSystemLocale(reactContext);
    DecimalFormatSymbols symbols = new DecimalFormatSymbols(systemLocale);
    WritableMap settings = Arguments.createMap();

    settings.putString("decimalSeparator", String.valueOf(symbols.getDecimalSeparator()));
    settings.putString("groupingSeparator", String.valueOf(symbols.getGroupingSeparator()));

    return settings;
  }

  public static @NonNull String getTemperatureUnit(ReactApplicationContext reactContext) {
    // https://github.com/androidx/androidx/blob/androidx-main/core/core/src/main/java/androidx/core/text/util/LocalePreferences.java
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      Locale systemLocale = getSystemLocale(reactContext);

      LocalizedNumberFormatter formatter = NumberFormatter.with()
        .usage("weather")
        .unit(MeasureUnit.CELSIUS)
        .locale(systemLocale);

      String unit = formatter
        .format(1)
        .getOutputUnit()
        .getIdentifier();

      return unit.startsWith("fahrenhe") ? "fahrenheit" : "celsius";
    }

    String currentCountryCode = getCountry(reactContext);
    return USES_FAHRENHEIT.contains(currentCountryCode) ? "fahrenheit" : "celsius";
  }

  public static @NonNull String getTimeZone() {
    return TimeZone.getDefault().getID();
  }

  public static boolean uses24HourClock(ReactApplicationContext reactContext) {
    return DateFormat.is24HourFormat(reactContext);
  }

  public static boolean usesMetricSystem(ReactApplicationContext reactContext) {
    String currentCountryCode = getCountry(reactContext);
    return !USES_IMPERIAL.contains(currentCountryCode);
  }

  public static boolean usesAutoDateAndTime(ReactApplicationContext reactContext) {
    ContentResolver resolver = reactContext.getContentResolver();
    return Settings.Global.getInt(resolver, Settings.Global.AUTO_TIME, 0) != 0;
  }

  public static boolean usesAutoTimeZone(ReactApplicationContext reactContext) {
    ContentResolver resolver = reactContext.getContentResolver();
    return Settings.Global.getInt(resolver, Settings.Global.AUTO_TIME_ZONE, 0) != 0;
  }
}
