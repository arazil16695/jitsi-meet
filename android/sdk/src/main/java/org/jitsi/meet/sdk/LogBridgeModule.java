/*
 * Copyright @ 2019-present 8x8, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jitsi.meet.sdk;

import android.content.Intent;
import android.util.Log;
 
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
 
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
 
import org.jitsi.meet.sdk.log.JitsiMeetLogger;
 
import javax.annotation.Nonnull;

/**
 * Module implementing a "bridge" between the JS loggers and the native one.
 */
@ReactModule(name = LogBridgeModule.NAME)
class LogBridgeModule extends ReactContextBaseJavaModule {
    public static final String NAME = "LogBridge";

    public LogBridgeModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void trace(final String message) {
        JitsiMeetLogger.v("hello6"+message);
    }

    @ReactMethod
    public void debug(final String message) {
        JitsiMeetLogger.d("hello5"+message);
    }

    @ReactMethod
    public void info(final String message) {
        JitsiMeetLogger.i("hello4"+message);
    }

    @ReactMethod
    public void log(final String message) {
        JitsiMeetLogger.i("hello3"+message);
    }

    @ReactMethod
    public void warn(final String message) {
        JitsiMeetLogger.w("hello 2"+message);
    }

    @ReactMethod
    public void error(final String message) {
        JitsiMeetLogger.e("hello"+message);
    }
    @ReactMethod
    public void jitsiEvent(final String message) {
        Log.w("ReactNativeJS app.voipbusiness.com", message); // Native Logcat
        // Optionally use JitsiMeetLogger if you want to log within JitsiMeet logs
        Intent intent = new Intent("org.jitsi.meet.Add_Memeber");
        intent.putExtra("message",message);
        LocalBroadcastManager.getInstance(getReactApplicationContext()).sendBroadcast(intent);
//        JitsiMeetLogger.w("ReactNativeJS app.voipbusiness.com", message);
    }
}
