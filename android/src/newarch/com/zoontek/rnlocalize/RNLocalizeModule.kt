package com.zoontek.rnlocalize

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RNLocalizeModuleImpl.NAME)
class RNLocalizeModule(reactContext: ReactApplicationContext) :
  NativeRNLocalizeSpec(reactContext) {

  override fun getName(): String {
    return RNLocalizeModuleImpl.NAME
  }

  override fun getCalendar(): String {
    return RNLocalizeModuleImpl.getCalendar()
  }

  override fun getCountry(): String {
    return RNLocalizeModuleImpl.getCountry(reactApplicationContext)
  }

  override fun getCurrencies(): WritableArray {
    return RNLocalizeModuleImpl.getCurrencies(reactApplicationContext)
  }

  override fun getLocales(): WritableArray {
    return RNLocalizeModuleImpl.getLocales(reactApplicationContext)
  }

  override fun getNumberFormatSettings(): WritableMap {
    return RNLocalizeModuleImpl.getNumberFormatSettings(reactApplicationContext)
  }

  override fun getTemperatureUnit(): String {
    return RNLocalizeModuleImpl.getTemperatureUnit(reactApplicationContext)
  }

  override fun getTimeZone(): String {
    return RNLocalizeModuleImpl.getTimeZone()
  }

  override fun uses24HourClock(): Boolean {
    return RNLocalizeModuleImpl.uses24HourClock(reactApplicationContext)
  }

  override fun usesMetricSystem(): Boolean {
    return RNLocalizeModuleImpl.usesMetricSystem(reactApplicationContext)
  }

  override fun usesAutoDateAndTime(): Boolean {
    return RNLocalizeModuleImpl.usesAutoDateAndTime(reactApplicationContext)
  }

  override fun usesAutoTimeZone(): Boolean {
    return RNLocalizeModuleImpl.usesAutoTimeZone(reactApplicationContext)
  }

  override fun openAppLanguageSettings(promise: Promise) {
    RNLocalizeModuleImpl.openAppLanguageSettings(reactApplicationContext, promise)
  }
}
