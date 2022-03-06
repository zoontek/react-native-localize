package com.zoontek.rnlocalize;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.os.Build;
import android.os.LocaleList;
import android.provider.Settings;
import android.text.TextUtils;
import android.text.format.DateFormat;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

import java.lang.reflect.Method;
import java.text.DecimalFormatSymbols;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Currency;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.TimeZone;

@ReactModule(name = RNLocalizeModule.MODULE_NAME)
public class RNLocalizeModule extends ReactContextBaseJavaModule {

  public static final String MODULE_NAME = "RNLocalize";

  private final List<String> USES_FAHRENHEIT =
    Arrays.asList("BS", "BZ", "KY", "PR", "PW", "US");
  private final List<String> USES_IMPERIAL=
    Arrays.asList("LR", "MM", "US");
  private final List<String> USES_RTL_LAYOUT =
    Arrays.asList("ar", "ckb", "fa", "he", "ks", "lrc", "mzn", "ps", "ug", "ur", "yi");

  private final @NonNull BroadcastReceiver mBroadcastReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      ReactApplicationContext reactContext = getReactApplicationContext();

      if (intent.getAction() != null &&
        reactContext.hasActiveCatalystInstance()) {
        reactContext
          .getJSModule(RCTDeviceEventEmitter.class)
          .emit("localizationDidChange", getExportedConstants());
      }
    }
  };

  public RNLocalizeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @Override
  public @Nullable Map<String, Object> getConstants() {
    HashMap<String, Object> constants = new HashMap<>();
    constants.put("initialConstants", getExportedConstants());

    return constants;
  }

  @Override
  public void initialize() {
    super.initialize();

    IntentFilter filter = new IntentFilter();

    filter.addAction(Intent.ACTION_LOCALE_CHANGED);
    filter.addAction(Intent.ACTION_DATE_CHANGED);
    filter.addAction(Intent.ACTION_TIME_CHANGED);
    filter.addAction(Intent.ACTION_TIMEZONE_CHANGED);

    getReactApplicationContext()
      .registerReceiver(mBroadcastReceiver, filter);
  }

  @Override
  public void onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy();

    getReactApplicationContext()
      .unregisterReceiver(mBroadcastReceiver);
  }

  @ReactMethod
  public void addListener(String eventName) {
    // Set up any upstream listeners or background tasks as necessary
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    // Remove upstream listeners, stop unnecessary background tasks
  }

  private @NonNull List<Locale> getLocales() {
    List<Locale> locales = new ArrayList<>();
    Configuration config = getReactApplicationContext()
      .getResources()
      .getConfiguration();

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
      locales.add(config.locale);
    } else {
      LocaleList list = config.getLocales();

      for (int i = 0; i < list.size(); i++) {
        locales.add(list.get(i));
      }
    }

    return locales;
  }

  private @NonNull String getLanguageCode(@NonNull Locale locale) {
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

  private @NonNull String getScriptCode(@NonNull Locale locale) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
      return "";
    }

    String script = locale.getScript();
    return TextUtils.isEmpty(script) ? "" : script;
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

  private @NonNull String getCountryCode(@NonNull Locale locale) {
    try {
      String country = locale.getCountry();

      if (country.equals("419")) {
        return "UN";
      }

      return TextUtils.isEmpty(country) ? "" : country;
    } catch (Exception ignored) {
      return "";
    }
  }

  private @NonNull String getRegionCode(@NonNull Locale locale) {
    String miuiRegion = getSystemProperty("ro.miui.region");

    if (!TextUtils.isEmpty(miuiRegion)) {
      return miuiRegion;
    }

    return getCountryCode(locale);
  }

  private @NonNull String getCurrencyCode(@NonNull Locale locale) {
    try {
      Currency currency = Currency.getInstance(locale);
      return currency == null ? "" : currency.getCurrencyCode();
    } catch (Exception ignored) {
      return "";
    }
  }

  private boolean getIsRTL(@NonNull Locale locale) {
    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1
      ? TextUtils.getLayoutDirectionFromLocale(locale) == View.LAYOUT_DIRECTION_RTL
      : USES_RTL_LAYOUT.contains(getLanguageCode(locale));
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

  private @NonNull WritableMap getNumberFormatSettings(@NonNull Locale locale) {
    WritableMap settings = Arguments.createMap();
    DecimalFormatSymbols symbols = new DecimalFormatSymbols(locale);

    settings.putString("decimalSeparator", String.valueOf(symbols.getDecimalSeparator()));
    settings.putString("groupingSeparator", String.valueOf(symbols.getGroupingSeparator()));

    return settings;
  }

  private boolean getUsesAutoDateAndTime() {
    ContentResolver resolver = getReactApplicationContext().getContentResolver();

    return (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1
      ? Settings.Global.getInt(resolver, Settings.Global.AUTO_TIME, 0)
      : Settings.System.getInt(resolver, Settings.System.AUTO_TIME, 0)) != 0;
  }

  private boolean getUsesAutoTimeZone() {
    ContentResolver resolver = getReactApplicationContext().getContentResolver();

    return (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1
      ? Settings.Global.getInt(resolver, Settings.Global.AUTO_TIME_ZONE, 0)
      : Settings.System.getInt(resolver, Settings.System.AUTO_TIME_ZONE, 0)) != 0;
  }

  private @NonNull WritableMap getExportedConstants() {
    List<Locale> deviceLocales = getLocales();
    Locale currentLocale = deviceLocales.get(0);
    String currentRegionCode = getRegionCode(currentLocale);

    if (TextUtils.isEmpty(currentRegionCode)) {
      currentRegionCode = "US";
    }

    List<String> languageTagsList = new ArrayList<>();
    List<String> currenciesList = new ArrayList<>();
    WritableArray locales = Arguments.createArray();
    WritableArray currencies = Arguments.createArray();

    for (Locale deviceLocale: deviceLocales) {
      String languageCode = getLanguageCode(deviceLocale);
      String scriptCode = getScriptCode(deviceLocale);
      String countryCode = getCountryCode(deviceLocale);
      String currencyCode = getCurrencyCode(deviceLocale);

      if (TextUtils.isEmpty(countryCode)) {
        countryCode = currentRegionCode;
      }

      String languageTag = createLanguageTag(languageCode, scriptCode, countryCode);

      WritableMap locale = Arguments.createMap();
      locale.putString("languageCode", languageCode);
      locale.putString("countryCode", countryCode);
      locale.putString("languageTag", languageTag);
      locale.putBoolean("isRTL", getIsRTL(deviceLocale));

      if (!TextUtils.isEmpty(scriptCode)) {
        locale.putString("scriptCode", scriptCode);
      }

      if (!languageTagsList.contains(languageTag)) {
        languageTagsList.add(languageTag);
        locales.pushMap(locale);
      }

      if (!TextUtils.isEmpty(currencyCode) && !currenciesList.contains(currencyCode)) {
        currenciesList.add(currencyCode);
        currencies.pushString(currencyCode);
      }
    }

    if (currencies.size() == 0) {
      currencies.pushString("USD");
    }

    WritableMap exported = Arguments.createMap();

    exported.putString("calendar", "gregorian");
    exported.putString("country", currentRegionCode);
    exported.putArray("currencies", currencies);
    exported.putArray("locales", locales);
    exported.putMap("numberFormatSettings", getNumberFormatSettings(currentLocale));
    exported.putString("temperatureUnit", USES_FAHRENHEIT.contains(currentRegionCode) ? "fahrenheit" : "celsius");
    exported.putString("timeZone", TimeZone.getDefault().getID());
    exported.putBoolean("uses24HourClock", DateFormat.is24HourFormat(getReactApplicationContext()));
    exported.putBoolean("usesAutoDateAndTime", getUsesAutoDateAndTime());
    exported.putBoolean("usesAutoTimeZone", getUsesAutoTimeZone());
    exported.putBoolean("usesMetricSystem", !USES_IMPERIAL.contains(currentRegionCode));

    return exported;
  }
}
