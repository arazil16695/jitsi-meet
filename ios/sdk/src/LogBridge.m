/*
 * Copyright @ 2019-present 8x8, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#import <React/RCTBridgeModule.h>

#import "LogUtils.h"
#import "JitsiMeetView.h"
#import "JitsiMeetViewDelegate.h"

@interface LogBridge : NSObject<RCTBridgeModule>
// @property (nonatomic, strong) JitsiMeetView *jitsiMeetView; 
@property (nonatomic, weak) id<JitsiMeetViewDelegate> delegate; 
@end

@implementation LogBridge

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}
// allow setting the delegate externally (for JitsiMeetView)
- (void)setDelegate:(id<JitsiMeetViewDelegate>)delegate {
    _delegate = delegate;
}

RCT_EXPORT_METHOD(trace:(NSString *)msg) {
    DDLogDebug(@"%@", msg);
}

RCT_EXPORT_METHOD(debug:(NSString *)msg) {
    DDLogDebug(@"%@", msg);
}

RCT_EXPORT_METHOD(info:(NSString *)msg) {
    DDLogInfo(@"%@", msg);
}

RCT_EXPORT_METHOD(log:(NSString *)msg) {
    DDLogInfo(@"%@", msg);
}

RCT_EXPORT_METHOD(warn:(NSString *)msg) {
    DDLogWarn(@"%@", msg);
}

RCT_EXPORT_METHOD(error:(NSString *)msg) {
    DDLogError(@"%@", msg);
}
RCT_EXPORT_METHOD(jitsiEvent:(NSString *)msg) {
    // Log the event for debugging purposes
    DDLogError(@"This is the function of jitsiEvent: %@", msg); 

NSDictionary *data = @{ @"message": msg ?: @"" };
    [[NSNotificationCenter defaultCenter] postNotificationName:@"jitsiEventNotification" object:nil userInfo:data];
}


@end
