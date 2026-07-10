/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ImageSourcePropType,
  StyleProp,
  ImageStyle,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  BackHandler,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import FastImage, {
  ResizeMode,
  ImageStyle as FastImageStyle,
  Source,
} from 'react-native-fast-image';
import { SvgXml } from 'react-native-svg';
import { downloadGenerateUrl } from '@features/profile';
import { styles } from './styles';
import { Portal } from '@gorhom/portal';
import { createMMKV } from 'react-native-mmkv';
import CustomImageZoom, {
  CustomImageZoomRef,
} from './CustomImageZoom';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { infoIcon as closeIcon } from '@assets/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { S3ImageSkeleton } from './S3ImageSkeleton';
import { colors } from '@theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const AvatarViewer = ({
  uri,
  measurements,
  onClose,
}: {
  uri: string;
  measurements: any;
  onClose: () => void;
}) => {
  const animValue = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const zoomRef = useRef<CustomImageZoomRef>(null);

  const TIMING_CONFIG = { duration: 250, easing: Easing.out(Easing.quad) };

  useEffect(() => {
    animValue.value = withTiming(1, TIMING_CONFIG);

    const backAction = () => {
      handleClose();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const handleClose = () => {
    zoomRef.current?.reset();
    animValue.value = withTiming(0, TIMING_CONFIG, finished => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  };

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: 'black',
    opacity: animValue.value,
    ...StyleSheet.absoluteFillObject,
  }));

  const imageStyle = useAnimatedStyle(() => {
    const targetWidth = SCREEN_WIDTH;
    const targetHeight = SCREEN_HEIGHT;

    const width =
      measurements.width + (targetWidth - measurements.width) * animValue.value;
    const height =
      measurements.height +
      (targetHeight - measurements.height) * animValue.value;
    const top = measurements.pageY + (0 - measurements.pageY) * animValue.value;
    const left =
      measurements.pageX + (0 - measurements.pageX) * animValue.value;

    const borderRadius = (measurements.width / 2) * (1 - animValue.value);

    return {
      position: 'absolute',
      top,
      left,
      width,
      height,
      borderRadius,
      overflow: 'hidden',
    };
  });

  return (
    <Portal>
      <StatusBar backgroundColor={'#0000'} />
      <Animated.View style={bgStyle} />
      <Animated.View style={imageStyle}>
        <CustomImageZoom
          ref={zoomRef}
          uri={uri}
          maxScale={5}
          doubleTapScale={3}
          shouldCloseOnSwipeDown={true}
          onSwipeDownRelease={handleClose}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
        <Animated.View
          style={{
            position: 'absolute',
            top: Math.max(insets.top + 10, 40),
            right: 24,
            opacity: animValue,
          }}
        >
          <TouchableOpacity
            onPress={handleClose}
            style={{
              padding: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 100,
              overflow: 'hidden',
            }}
          >
            <Image
              source={closeIcon}
              style={{
                width: scale(40),
                height: scale(40),
                tintColor: 'white',
              }}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Portal>
  );
};

export interface S3ImageProps {
  path: string | number | object;
  style?: StyleProp<ImageStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode;
  placeholder?: ImageSourcePropType;
  placeholderComponent?: React.ReactNode;
  showLoader?: boolean;
  showPlaceholderLoading?: boolean;
  cache?: Source['cache'];
  cacheFromS3Key?: boolean;
  shoulOpenAvtarViewerOnPress?: boolean;
  onPressOpenAvtarViewer?: () => void;
}

const s3Storage = createMMKV({ id: 's3-image-cache' });

const s3UrlCache = {
  has: (key: string) => s3Storage.contains(key),
  get: (key: string) => s3Storage.getString(key),
  set: (key: string, value: string) => s3Storage.set(key, value),
  delete: (key: string) => s3Storage.remove(key),
};
const s3SvgCache = new Set<string>();
const s3SvgXmlCache = new Map<string, string>();

const extractS3Key = (url: string) => {
  if (!url || !url.startsWith('http')) return url;
  try {
    const withoutQuery = url.split('?')[0];
    const parts = withoutQuery.split('/');
    // Standard S3 URL: https://bucket.s3.region.amazonaws.com/key
    // Or https://s3.region.amazonaws.com/bucket/key
    if (parts[2].includes('amazonaws.com')) {
      if (parts[2].startsWith('s3.')) {
        // format: s3.region.amazonaws.com/bucket/key
        return parts.slice(4).join('/');
      } else {
        // format: bucket.s3.region.amazonaws.com/key
        return parts.slice(3).join('/');
      }
    }
    return withoutQuery;
  } catch {
    return url;
  }
};

const S3Image: React.FC<S3ImageProps> = ({
  path,
  style,
  imageStyle,
  resizeMode = FastImage.resizeMode.cover,
  placeholder,
  placeholderComponent,
  showLoader = true,
  showPlaceholderLoading = false,
  cache = FastImage.cacheControl.immutable,
  cacheFromS3Key = false,
  shoulOpenAvtarViewerOnPress = false,
  onPressOpenAvtarViewer,
}) => {
  const viewRef = React.useRef<View>(null);
  const [avatarViewerVisible, setAvatarViewerVisible] = useState(false);
  const [measurements, setMeasurements] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
  } | null>(null);

  let pathStr =
    typeof path === 'string'
      ? path
      : typeof path === 'object' &&
        path !== null &&
        typeof (path as any).uri === 'string'
      ? (path as any).uri
      : null;

  if (
    pathStr &&
    pathStr.includes('.cloudfront.net') &&
    !pathStr.includes('.cloudfront.net/')
  ) {
    pathStr = pathStr.replace('.cloudfront.net', '.cloudfront.net/');
  }

  const isLocal =
    typeof path === 'number' ||
    (typeof pathStr === 'string' &&
      pathStr.length > 0 &&
      !pathStr.startsWith('http') &&
      !pathStr.startsWith('file://') &&
      !pathStr.startsWith('content://') &&
      !pathStr.startsWith('/') &&
      !pathStr.includes('/'));

  const handlePress = () => {
    if (onPressOpenAvtarViewer) {
      onPressOpenAvtarViewer();
    }
    if (shoulOpenAvtarViewerOnPress && imageUri) {
      viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setMeasurements({ x, y, width, height, pageX, pageY });
        setAvatarViewerVisible(true);
      });
    }
  };
  const getInitialCacheKey = () =>
    cacheFromS3Key && pathStr?.startsWith('http')
      ? extractS3Key(pathStr)
      : pathStr || '';

  const [loading, setLoading] = useState(() => {
    if (!pathStr || isLocal) return false;
    if (
      pathStr.startsWith('http') ||
      pathStr.startsWith('file://') ||
      pathStr.startsWith('content://') ||
      pathStr.startsWith('/')
    ) {
      return false;
    }
    const cacheKey = getInitialCacheKey();
    if (s3UrlCache.has(cacheKey)) return false;
    return true;
  });

  const [imageLoading, setImageLoading] = useState(() => {
    if (!pathStr || isLocal) return false;
    // If it's a direct URL or already in static cache, don't show initial loader
    if (pathStr.startsWith('http')) return false;
    const cacheKey = getInitialCacheKey();
    if (s3UrlCache.has(cacheKey)) return false;
    return true;
  });

  const [imageUri, setImageUri] = useState<string | null>(() => {
    if (!pathStr || isLocal) return null;
    if (
      pathStr.startsWith('http') ||
      pathStr.startsWith('file://') ||
      pathStr.startsWith('content://') ||
      pathStr.startsWith('/')
    ) {
      return pathStr;
    }
    const cacheKey = getInitialCacheKey();
    return s3UrlCache.get(cacheKey) || null;
  });

  const [hasError, setHasError] = useState(false);
  const [isSvg, setIsSvg] = useState(() => {
    if (!pathStr || isLocal) return false;
    const cacheKey = getInitialCacheKey();
    return s3SvgCache.has(cacheKey);
  });
  const [isFromCache, setIsFromCache] = useState(() => {
    if (!pathStr || isLocal) return false;
    const cacheKey = getInitialCacheKey();
    return s3UrlCache.has(cacheKey);
  });

  const [svgXmlContent, setSvgXmlContent] = useState<string | null>(() => {
    if (isSvg && imageUri) {
      return s3SvgXmlCache.get(imageUri) || null;
    }
    return null;
  });

  useEffect(() => {
    if (isSvg && imageUri) {
      if (s3SvgXmlCache.has(imageUri)) {
        setSvgXmlContent(s3SvgXmlCache.get(imageUri)!);
        setImageLoading(false);
        return;
      }

      let active = true;
      fetch(imageUri)
        .then(res => res.text())
        .then(text => {
          if (!active) return;
          let fixedXml = text;
          // If the SVG doesn't have a viewBox, it won't scale automatically.
          // We can try to inject one by reading its width and height.
          if (!text.includes('viewBox')) {
            const widthMatch = text.match(/<svg[^>]*width=["']([^"']+)["']/i);
            const heightMatch = text.match(/<svg[^>]*height=["']([^"']+)["']/i);
            if (widthMatch && heightMatch) {
              const w = parseFloat(widthMatch[1]);
              const h = parseFloat(heightMatch[1]);
              if (!isNaN(w) && !isNaN(h)) {
                fixedXml = text.replace(/(<svg\b[^>]*>)/i, match => {
                  return match.replace('<svg', `<svg viewBox="0 0 ${w} ${h}"`);
                });
              }
            }
          }
          s3SvgXmlCache.set(imageUri, fixedXml);
          setSvgXmlContent(fixedXml);
          setImageLoading(false);
        })
        .catch(e => {
          if (active) handleImageError(e);
        });
      return () => {
        active = false;
      };
    }
  }, [isSvg, imageUri]);

  const fetchDownloadUrl = async (forceRefresh = false) => {
    // console.log(
    //   'S3Image fetchDownloadUrl called, pathStr:',
    //   pathStr,
    //   'isLocal:',
    //   isLocal,
    //   'forceRefresh:',
    //   forceRefresh,
    // );
    if (!pathStr) {
      // console.log('S3Image fetchDownloadUrl: no pathStr');
      setImageUri(null);
      setHasError(true);
      setLoading(false);
      setImageLoading(false);
      return;
    }

    if (isLocal) {
      // console.log('S3Image fetchDownloadUrl: isLocal');
      setImageUri(null);
      setHasError(false);
      setLoading(false);
      setImageLoading(false);
      return;
    }

    let cacheKey = pathStr;
    if (cacheFromS3Key && pathStr.startsWith('http')) {
      cacheKey = extractS3Key(pathStr);
    }

    // Check cache if not forcing a refresh
    if (!forceRefresh && s3UrlCache.has(cacheKey)) {
      setImageUri(s3UrlCache.get(cacheKey)!);
      setIsSvg(s3SvgCache.has(cacheKey));
      setIsFromCache(true);
      setHasError(false);
      setLoading(false);
      return;
    }

    if (pathStr.startsWith('http')) {
      let isSvgType = false;
      const urlWithoutQuery = pathStr.split('?')[0].toLowerCase();
      const hasImageExt = urlWithoutQuery.match(
        /\\.(jpg|jpeg|png|webp|gif|bmp)$/,
      );
      const hasSvgExt = urlWithoutQuery.match(/\\.svg$/);

      if (hasSvgExt) {
        isSvgType = true;
      } else if (!hasImageExt) {
        try {
          const fetchHeaders =
            typeof path === 'object' && path !== null && 'headers' in path
              ? (path as any).headers
              : {};
          const res = await fetch(pathStr, {
            method: 'HEAD',
            headers: fetchHeaders,
          });
          if (res.status === 403 || res.status === 404) {
            console.warn(
              `S3Image [HTTP HEAD] Image not found (Status ${res.status}):`,
              pathStr,
            );
            setHasError(true);
            setLoading(false);
            setImageLoading(false);
            return;
          }
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('svg')) {
            console.log(`S3Image [HTTP HEAD] Detected SVG format:`, pathStr);
            isSvgType = true;
          }
        } catch (_e) {
          console.error(`S3Image [HTTP HEAD] Network error for:`, pathStr, _e);
          // ignore fetch error and let FastImage handle it
        }
      }
      if (isSvgType) s3SvgCache.add(cacheKey);
      setImageUri(pathStr);
      s3UrlCache.set(cacheKey, pathStr);
      setIsSvg(isSvgType);
      setIsFromCache(false);
      setHasError(false);
      setLoading(false);
      return;
    }

    if (
      pathStr.startsWith('file://') ||
      pathStr.startsWith('content://') ||
      pathStr.startsWith('/')
    ) {
      setImageUri(pathStr);
      setHasError(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setIsFromCache(false);
    try {
      const response = await downloadGenerateUrl({ file_path: pathStr });
      if (response.success && response.data?.downloadUrl) {
        const url = response.data.downloadUrl;
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.status === 403 || res.status === 404) {
            console.warn(
              `S3Image [API HEAD] Generated URL not found (Status ${res.status}):`,
              url,
            );
            setHasError(true);
            setLoading(false);
            setImageLoading(false);
            return;
          }
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('svg')) {
            console.log(
              `S3Image [API HEAD] Detected SVG format for generated URL:`,
              url,
            );
            s3SvgCache.add(cacheKey);
            setIsSvg(true);
          }
        } catch (_e) {
          console.error(
            `S3Image [API HEAD] Network error for generated URL:`,
            url,
            _e,
          );
          // ignore fetch error and let FastImage handle it
        }
        setImageUri(url);
        s3UrlCache.set(cacheKey, url);
        setHasError(false);
      } else {
        console.warn(
          `S3Image [API] Failed to get downloadUrl for path:`,
          pathStr,
        );
        setHasError(true);
        setImageLoading(false);
      }
    } catch (_e) {
      console.error(`S3Image [API] API request failed for path:`, pathStr, _e);
      setHasError(true);
      setImageLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log('S3Image path:', path);
    // console.log('S3Image pathStr:', pathStr);
    // console.log('S3Image isLocal:', isLocal);

    fetchDownloadUrl();
  }, [pathStr, isLocal]);

  const handleImageError = (errorEvent?: any) => {
    console.warn(
      `S3Image [Render Error] Failed to render image, falling back or setting error for:`,
      pathStr,
      JSON.stringify(errorEvent?.nativeEvent),
    );
    if (errorEvent) {
      console.log(
        'S3Image exact error:',
        pathStr,
        JSON.stringify(
          errorEvent?.nativeEvent?.error ||
            errorEvent?.nativeEvent ||
            errorEvent,
        ),
      );
    }
    if (isFromCache && pathStr) {
      let cacheKey = pathStr;
      if (cacheFromS3Key && pathStr.startsWith('http')) {
        cacheKey = extractS3Key(pathStr);
      }
      s3UrlCache.delete(cacheKey);

      if (pathStr.startsWith('http')) {
        setImageUri(pathStr);
        setIsFromCache(false);
      } else {
        fetchDownloadUrl(true);
      }
    } else {
      setHasError(true);
    }
    setImageLoading(false);
  };

  const renderImage = () => {
    if (isLocal) {
      const src = typeof path === 'string' ? { uri: path } : path;
      return (
        <Image
          style={[{ width: '100%', height: '100%' }, imageStyle]}
          source={src as ImageSourcePropType}
          resizeMode={resizeMode === 'contain' ? 'contain' : 'cover'}
        />
      );
    }

    let uriString = imageUri;
    if (uriString && uriString.startsWith('http')) {
      try {
        uriString = encodeURI(decodeURIComponent(uriString));
      } catch {
        uriString = encodeURI(uriString);
      }
    }

    if (hasError || !uriString) {
      if (placeholderComponent) {
        return <>{placeholderComponent}</>;
      }
      return (
        <Image
          style={[styles.imageFill, imageStyle]}
          source={(placeholder as ImageSourcePropType) || 0}
          resizeMode={resizeMode === 'contain' ? 'contain' : 'cover'}
        />
      );
    }

    if (isSvg) {
      return (
        <View
          style={[
            {
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            },
            imageStyle,
          ]}
        >
          {!svgXmlContent &&
            (placeholderComponent ? (
              <>{placeholderComponent}</>
            ) : (
              <Image
                style={[styles.imageFill, imageStyle, { position: 'absolute' }]}
                source={(placeholder as ImageSourcePropType) || 0}
                resizeMode={resizeMode === 'contain' ? 'contain' : 'cover'}
              />
            ))}
          {svgXmlContent ? (
            <SvgXml
              xml={svgXmlContent}
              width="100%"
              height="100%"
              onError={e => {
                console.log('S3Image svg failed to load');
                handleImageError(e);
              }}
            />
          ) : null}
        </View>
      );
    }

    const source: Source = {
      uri: uriString,
      cache,
      priority: FastImage.priority.high,
      headers:
        typeof path === 'object' && path !== null && 'headers' in path
          ? (path as any).headers
          : undefined,
    };

    return (
      <FastImage
        key={uriString}
        style={[styles.imageFill, imageStyle] as FastImageStyle}
        source={source}
        resizeMode={resizeMode}
        onLoadStart={() => {
          // Only trigger loading UI if we have a URI but it's not the path itself (lazy loading)
          if (uriString && pathStr && !pathStr.startsWith('http')) {
            setImageLoading(true);
          }
        }}
        onLoadEnd={() => setImageLoading(false)}
        onError={() => {
          console.log('S3Image fastImage error');
          handleImageError();
        }}
        fallback={Platform.OS === 'android'}
      />
    );
  };

  const isPressable = shoulOpenAvtarViewerOnPress || !!onPressOpenAvtarViewer;

  return (
    <>
      <View
        style={style}
        ref={viewRef}
        pointerEvents={
          !shoulOpenAvtarViewerOnPress && !onPressOpenAvtarViewer
            ? 'none'
            : 'auto'
        }
      >
        {isPressable ? (
          <TouchableOpacity
            style={{ width: '100%', height: '100%' }}
            activeOpacity={
              shoulOpenAvtarViewerOnPress || onPressOpenAvtarViewer ? 0.8 : 1
            }
            onPress={
              shoulOpenAvtarViewerOnPress || onPressOpenAvtarViewer
                ? handlePress
                : undefined
            }
            disabled={!shoulOpenAvtarViewerOnPress && !onPressOpenAvtarViewer}
          >
            {showPlaceholderLoading && imageLoading && !hasError && (
              <View
                style={[
                  styles.loaderOverlay,
                  {
                    borderRadius: (StyleSheet.flatten(style) as any)
                      ?.borderRadius,
                  },
                ]}
              >
                <S3ImageSkeleton style={style} />
              </View>
            )}

            {loading && showLoader && !showPlaceholderLoading && (
              <View
                style={[
                  styles.loaderOverlay,
                  {
                    borderRadius: (StyleSheet.flatten(style) as any)
                      ?.borderRadius,
                  },
                ]}
              >
                <S3ImageSkeleton style={style} />
              </View>
            )}

            {renderImage()}
          </TouchableOpacity>
        ) : (
          <View style={{ width: '100%', height: '100%' }}>
            {showPlaceholderLoading && imageLoading && !hasError && (
              <View style={styles.loaderOverlay}>
                {placeholderComponent ? (
                  placeholderComponent
                ) : placeholder ? (
                  <Image
                    style={[styles.imageFill, imageStyle]}
                    source={placeholder as ImageSourcePropType}
                    resizeMode={resizeMode === 'contain' ? 'contain' : 'cover'}
                  />
                ) : null}
                {showLoader && (
                  <View
                    style={[
                      styles.loaderOverlay,
                      { backgroundColor: 'transparent' },
                    ]}
                  >
                    <ActivityIndicator size="small" color={colors.WHITE} />
                  </View>
                )}
              </View>
            )}

            {loading && showLoader && !showPlaceholderLoading && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="small" color={colors.WHITE} />
              </View>
            )}

            {renderImage()}
          </View>
        )}
      </View>

      {avatarViewerVisible && imageUri && measurements && (
        <AvatarViewer
          uri={imageUri}
          measurements={measurements}
          onClose={() => setAvatarViewerVisible(false)}
        />
      )}
    </>
  );
};

export default S3Image;
