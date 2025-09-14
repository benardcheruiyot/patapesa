package com.nativeapp

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build

object HourlyAlarmScheduler {
  private const val REQUEST_CODE = 12345

  fun scheduleHourly(context: Context) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val intent = Intent(context, HourlyAlarmReceiver::class.java)
    val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT else PendingIntent.FLAG_UPDATE_CURRENT
    val pendingIntent = PendingIntent.getBroadcast(context, REQUEST_CODE, intent, flags)

    // Cancel existing
    alarmManager.cancel(pendingIntent)

    val interval = 60 * 60 * 1000L // 1 hour
    val triggerAt = System.currentTimeMillis() + interval

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      // exact alarms require permission on Android 12+, but inexact repeating is OK
      alarmManager.setInexactRepeating(AlarmManager.RTC_WAKEUP, triggerAt, interval, pendingIntent)
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      alarmManager.setInexactRepeating(AlarmManager.RTC_WAKEUP, triggerAt, interval, pendingIntent)
    } else {
      alarmManager.setInexactRepeating(AlarmManager.RTC_WAKEUP, triggerAt, interval, pendingIntent)
    }
  }

  fun cancel(context: Context) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val intent = Intent(context, HourlyAlarmReceiver::class.java)
    val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT else PendingIntent.FLAG_UPDATE_CURRENT
    val pendingIntent = PendingIntent.getBroadcast(context, REQUEST_CODE, intent, flags)
    alarmManager.cancel(pendingIntent)
  }

  /**
   * Schedule a one-off alarm after `seconds` seconds. Useful for quick testing.
   */
  fun scheduleOneOffTest(context: Context, seconds: Long) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val intent = Intent(context, HourlyAlarmReceiver::class.java)
    val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT else PendingIntent.FLAG_UPDATE_CURRENT
    val pendingIntent = PendingIntent.getBroadcast(context, REQUEST_CODE + 1, intent, flags)

    val triggerAt = System.currentTimeMillis() + seconds * 1000L
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
    } else {
      alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
    }
  }
}
