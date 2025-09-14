package com.nativeapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    if (intent?.action == Intent.ACTION_BOOT_COMPLETED) {
      // Reschedule hourly alarms after device reboot
      try {
        HourlyAlarmScheduler.scheduleHourly(context)
      } catch (e: Exception) {
        e.printStackTrace()
      }
    }
  }
}
