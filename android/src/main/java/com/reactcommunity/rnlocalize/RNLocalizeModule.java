package com.reactcommunity.rnlocalize;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
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
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Currency;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

import javax.annotation.Nullable;

public class RNLocalizeModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

  private static final List<String> USES_FAHRENHEIT_UNIT =
      Arrays.asList("BS", "BZ", "KY", "PR", "PW", "US");
  private static final List<String> USES_IMPERIAL_SYSTEM =
      Arrays.asList("LR", "MM", "US");
  private static final List<String> USES_RTL_LAYOUT =
      Arrays.asList("ar", "ckb", "fa", "he", "ks", "lrc", "mzn", "ps", "ug", "ur", "yi");

  private boolean applicationIsPaused = false;
  private boolean emitChangeOnResume = false;

  public RNLocalizeModule(ReactApplicationContext reactContext) {
    super(reactContext);

    IntentFilter filter = new IntentFilter();
    filter.addAction(Intent.ACTION_LOCALE_CHANGED);
    filter.addAction(Intent.ACTION_TIME_CHANGED);
    filter.addAction(Intent.ACTION_TIMEZONE_CHANGED);

    BroadcastReceiver mConfigReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        if (intent.getAction() != null)
          onLanguagesConfigDidChange();
      }
    };

    getReactApplicationContext().registerReceiver(mConfigReceiver, filter);
  }

  @Override
  public String getName() {
    return "RNLocalize";
  }

  @Override
  public @Nullable Map<String, Object> getConstants() {
    HashMap<String, Object> constants = new HashMap<>();
    constants.put("config", getConfig());

    return constants;
  }

  @Override
  public void initialize() {
    getReactApplicationContext().addLifecycleEventListener(this);
  }

  private void onLanguagesConfigDidChange() {
    if (applicationIsPaused) {
      emitChangeOnResume = true;
    } else {
      emitLanguagesConfigDidChange();
    }
  }

  @Override
  public void onHostResume() {
    applicationIsPaused = false;

    if (emitChangeOnResume) {
      emitLanguagesConfigDidChange();
      emitChangeOnResume = false;
    }
  }

  @Override
  public void onHostPause() {
    applicationIsPaused = true;
  }

  @Override
  public void onHostDestroy() {}

  private void emitLanguagesConfigDidChange() {
    getReactApplicationContext().getJSModule(RCTDeviceEventEmitter.class)
        .emit("languagesConfigDidChange", getConfig());
  }

  private List<Locale> getLocales() {
    List<Locale> locales = new ArrayList<>();

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      LocaleList localeList = getReactApplicationContext().getResources()
          .getConfiguration().getLocales();

      for (int i = 0; i < localeList.size(); i++)
        locales.add(localeList.get(i));
    } else {
      locales.add(getReactApplicationContext().getResources()
          .getConfiguration().locale);
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

  private String getScriptCode(Locale locale) {
    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP ? locale.getScript() : "";
  }

  private String getCountryCode(Locale locale, String fallback) {
    String countryCode = locale.getCountry();
    return countryCode != null ? countryCode : fallback;
  }

  private String getCurrencyCode(Locale locale, String fallback) {
    Currency currency = Currency.getInstance(locale);
    return currency != null ? currency.getCurrencyCode() : fallback;
  }

  private boolean getIsRTL(Locale locale) {
    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1
        ? TextUtils.getLayoutDirectionFromLocale(locale) == View.LAYOUT_DIRECTION_RTL
        : USES_RTL_LAYOUT.contains(getLanguageCode(locale));
  }

  private String concatCodes(String code1, String code2) {
    return code1 + (code2.equals("") ? code2 : "-" + code2);
  }

  private String getTemperatureUnit(Locale locale) {
    return USES_FAHRENHEIT_UNIT.contains(getCountryCode(locale, "US")) ? "fahrenheit" : "celsius";
  }

  private boolean getUses24HourClock() {
    return DateFormat.is24HourFormat(getReactApplicationContext());
  }

  private boolean getUsesMetricSystem(Locale locale) {
    return !USES_IMPERIAL_SYSTEM.contains(getCountryCode(locale,"US"));
  }

  private WritableMap getConfig() {
    List<HashMap<String, Object>> extracteds = new ArrayList<>();
    List<String> fallbacks = new ArrayList<>();
    List<Locale> locales = getLocales();
    List<String> currenciesCache = new ArrayList<>();

    Locale currentLocale = locales.get(0);
    String currentCountryCode = getCountryCode(currentLocale, "US");

    WritableArray languages = Arguments.createArray();
    WritableArray currencies = Arguments.createArray();

    for (int i = 0; i < locales.size(); i++) {
      HashMap<String, Object> extracted = new HashMap<>();
      Locale locale = locales.get(i);

      String languageCode = getLanguageCode(locale);
      String partialCode = concatCodes(languageCode, getScriptCode(locale));
      String currencyCode = getCurrencyCode(locale, "USD");
      String countryCode = getCountryCode(locale, currentCountryCode);

      if (!currenciesCache.contains(currencyCode)) {
        currenciesCache.add(currencyCode);
        currencies.pushString(currencyCode);
      }

      extracted.put("languageCode", languageCode);
      extracted.put("partialCode", partialCode);
      extracted.put("fullCode", concatCodes(partialCode, countryCode));
      extracted.put("isRTL", getIsRTL(locale));

      extracteds.add(extracted);
    }

    int extractedsSize = extracteds.size();

    for (int i = 0; i < extractedsSize; i++) {
      HashMap<String, Object> extracted = extracteds.get(i);
      String languageCode = (String) extracted.get("languageCode");
      String partialCode = (String) extracted.get("partialCode");
      boolean isRTL = (boolean) extracted.get("isRTL");

      WritableMap language = Arguments.createMap();
      language.putString("code", (String) extracted.get("fullCode"));
      language.putBoolean("isRTL", isRTL);
      language.putBoolean("isFallback", false);

      languages.pushMap(language);

      String nextLanguageCode = null;
      String nextPartialCode = null;

      if (i + 1 < extractedsSize) {
        nextLanguageCode = (String) extracteds.get(i + 1).get("languageCode");
        nextPartialCode = (String) extracteds.get(i + 1).get("partialCode");
      }

      if (!partialCode.equals(languageCode)) {
        if (partialCode.equals(nextPartialCode)) {
          continue;
        }

        if (!fallbacks.contains(partialCode)) {
          fallbacks.add(partialCode);

          WritableMap fallback = Arguments.createMap();
          fallback.putString("code", partialCode);
          fallback.putBoolean("isRTL", isRTL);
          fallback.putBoolean("isFallback", true);

          languages.pushMap(fallback);
        }
      }

      if (!languageCode.equals(nextPartialCode) && !languageCode.equals(nextLanguageCode)) {
        if (!fallbacks.contains(languageCode)) {
          fallbacks.add(languageCode);

          WritableMap fallback = Arguments.createMap();
          fallback.putString("code", languageCode);
          fallback.putBoolean("isRTL", isRTL);
          fallback.putBoolean("isFallback", true);

          languages.pushMap(fallback);
        }
      }
    }

    WritableMap config = Arguments.createMap();
    config.putArray("languages", languages);
    config.putArray("currencies", currencies);
    config.putString("calendar", "gregorian");
    config.putString("country", currentCountryCode);
    config.putString("temperatureUnit", getTemperatureUnit(currentLocale));
    config.putString("timeZone", TimeZone.getDefault().getID());
    config.putBoolean("uses24HourClock", getUses24HourClock());
    config.putBoolean("usesMetricSystem", getUsesMetricSystem(currentLocale));

    return config;
  }
}
