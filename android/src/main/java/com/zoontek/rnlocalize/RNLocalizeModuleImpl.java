package com.zoontek.rnlocalize;

import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.res.Configuration;
import android.icu.number.LocalizedNumberFormatter;
import android.icu.number.NumberFormatter;
import android.icu.util.MeasureUnit;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.text.TextUtils;
import android.text.format.DateFormat;
import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.os.LocaleListCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.reflect.Method;
import java.text.DecimalFormatSymbols;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Currency;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.TimeZone;

public class RNLocalizeModuleImpl  {
  private final ReactApplicationContext reactContext;
  private LocaleListCompat currentLocaleList;

  public RNLocalizeModuleImpl(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
    this.currentLocaleList = AppCompatDelegate.getApplicationLocales();

    RNLocalizeConfigManager.shared.delegate = this::onConfigurationChanged;
  }

  public static final String NAME = "RNLocalize";

  private static final List<String> USES_FAHRENHEIT =
    Arrays.asList("BS", "BZ", "KY", "PR", "PW", "US");
  private static final List<String> USES_IMPERIAL=
    Arrays.asList("LR", "MM", "US");
  private static final String LOCALE_CHANGE_EVENT_NAME = "localeChange";

  // Internal

  private void sendEvent(String eventName, WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

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

  private @NonNull String getLanguageCodeForLocale(@NonNull Locale locale) {
    String language = locale.getLanguage();

    return switch (language) {
      case "iw" -> "he";
      case "in" -> "id";
      case "ji" -> "yi";
      default -> language;
    };
  }

  private @NonNull String getScriptCodeForLocale(@NonNull Locale locale) {
    String script = locale.getScript();
    return TextUtils.isEmpty(script) ? "" : script;
  }

  private @NonNull Locale getSystemLocale() {
    Configuration config = reactContext
      .getResources()
      .getConfiguration();

    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.N
      ? config.getLocales().get(0)
      : config.locale;
  }

  private @NonNull List<Locale> getSystemLocales() {
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

  private @NonNull String getMiuiRegionCode() {
    try {
      @SuppressLint("PrivateApi")
      Class<?> systemProperties = Class.forName("android.os.SystemProperties");
      Method get = systemProperties.getMethod("get", String.class);

      return (String) Objects.requireNonNull(get.invoke(systemProperties, "ro.miui.region"));
    } catch (Exception ignored) {
      return "";
    }
  }

  private @NonNull WritableArray getJsLocales(List<Locale> locales) {
    List<String> languageTagsList = new ArrayList<>();
    WritableArray jsLocales = Arguments.createArray();
    String currentCountryCode = getCountry();

    for (Locale locale: locales) {
      String languageCode = getLanguageCodeForLocale(locale);
      String scriptCode = getScriptCodeForLocale(locale);
      String countryCode = getCountryCodeForLocale(locale);

      if (TextUtils.isEmpty(countryCode)) {
        countryCode = currentCountryCode;
      }

      String languageTag = createLanguageTag(languageCode, scriptCode, countryCode);
      WritableMap jsLocale = Arguments.createMap();

      jsLocale.putString("languageCode", languageCode);
      jsLocale.putString("countryCode", countryCode);
      jsLocale.putString("languageTag", languageTag);
      jsLocale.putBoolean("isRTL",
        TextUtils.getLayoutDirectionFromLocale(locale) == View.LAYOUT_DIRECTION_RTL);

      if (!TextUtils.isEmpty(scriptCode)) {
        jsLocale.putString("scriptCode", scriptCode);
      }

      if (!languageTagsList.contains(languageTag)) {
        languageTagsList.add(languageTag);
        jsLocales.pushMap(jsLocale);
      }
    }

    return jsLocales;
  }


  private void onConfigurationChanged(Configuration newConfig) {
    LocaleListCompat localeListCompat = AppCompatDelegate.getApplicationLocales();
    if(!currentLocaleList.equals(localeListCompat)) {
      // send event
      WritableMap payload = Arguments.createMap();
      payload.putArray("newLocales", getApplicationLocales());
      sendEvent(LOCALE_CHANGE_EVENT_NAME, payload);

      // update current locale list
      this.currentLocaleList = localeListCompat;
    }
  }

  // Implementation

  public @NonNull WritableArray getApplicationLocales() {
    LocaleListCompat localeListCompat = AppCompatDelegate.getApplicationLocales();
    Log.d(localeListCompat.toLanguageTags(), "rami");
    Log.d(localeListCompat.toString(), "rami");
    List<Locale> locales = new ArrayList<>();

    for (int i = 0; i < localeListCompat.size(); i++) {
      locales.add(localeListCompat.get(i));
    }
    return getJsLocales(locales);
  }

  public void setApplicationLocales(@NonNull ReadableArray languageTagsArray) {
    List<String> languageTags = new ArrayList<>();
    for (int i = 0; i < languageTagsArray.size(); i++) {
      languageTags.add(languageTagsArray.getString(i));
    }
    // Get a handler that can be used to post to the main thread
    Handler mainHandler = new Handler(Looper.getMainLooper());

    Runnable myRunnable = new Runnable() {
      @Override
      public void run() {
        AppCompatDelegate.setApplicationLocales(
          LocaleListCompat.forLanguageTags(String.join(",", languageTags)))
        ;
      } // This is your code
    };
    mainHandler.post(myRunnable);
  }

  public @NonNull String getCalendar() {
    return "gregorian";
  }

  public @NonNull String getCountry() {
    String miuiRegionCode = getMiuiRegionCode();

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

  public @NonNull WritableArray getCurrencies() {
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

  public @NonNull WritableArray getLocales() {
    List<Locale> systemLocales = getSystemLocales();

    return getJsLocales(systemLocales);
  }

  public @NonNull WritableMap getNumberFormatSettings() {
    Locale systemLocale = getSystemLocale();
    DecimalFormatSymbols symbols = new DecimalFormatSymbols(systemLocale);
    WritableMap settings = Arguments.createMap();

    settings.putString("decimalSeparator", String.valueOf(symbols.getDecimalSeparator()));
    settings.putString("groupingSeparator", String.valueOf(symbols.getGroupingSeparator()));

    return settings;
  }

  public @NonNull String getTemperatureUnit() {
    // https://github.com/androidx/androidx/blob/androidx-main/core/core/src/main/java/androidx/core/text/util/LocalePreferences.java
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      Locale systemLocale = getSystemLocale();

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

    String currentCountryCode = getCountry();
    return USES_FAHRENHEIT.contains(currentCountryCode) ? "fahrenheit" : "celsius";
  }

  public @NonNull String getTimeZone() {
    return TimeZone.getDefault().getID();
  }

  public boolean uses24HourClock() {
    return DateFormat.is24HourFormat(reactContext);
  }

  public boolean usesMetricSystem() {
    String currentCountryCode = getCountry();
    return !USES_IMPERIAL.contains(currentCountryCode);
  }

  public boolean usesAutoDateAndTime() {
    ContentResolver resolver = reactContext.getContentResolver();
    return Settings.Global.getInt(resolver, Settings.Global.AUTO_TIME, 0) != 0;
  }

  public boolean usesAutoTimeZone() {
    ContentResolver resolver = reactContext.getContentResolver();
    return Settings.Global.getInt(resolver, Settings.Global.AUTO_TIME_ZONE, 0) != 0;
  }
}
