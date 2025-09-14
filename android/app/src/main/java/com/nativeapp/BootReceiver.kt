package com.nativeapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            Log.i("BootReceiver", "Device boot completed — rescheduling alarms")
            try {
                AlarmScheduler.scheduleHourlyAlarms(context)
            } catch (e: Exception) {
                Log.e("BootReceiver", "Failed to reschedule alarms: " + e.message)
            }
        }
    }
}
