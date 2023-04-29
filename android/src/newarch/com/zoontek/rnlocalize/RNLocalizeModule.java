package com.zoontek.rnlocalize;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = RNLocalizeModuleImpl.NAME)
public class RNLocalizeModule extends NativeRNLocalizeSpec {

  public RNLocalizeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return RNLocalizeModuleImpl.NAME;
  }

  @Override
  public String getCalendar() {
    return RNLocalizeModuleImpl.getCalendar();
  }

  @Override
  public String getCountry() {
    return RNLocalizeModuleImpl.getCountry(getReactApplicationContext());
  }

  @Override
  public WritableArray getCurrencies() {
    return RNLocalizeModuleImpl.getCurrencies(getReactApplicationContext());
  }

  @Override
  public WritableArray getLocales() {
    return RNLocalizeModuleImpl.getLocales(getReactApplicationContext());
  }

  @Override
  public WritableMap getNumberFormatSettings() {
    return RNLocalizeModuleImpl.getNumberFormatSettings(getReactApplicationContext());
  }

  @Override
  public String getTemperatureUnit() {
    return RNLocalizeModuleImpl.getTemperatureUnit(getReactApplicationContext());
  }

  @Override
  public String getTimeZone() {
    return RNLocalizeModuleImpl.getTimeZone();
  }

  @Override
  public boolean uses24HourClock() {
    return RNLocalizeModuleImpl.uses24HourClock(getReactApplicationContext());
  }

  @Override
  public boolean usesMetricSystem() {
    return RNLocalizeModuleImpl.usesMetricSystem(getReactApplicationContext());
  }

  @Override
  public Boolean usesAutoDateAndTime() {
    return RNLocalizeModuleImpl.usesAutoDateAndTime(getReactApplicationContext());
  }

  @Override
  public Boolean usesAutoTimeZone() {
    return RNLocalizeModuleImpl.usesAutoTimeZone(getReactApplicationContext());
  }
}
