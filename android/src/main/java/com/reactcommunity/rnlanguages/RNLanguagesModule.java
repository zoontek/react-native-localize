package com.reactcommunity.rnlanguages;

import android.os.Build;
import android.os.LocaleList;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Nullable;

public class RNLanguagesModule extends ReactContextBaseJavaModule {

  private final LanguagesBroadcastReceiver mLanguagesBroadcastReceiver;

  public RNLanguagesModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mLanguagesBroadcastReceiver = new LanguagesBroadcastReceiver();
    registerReceiver();
  }

  @Override
  public String getName() {
    return "RNLanguages";
  }

  @Override
  public @Nullable Map<String, Object> getConstants() {
    HashMap<String, Object> constants = new HashMap<>();
    WritableArray languages = getLanguages();

    constants.put("language", languages.getString(0));
    constants.put("languages", languages);

    return constants;
  }

  private void sendLanguagesChangedEvent() {
    WritableMap map = Arguments.createMap();
    WritableArray languages = getLanguages();

    map.putString("language", languages.getString(0));
    map.putArray("languages", languages);

    getReactApplicationContext().getJSModule(RCTDeviceEventEmitter.class)
        .emit("languagesDidChange", map);
  }

  private WritableArray getLanguages() {
    WritableArray languages = Arguments.createArray();

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      LocaleList locales = getReactApplicationContext()
          .getResources().getConfiguration().getLocales();

      for (int i = 0; i < locales.size(); i++) {
        languages.pushString(toLanguageTag(locales.get(i)));
      }
    } else {
      Locale locale = getReactApplicationContext()
          .getResources().getConfiguration().locale;

      languages.pushString(toLanguageTag(locale));
    }

    return languages;
  }

  private String toLanguageTag(Locale locale) {
    String languageTag;

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      languageTag = locale.toLanguageTag();
    } else {
      StringBuilder builder = new StringBuilder();
      builder.append(locale.getLanguage());

      if (locale.getCountry() != null) {
        builder.append("-");
        builder.append(locale.getCountry());
      }

      languageTag = builder.toString();
    }

    if (languageTag.matches("^(iw|in|ji).*")) {
      languageTag = languageTag
        .replace("iw","he")
        .replace("in","id")
        .replace("ji","yi");
    }

    return languageTag;
  }

  private void registerReceiver() {
    IntentFilter filter = new IntentFilter(Intent.ACTION_LOCALE_CHANGED);
    getReactApplicationContext().registerReceiver(mLanguagesBroadcastReceiver, filter);
  }

  /**
   * Class that receives intents whenever the languages changes.
   */
  private class LanguagesBroadcastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
      if (intent.getAction().equals(Intent.ACTION_LOCALE_CHANGED)) {
        sendLanguagesChangedEvent();
      }
    }
  }
}
