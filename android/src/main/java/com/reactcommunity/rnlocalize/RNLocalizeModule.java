package com.reactcommunity.rnlocalize;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.os.Build;
import android.os.LocaleList;
import android.text.TextUtils;
import android.text.format.DateFormat;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

import java.lang.IllegalArgumentException;
import java.text.DecimalFormatSymbols;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Currency;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

import javax.annotation.Nullable;

@ReactModule(name = RNLocalizeModule.MODULE_NAME)
public class RNLocalizeModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

  static final String MODULE_NAME = "RNLocalize";

  private final List<String> USES_FAHRENHEIT =
      Arrays.asList("BS", "BZ", "KY", "PR", "PW", "US");
  private final List<String> USES_IMPERIAL=
      Arrays.asList("LR", "MM", "US");
  private final List<String> USES_RTL_LAYOUT =
      Arrays.asList("ar", "ckb", "fa", "he", "ks", "lrc", "mzn", "ps", "ug", "ur", "yi");

  private boolean applicationIsPaused = false;
  private boolean emitChangeOnResume = false;

  public RNLocalizeModule(ReactApplicationContext reactContext) {
    super(reactContext);

    IntentFilter filter = new IntentFilter();
    filter.addAction(Intent.ACTION_LOCALE_CHANGED);
    filter.addAction(Intent.ACTION_TIME_CHANGED);
    filter.addAction(Intent.ACTION_TIMEZONE_CHANGED);

    BroadcastReceiver receiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        if (intent.getAction() != null) {
          onLocalizationDidChange();
        }
      }
    };

    reactContext.addLifecycleEventListener(this);
    reactContext.registerReceiver(receiver, filter);
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @Override
  public @Nullable Map<String, Object> getConstants() {
    HashMap<String, Object> constants = new HashMap<>();
    constants.put("initialConstants", getExported());

    return constants;
  }

  private void onLocalizationDidChange() {
    if (applicationIsPaused) {
      emitChangeOnResume = true;
    } else {
      emitLocalizationDidChange();
    }
  }

  @Override
  public void onHostResume() {
    applicationIsPaused = false;

    if (emitChangeOnResume) {
      emitLocalizationDidChange();
      emitChangeOnResume = false;
    }
  }

  @Override
  public void onHostPause() {
    applicationIsPaused = true;
  }

  @Override
  public void onHostDestroy() {}

  private void emitLocalizationDidChange() {
    if (getReactApplicationContext().hasActiveCatalystInstance()) {
      getReactApplicationContext()
          .getJSModule(RCTDeviceEventEmitter.class)
          .emit("localizationDidChange", getExported());
    }
  }

  private List<Locale> getLocales() {
    List<Locale> locales = new ArrayList<>();
    Configuration config = getReactApplicationContext()
        .getResources()
        .getConfiguration();

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
      locales.add(config.locale);
    } else {
      LocaleList localeList = config.getLocales();

      for (int i = 0; i < localeList.size(); i++) {
        locales.add(localeList.get(i));
      }
    }

    return locales;
  }

  private String getLanguageCode(Locale locale) {
    String languageCode = locale.getLanguage();

    switch (languageCode) {
      case "iw":
        return "he";
      case "in":
        return "id";
      case "ji":
        return "yi";
    }

    return languageCode;
  }

  private @Nullable String getScriptCode(Locale locale) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      String scriptCode = locale.getScript();
      return scriptCode.equals("") ? null : scriptCode;
    }
    return null;
  }

  private String getCountryCode(Locale locale, String fallback) {
    String countryCode = locale.getCountry();
    return countryCode == null || countryCode.equals("") ? fallback : countryCode;
  }

  private String getCurrencyCode(Locale locale, String fallback) {
    try {
      Currency currency = Currency.getInstance(locale);
      return currency == null ? fallback : currency.getCurrencyCode();
    } catch (IllegalArgumentException e) {
      return fallback;
    }
  }

  private boolean getIsRTL(Locale locale) {
    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1
        ? TextUtils.getLayoutDirectionFromLocale(locale) == View.LAYOUT_DIRECTION_RTL
        : USES_RTL_LAYOUT.contains(getLanguageCode(locale));
  }

  private String getTemperatureUnit(Locale locale) {
    return USES_FAHRENHEIT.contains(getCountryCode(locale, "US"))
        ? "fahrenheit" : "celsius";
  }

  private boolean getUsesMetricSystem(Locale locale) {
    return !USES_IMPERIAL.contains(getCountryCode(locale, "US"));
  }

  private WritableMap getNumberFormatSettings(Locale locale) {
    WritableMap settings = Arguments.createMap();
    DecimalFormatSymbols symbols = new DecimalFormatSymbols(locale);

    settings.putString("decimalSeparator", String.valueOf(symbols.getDecimalSeparator()));
    settings.putString("groupingSeparator", String.valueOf(symbols.getGroupingSeparator()));

    return settings;
  }

  private WritableMap getExported() {
    List<Locale> deviceLocales = getLocales();
    List<String> currenciesCache = new ArrayList<>();
    Locale currentLocale = deviceLocales.get(0);
    String currentCountryCode = getCountryCode(currentLocale, "US");

    WritableArray locales = Arguments.createArray();
    WritableArray currencies = Arguments.createArray();

    for (Locale locale: deviceLocales) {
      String languageCode = getLanguageCode(locale);
      String scriptCode = getScriptCode(locale);
      String countryCode = getCountryCode(locale, currentCountryCode);
      String currencyCode = getCurrencyCode(locale, "USD");

      if (!currenciesCache.contains(currencyCode)) {
        currenciesCache.add(currencyCode);
        currencies.pushString(currencyCode);
      }

      WritableMap result = Arguments.createMap();
      String languageTag = languageCode;

      result.putString("languageCode", languageCode);
      result.putString("countryCode", countryCode);
      result.putBoolean("isRTL", getIsRTL(locale));

      if (scriptCode != null) {
        languageTag += "-" + scriptCode;
        result.putString("scriptCode", scriptCode);
      }

      languageTag += "-" + countryCode;
      result.putString("languageTag", languageTag);

      locales.pushMap(result);
    }

    WritableMap exported = Arguments.createMap();

    exported.putString("calendar", "gregorian");
    exported.putString("country", currentCountryCode);
    exported.putArray("currencies", currencies);
    exported.putArray("locales", locales);
    exported.putMap("numberFormatSettings", getNumberFormatSettings(currentLocale));
    exported.putString("temperatureUnit", getTemperatureUnit(currentLocale));
    exported.putString("timeZone", TimeZone.getDefault().getID());
    exported.putBoolean("uses24HourClock", DateFormat.is24HourFormat(getReactApplicationContext()));
    exported.putBoolean("usesMetricSystem", getUsesMetricSystem(currentLocale));

    return exported;
  }
}
