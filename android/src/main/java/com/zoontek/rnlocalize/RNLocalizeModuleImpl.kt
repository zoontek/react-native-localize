package com.zoontek.rnlocalize

import android.annotation.SuppressLint
import android.content.Intent
import android.icu.number.NumberFormatter
import android.icu.util.MeasureUnit
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.text.TextUtils
import android.text.format.DateFormat
import android.view.View

import androidx.core.os.LocaleListCompat

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

import java.text.DecimalFormatSymbols
import java.util.Currency
import java.util.Locale
import java.util.Objects
import java.util.TimeZone

object RNLocalizeModuleImpl {
  const val NAME = "RNLocalize"

  private const val ERROR_INVALID_ACTIVITY = "E_INVALID_ACTIVITY"

  private val USES_FAHRENHEIT = listOf("BS", "BZ", "KY", "PR", "PW", "US")
  private val USES_IMPERIAL = listOf("LR", "MM", "US")

  // Internal

  private fun createLanguageTag(languageCode: String, scriptCode: String, countryCode: String) =
    buildString {
      append(languageCode)

      if (scriptCode.isNotEmpty()) {
        append("-$scriptCode")
      }

      append("-$countryCode")
    }

  private fun getCountryCodeForLocale(locale: Locale) =
    try {
      val countryCode = locale.country

      when {
        countryCode == "419" -> "UN"
        countryCode.isNotEmpty() -> countryCode.uppercase(Locale.getDefault())
        else -> ""
      }
    } catch (ignored: Exception) {
      ""
    }

  private fun getCurrencyCodeForLocale(locale: Locale) =
    try {
      Currency.getInstance(locale)?.currencyCode ?: ""
    } catch (ignored: Exception) {
      ""
    }

  private fun getLanguageCodeForLocale(locale: Locale) =
    when (val language = locale.language) {
      "iw" -> "he"
      "in" -> "id"
      "ji" -> "yi"
      else -> language
    }

  private fun getScriptCodeForLocale(locale: Locale) =
    locale.script.ifEmpty { "" }

  private fun getSystemLocale(reactContext: ReactApplicationContext): Locale {
    val config = reactContext.resources.configuration

    return when {
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.N -> config.locales[0]
      else -> config.locale
    }
  }

  private fun getSystemLocales(reactContext: ReactApplicationContext): List<Locale> {
    val config = reactContext.resources.configuration

    return if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
      listOf(config.locale)
    } else {
      val list = LocaleListCompat.getDefault()

      List(list.size()) { index ->
        list.get(index)!!
      }
    }
  }

  private fun getMiuiRegionCode() =
    try {
      @SuppressLint("PrivateApi")
      val systemProperties = Class.forName("android.os.SystemProperties")
      val get = systemProperties.getMethod("get", String::class.java)

      Objects.requireNonNull(get.invoke(systemProperties, "ro.miui.region")) as String
    } catch (ignored: Exception) {
      ""
    }

  // Implementation

  fun getCalendar() = "gregorian"

  fun getCountry(reactContext: ReactApplicationContext): String {
    val miuiRegionCode = getMiuiRegionCode()
    val countryCode = getCountryCodeForLocale(getSystemLocale(reactContext))

    return when {
      miuiRegionCode.isNotEmpty() -> miuiRegionCode
      countryCode.isEmpty() -> "US"
      else -> countryCode
    }
  }

  fun getCurrencies(reactContext: ReactApplicationContext): WritableArray {
    val systemLocales = getSystemLocales(reactContext)
    val currenciesList = mutableSetOf<String>()
    val currencies = Arguments.createArray()

    systemLocales.forEach { locale ->
      val currencyCode = getCurrencyCodeForLocale(locale)

      if (currencyCode.isNotEmpty() && currenciesList.add(currencyCode)) {
        currencies.pushString(currencyCode)
      }
    }

    if (currencies.size() == 0) {
      currencies.pushString("USD")
    }

    return currencies
  }

  fun getLocales(reactContext: ReactApplicationContext): WritableArray {
    val systemLocales = getSystemLocales(reactContext)
    val languageTagsList = mutableSetOf<String>()
    val locales = Arguments.createArray()
    val currentCountryCode = getCountry(reactContext)

    for (systemLocale in systemLocales) {
      val languageCode = getLanguageCodeForLocale(systemLocale)
      val scriptCode = getScriptCodeForLocale(systemLocale)
      val countryCode = getCountryCodeForLocale(systemLocale).ifEmpty { currentCountryCode }

      val languageTag = createLanguageTag(languageCode, scriptCode, countryCode)

      val locale = Arguments.createMap().apply {
        putString("languageCode", languageCode)
        putString("countryCode", countryCode)
        putString("languageTag", languageTag)

        val rtl = TextUtils.getLayoutDirectionFromLocale(systemLocale) == View.LAYOUT_DIRECTION_RTL
        putBoolean("isRTL", rtl)

        if (scriptCode.isNotEmpty()) {
          putString("scriptCode", scriptCode)
        }
      }

      if (languageTagsList.add(languageTag)) {
        locales.pushMap(locale)
      }
    }

    return locales
  }

  fun getNumberFormatSettings(reactContext: ReactApplicationContext): WritableMap {
    val symbols = DecimalFormatSymbols(getSystemLocale(reactContext))

    return Arguments.createMap().apply {
      putString("decimalSeparator", symbols.decimalSeparator.toString())
      putString("groupingSeparator", symbols.groupingSeparator.toString())
    }
  }

  // https://github.com/androidx/androidx/blob/androidx-main/core/core/src/main/java/androidx/core/text/util/LocalePreferences.java
  fun getTemperatureUnit(reactContext: ReactApplicationContext) =
    when {
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU -> {
        val formatter = NumberFormatter.with()
          .usage("weather")
          .unit(MeasureUnit.CELSIUS)
          .locale(getSystemLocale(reactContext))

        val unit = formatter
          .format(1)
          .outputUnit
          .identifier

        if (unit.startsWith("fahrenhe")) "fahrenheit" else "celsius"
      }

      USES_FAHRENHEIT.contains(getCountry(reactContext)) -> "fahrenheit"
      else -> "celsius"
    }

  fun getTimeZone(): String = TimeZone.getDefault().id

  fun uses24HourClock(reactContext: ReactApplicationContext) =
    DateFormat.is24HourFormat(reactContext)

  fun usesMetricSystem(reactContext: ReactApplicationContext) =
    !USES_IMPERIAL.contains(getCountry(reactContext))

  fun usesAutoDateAndTime(reactContext: ReactApplicationContext) =
    Settings.Global.getInt(reactContext.contentResolver, Settings.Global.AUTO_TIME, 0) != 0

  fun usesAutoTimeZone(reactContext: ReactApplicationContext) =
    Settings.Global.getInt(reactContext.contentResolver, Settings.Global.AUTO_TIME_ZONE, 0) != 0

  fun openAppLanguageSettings(reactContext: ReactApplicationContext, promise: Promise) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
      return promise.reject("unsupported",
        "openAppLanguageSettings is supported only on Android 13+");
    }

    try {
      val packageName = reactContext.packageName

      val intent = Intent().apply {
        setAction(Settings.ACTION_APP_LOCALE_SETTINGS)
        setData(Uri.fromParts("package", packageName, null))
      }

      reactContext.currentActivity?.startActivity(intent)
      promise.resolve(true)
    } catch (exception: Exception) {
      promise.reject(ERROR_INVALID_ACTIVITY, exception)
    }
  }
}
