package com.nativeapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.app.NotificationManager
import android.util.Log

class HourlyAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Log.i("HourlyAlarmReceiver", "Alarm received: showing notification or delegating to JS")
        // For now, we simply wake the app and rely on JS in-app scheduler when app is active.
        // Place native notification code here if you want strictly native notifications.
        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        // Optional: notify a simple native notification here if desired
    }
}
