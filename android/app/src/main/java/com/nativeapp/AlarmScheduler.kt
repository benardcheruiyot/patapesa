package com.nativeapp

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

object AlarmScheduler {
    private const val REQUEST_CODE = 54321

    fun scheduleHourlyAlarms(context: Context) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, HourlyAlarmReceiver::class.java)
        val pending = PendingIntent.getBroadcast(context, REQUEST_CODE, intent, PendingIntent.FLAG_UPDATE_CURRENT or if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)

        // Start at the next top of hour
        val now = System.currentTimeMillis()
        val nextHour = ((now / (60 * 60 * 1000)) + 1) * (60 * 60 * 1000)

        Log.i("AlarmScheduler", "Scheduling hourly alarm starting at: $nextHour")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, nextHour, pending)
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, nextHour, pending)
        } else {
            alarmManager.set(AlarmManager.RTC_WAKEUP, nextHour, pending)
        }
    }

    fun cancelAlarms(context: Context) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, HourlyAlarmReceiver::class.java)
        val pending = PendingIntent.getBroadcast(context, REQUEST_CODE, intent, PendingIntent.FLAG_NO_CREATE or if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
        if (pending != null) {
            alarmManager.cancel(pending)
            pending.cancel()
            Log.i("AlarmScheduler", "Cancelled existing hourly alarm")
        }
    }
}
