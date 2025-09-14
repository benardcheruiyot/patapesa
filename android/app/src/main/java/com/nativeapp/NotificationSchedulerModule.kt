package com.nativeapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NotificationSchedulerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String {
    return "NotificationScheduler"
  }

  @ReactMethod
  fun scheduleHourly() {
    try {
      HourlyAlarmScheduler.scheduleHourly(reactApplicationContext)
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }

  @ReactMethod
  fun cancel() {
    try {
      HourlyAlarmScheduler.cancel(reactApplicationContext)
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }
}
