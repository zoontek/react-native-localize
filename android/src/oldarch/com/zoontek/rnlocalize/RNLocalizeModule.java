package com.zoontek.rnlocalize;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import java.util.ArrayList;
import java.util.List;

@ReactModule(name = RNLocalizeModuleImpl.NAME)
public class RNLocalizeModule extends ReactContextBaseJavaModule {
  private final RNLocalizeModuleImpl moduleImpl;

  public RNLocalizeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.moduleImpl = new RNLocalizeModuleImpl(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return RNLocalizeModuleImpl.NAME;
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getCalendar() {
    return moduleImpl.getCalendar();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getCountry() {
    return moduleImpl.getCountry();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public WritableArray getCurrencies() {
    return moduleImpl.getCurrencies();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public WritableArray getLocales() {
    return moduleImpl.getLocales();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public WritableMap getNumberFormatSettings() {
    return moduleImpl.getNumberFormatSettings();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getTemperatureUnit() {
    return moduleImpl.getTemperatureUnit();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getTimeZone() {
    return moduleImpl.getTimeZone();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean uses24HourClock() {
    return moduleImpl.uses24HourClock();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean usesMetricSystem() {
    return moduleImpl.usesMetricSystem();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public Boolean usesAutoDateAndTime() {
    return moduleImpl.usesAutoDateAndTime();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public Boolean usesAutoTimeZone() {
    return moduleImpl.usesAutoTimeZone();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public void setApplicationLocales(ReadableArray languageTagsArray) {
    moduleImpl.setApplicationLocales(languageTagsArray);
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public WritableArray getApplicationLocales() {
    return moduleImpl.getApplicationLocales();
  }

  @ReactMethod
  public void addListener(String eventName) {}

  @ReactMethod
  public void removeListeners(double count) {}
}
