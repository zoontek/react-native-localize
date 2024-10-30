package com.zoontek.rnlocalize;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = RNLocalizeModuleImpl.NAME)
public class RNLocalizeModule extends NativeRNLocalizeSpec {
  private final RNLocalizeModuleImpl moduleImpl;

  public RNLocalizeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.moduleImpl = new RNLocalizeModuleImpl(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return RNLocalizeModuleImpl.NAME;
  }

  @Override
  public String getCalendar() {
    return moduleImpl.getCalendar();
  }

  @Override
  public String getCountry() {
    return moduleImpl.getCountry();
  }

  @Override
  public WritableArray getCurrencies() {
    return moduleImpl.getCurrencies();
  }

  @Override
  public WritableArray getLocales() {
    return moduleImpl.getLocales();
  }

  @Override
  public WritableMap getNumberFormatSettings() {
    return moduleImpl.getNumberFormatSettings();
  }

  @Override
  public String getTemperatureUnit() {
    return moduleImpl.getTemperatureUnit();
  }

  @Override
  public String getTimeZone() {
    return moduleImpl.getTimeZone();
  }

  @Override
  public boolean uses24HourClock() {
    return moduleImpl.uses24HourClock();
  }

  @Override
  public boolean usesMetricSystem() {
    return moduleImpl.usesMetricSystem();
  }

  @Override
  public Boolean usesAutoDateAndTime() {
    return moduleImpl.usesAutoDateAndTime();
  }

  @Override
  public Boolean usesAutoTimeZone() {
    return moduleImpl.usesAutoTimeZone();
  }

  @Override
  public void setApplicationLocales(ReadableArray locales) {
    moduleImpl.setApplicationLocales(locales);
  }

  @Override
  public WritableArray getApplicationLocales() {
    return moduleImpl.getApplicationLocales();
  }

  @Override
  public void addListener(String eventName) {}

  @Override
  public void removeListeners(double count) {}

}
