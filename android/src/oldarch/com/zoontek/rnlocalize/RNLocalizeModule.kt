package com.zoontek.rnlocalize

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RNLocalizeModuleImpl.NAME)
class RNLocalizeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return RNLocalizeModuleImpl.NAME
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun getCalendar(): String {
    return RNLocalizeModuleImpl.getCalendar()
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun getCountry(): String {
    return RNLocalizeModuleImpl.getCountry(reactApplicationContext)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun getCurrencies(): WritableArray {
    return RNLocalizeModuleImpl.getCurrencies(reactApplicationContext)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun getLocales(): WritableArray {
    return RNLocalizeModuleImpl.getLocales(reactApplicationContext)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun getNumberFormatSettings(): WritableMap {
    return RNLocalizeModuleImpl.getNumberFormatSettings(reactApplicationContext)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun getTemperatureUnit(): String {
    return RNLocalizeModuleImpl.getTemperatureUnit(reactApplicationContext)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun getTimeZone(): String {
    return RNLocalizeModuleImpl.getTimeZone()
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun uses24HourClock(): Boolean {
    return RNLocalizeModuleImpl.uses24HourClock(reactApplicationContext)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun usesMetricSystem(): Boolean {
    return RNLocalizeModuleImpl.usesMetricSystem(reactApplicationContext)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun usesAutoDateAndTime(): Boolean {
    return RNLocalizeModuleImpl.usesAutoDateAndTime(reactApplicationContext)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun usesAutoTimeZone(): Boolean {
    return RNLocalizeModuleImpl.usesAutoTimeZone(reactApplicationContext)
  }

  @ReactMethod
  fun openAppLanguageSettings(promise: Promise) {
    RNLocalizeModuleImpl.openAppLanguageSettings(reactApplicationContext, promise)
  }
}
