# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }

# WebView
-keep class android.webkit.** { *; }
-keep class * extends android.webkit.WebViewClient { *; }
-keep class * extends android.webkit.WebChromeClient { *; }

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# NetInfo
-keep class com.reactnativecommunity.netinfo.** { *; }

# Orientation Locker
-keep class org.wonday.orientation.** { *; }

# Share
-keep class cl.json.** { *; }

# General React Native rules
-keepattributes Signature
-keepattributes *Annotation*
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }
-keep class * extends com.facebook.react.bridge.BaseJavaModule { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Flipper
-dontwarn com.facebook.flipper.**