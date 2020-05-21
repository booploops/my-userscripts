// ==UserScript==
// @name         Apple Music Web Player Notifications
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds notifications to Apple Music, Compatable with Chrome, Edge, and Firefox
// @author       booploops
// @match        https://music.apple.com/*
// @grant        none
// ==/UserScript==

(function () {
    const NConfig = {
        MediaSessionArtworkSize: 1,         // 0: 96x96, 1: 128x128, 2: 192x192, 3: 256x256, 4: 384x384, 5:512x512
        MusicKitArtworkRes: [128, 128],     // default [128,128]
        ForceUseMusicKit: false,            // Will use MusicKit data for the track metadata instead of mediaSession
        ForceTimeout: false,                // Force the notification to timeout with a custom timer 
        ForceTimeoutDuration: 2500          // How long until the notification times out (in ms)
    }

    let lasttrack = "";
    function notifyFn() {
        setInterval(function () {
            let music = MusicKit.getInstance();
            if ("mediaSession" in navigator && NConfig.ForceUseMusicKit == false) {
                if (navigator.mediaSession["metadata"]) {
                    if (lasttrack != navigator.mediaSession.metadata["title"]) {
                        lasttrack = navigator.mediaSession.metadata["title"]
                        let artwork = navigator.mediaSession.metadata["artwork"][NConfig.MediaSessionArtworkSize]["src"] ? navigator.mediaSession.metadata["artwork"][NConfig.MediaSessionArtworkSize]["src"] : "https://apps.mzstatic.com/content/static-config/android/images/android_am_192.png";
                        let notify = new Notification(document.title, { body: `${navigator.mediaSession.metadata["title"]}\n${navigator.mediaSession.metadata["album"]}\n${navigator.mediaSession.metadata["artist"]}`, icon: artwork, silent: true })
                        if (NConfig.ForceTimeout) {
                            setTimeout(function () {
                                notify.close()
                            }, NConfig.ForceTimeoutDuration)
                        }
                    }
                }
            } else if (music.nowPlayingItem) {
                if (lasttrack != music.nowPlayingItem["title"]) {
                    lasttrack = music.nowPlayingItem["title"]
                    let artwork = music.nowPlayingItem.attributes.artwork.url.replace("{w}", NConfig.MusicKitArtworkRes[0]).replace("{h}", NConfig.MusicKitArtworkRes[1]) ? music.nowPlayingItem.attributes.artwork.url.replace("{w}", NConfig.MusicKitArtworkRes[0]).replace("{h}", NConfig.MusicKitArtworkRes[1]) : "https://apps.mzstatic.com/content/static-config/android/images/android_am_192.png";
                    let notify = new Notification(document.title, { body: `${music.nowPlayingItem["title"]}\n${music.nowPlayingItem["albumName"]}\n${music.nowPlayingItem["artistName"]}`, icon: artwork, silent: true })
                    if (NConfig.ForceTimeout) {
                        setTimeout(function () {
                            notify.close()
                        }, NConfig.ForceTimeoutDuration)
                    }
                }
            }
        }, 1000)
    }
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notifications");
    } else {
        switch (Notification.permission) {
            case "granted":
                notifyFn();
                break;
            default:
            case "denied":
                Notification.requestPermission().then(function (permission) {
                    if (permission === "granted") {
                        var notification = new Notification("Notifications now enabled!", {icon: "https://apps.mzstatic.com/content/static-config/android/images/android_am_192.png"});
                        notifyFn();
                    }
                });
                break;
        }
    }
})();