# my-userscripts
Just some user scripts I've made

# Apple Music Web Player Notifications
[Install Apple Music Web Player Notifications](https://github.com/booploops/my-userscripts/raw/master/applemusic-notifications.user.js)
Simple script that adds now playing notifications to Apple Music's web player with configuration

        MediaSessionArtworkSize: 1,         // 0: 96x96, 1: 128x128, 2: 192x192, 3: 256x256, 4: 384x384, 5:512x512
        MusicKitArtworkRes: [128, 128],     // default [128,128]
        ForceUseMusicKit: false,            // Will use MusicKit data for the track metadata instead of mediaSession
        ForceTimeout: false,                // Force the notification to timeout with a custom timer 
        ForceTimeoutDuration: 2500          // How long until the notification times out (in ms)
        
On Chrome and Chromium Edge the script will use navigator.mediaSession for it's metadata by default.  On other browsers like Firefox it will use MusicKitJS' nowPlayingItem metadata.
