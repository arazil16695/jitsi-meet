#import <React/RCTViewManager.h>
#import <SDWebImage/SDWebImage.h>
#import <SDWebImage/SDWebImageSVGCoder.h>

@interface SVGImageViewManager : RCTViewManager
@end

@implementation SVGImageViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    UIImageView *imageView = [[UIImageView alloc] init];
    imageView.contentMode = UIViewContentModeScaleAspectFit;

    // Register SDWebImageSVGCoder for SVG handling
    SDWebImageSVGCoder *svgCoder = [SDWebImageSVGCoder sharedCoder];
    [[SDWebImageCodersManager sharedManager] addCoder:svgCoder];

    return imageView;
}

RCT_EXPORT_METHOD(setSVGImage:(nonnull NSString *)url forImageView:(nonnull NSNumber *)imageViewTag)
{
    UIView *view = [self bridge].uiManager.viewForReactTag:imageViewTag;
    UIImageView *imageView = (UIImageView *)view;

    NSURL *svgUrl = [NSURL URLWithString:url];
    [imageView sd_setImageWithURL:svgUrl completed:nil];
}

@end

