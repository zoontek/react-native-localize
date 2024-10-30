#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED

#import <RNLocalizeSpec/RNLocalizeSpec.h>
@interface RNLocalize : RCTEventEmitter <NativeRNLocalizeSpec>

#else

#import <React/RCTBridgeModule.h>
@interface RNLocalize : RCTEventEmitter <RCTBridgeModule>

#endif

@end
