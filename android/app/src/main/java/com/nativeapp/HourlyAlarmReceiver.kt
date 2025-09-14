package com.nativeapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.app.NotificationManager
import androidx.core.app.NotificationCompat
import android.app.PendingIntent
import android.os.Build
import android.app.NotificationChannel

class HourlyAlarmReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    try {
      val channelId = "pata_pesa_hourly_channel"
      val channelName = "PataPesa Hourly"
      val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val channel = NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_DEFAULT)
        channel.description = "Hourly updates and reminders from PataPesa"
        manager.createNotificationChannel(channel)
      }

      val notificationIntent = Intent(context, MainActivity::class.java)
      notificationIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
      val pendingIntentFlags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT else PendingIntent.FLAG_UPDATE_CURRENT
      val pendingIntent = PendingIntent.getActivity(context, 0, notificationIntent, pendingIntentFlags)

      val title = "Come back to PataPesa"
      val message = "Your hourly chance to win rewards is ready — open the app to spin!"

      val builder = NotificationCompat.Builder(context, channelId)
        .setSmallIcon(android.R.drawable.ic_dialog_info)
        .setContentTitle(title)
        .setContentText(message)
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        .setContentIntent(pendingIntent)
        .setAutoCancel(true)

      val id = (System.currentTimeMillis() % Int.MAX_VALUE).toInt()
      manager.notify(id, builder.build())
    } catch (e: Exception) {
      // swallow - receiver should not crash system process
      e.printStackTrace()
    }
  }
}
