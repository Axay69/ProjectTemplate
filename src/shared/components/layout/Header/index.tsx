import FastImage from 'react-native-fast-image';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
  Platform,
  StyleProp,
  ImageStyle,
  DeviceEventEmitter,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useAppDispatch, useAppSelector, setUnreadNotificationCount } from '@store';
import {
  getUnreadNotificationCount,
  getBarsiqUnreadCount,
  markBarsiqAsRead,
} from '@core/api';
import { logoutUser } from '@features/auth/services/auth.service';
import S3Image from '../../media/S3Image';
import NotificationService from '@core/notifications';
import { colors } from '@theme';
import { fonts } from '@theme';
import { textVariants } from '@theme';
import ConfirmationModal from '../../overlays/ConfirmationModal';
import BarsiqAiModal from '../../overlays/BarsiqAiModal';
import {
  leftBackIcon as arrowLeftIc,
  successIcon as logo360Sports,
  warningIcon as fireIcon,
  profilePlaceholderIcon as profilePlaceholder,
  profilePlaceholderIcon as logoSquare360Sports,
} from '@assets/icons';
import { SCREEN_NAMES as ORIGINAL_SCREEN_NAMES } from '@app/navigation';
const SCREEN_NAMES: any = {
  ...ORIGINAL_SCREEN_NAMES,
  BOTTOM_TABS: ORIGINAL_SCREEN_NAMES.DASHBOARD_STACK || 'DashboardStack',
  ENGAGE_STACK: 'EngageStack',
  WATCH_STACK: 'WatchStack',
};
const formatNumber = (num: number) => num.toString();

export interface HeaderProps {
  title?: string;
  titleAlign?: 'left' | 'center';
  showLogo?: boolean;
  isBackIcon?: boolean;
  backIcon?: ImageSourcePropType;
  backIconStyle?: StyleProp<ImageStyle>;
  isRightIcon?: React.ReactNode;
  rightIcon?: ImageSourcePropType;
  onRightIconPress?: () => void;
  onBackPress?: () => void;
  isMainTabsScreen?: boolean;
  customHeaderComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  titleAlign = 'center',
  showLogo,
  isBackIcon,
  backIcon,
  backIconStyle,
  isRightIcon,
  rightIcon,
  onRightIconPress,
  onBackPress,
  isMainTabsScreen,
  customHeaderComponent,
}) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const unreadNotificationCount = useAppSelector(
    state => state.auth.unreadNotificationCount,
  ) ?? 0;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBarsiqModal, setShowBarsiqModal] = useState(false);
  const [barsiqUnreadCount, setBarsiqUnreadCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUnreadCounts = async () => {
        if (!userInfo || userInfo.user_type === 'guest') return;

        try {
          const res = await getUnreadNotificationCount();
          if (res?.success && res?.data) {
            dispatch(setUnreadNotificationCount(res.data.unread_count || 0));
          }
        } catch (e) {
          console.log('Error fetching unread count header:', e);
        }

        if (userInfo.barsiq_ai_enabled) {
          try {
            const barsiqRes = await getBarsiqUnreadCount();
            if (barsiqRes?.success && typeof barsiqRes?.data === 'number') {
              setBarsiqUnreadCount(barsiqRes.data);
            }
          } catch (e) {
            console.log('Error fetching barsiq unread count header:', e);
          }
        }
      };

      // 🔹 Delay secondary fetch to prevent server overload during app boot
      const delayFetch = setTimeout(fetchUnreadCounts, 1000);

      return () => clearTimeout(delayFetch);
    }, [userInfo?.id]), // Stable dependency to avoid re-fetching on minor userInfo updates
  );

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'open_barsiq_ai_modal',
      () => {
        if (
          userInfo &&
          userInfo.user_type !== 'guest' &&
          userInfo.barsiq_ai_enabled
        ) {
          setShowBarsiqModal(true);
          setBarsiqUnreadCount(0);
          NotificationService.clearBarsiqNotifications();
          setTimeout(() => {
            markBarsiqAsRead().catch((e: any) =>
              console.log('Error marking barsiq read', e),
            );
          }, 600);
        }
      },
    );
    return () => {
      subscription.remove();
    };
  }, [userInfo]);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleProfilePress = () => {
    if (userInfo?.user_type === 'guest') {
      setShowLoginModal(true);
      return;
    }
    const state = navigation.getState();
    if (state && state.index > 0) {
      while (navigation.canGoBack()) {
        navigation.goBack();
      }
      (navigation as any).navigate(SCREEN_NAMES.BOTTOM_TABS, {
        screen: SCREEN_NAMES.PROFILE,
      });
    } else {
      (navigation as any).navigate(SCREEN_NAMES.BOTTOM_TABS, {
        screen: SCREEN_NAMES.PROFILE,
      });
    }
  };

  const handleStreakPress = () => {
    if (userInfo?.user_type === 'guest') {
      setShowLoginModal(true);
      return;
    }
    const state = navigation.getState();
    if (state && state.index > 0) {
      while (navigation.canGoBack()) {
        navigation.goBack();
      }
      (navigation as any).navigate(SCREEN_NAMES.BOTTOM_TABS, {
        screen: SCREEN_NAMES.ENGAGE_STACK,
      });
    } else {
      (navigation as any).navigate(SCREEN_NAMES.BOTTOM_TABS, {
        screen: SCREEN_NAMES.ENGAGE_STACK,
      });
    }
  };

  if (isMainTabsScreen) {
    return (
      <View style={[styles.container, styles.mainTabsHeader]}>
        <View style={styles.mainTabsLeft}>
          <TouchableOpacity
            onPress={() => {
              const state = navigation.getState();
              if (state && state.index > 0) {
                while (navigation.canGoBack()) {
                  navigation.goBack();
                }
                (navigation as any).navigate(SCREEN_NAMES.BOTTOM_TABS, {
                  screen: SCREEN_NAMES.WATCH_STACK,
                });
              } else {
                (navigation as any).navigate(SCREEN_NAMES.BOTTOM_TABS, {
                  screen: SCREEN_NAMES.WATCH_STACK,
                });
              }
            }}
            activeOpacity={0.7}
          >
            <FastImage
              source={logo360Sports as any}
              style={styles.mainLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.mainTabsRight}>
          <TouchableOpacity
            style={styles.streakContainer}
            onPress={handleStreakPress}
            activeOpacity={0.7}
          >
            <FastImage
              source={fireIcon as any}
              style={styles.streakIcon}
              resizeMode="contain"
            />
            <Text style={styles.streakText}>
              {userInfo?.user_type === 'guest'
                ? '0'
                : formatNumber(userInfo?.flare_balance ?? 0)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <View
              style={{
                overflow: 'hidden',
                borderRadius: 100,
              }}
            >
              <S3Image
                path={userInfo?.profile_picture || userInfo?.profile_url || ''}
                style={styles.profileImage}
                placeholder={profilePlaceholder}
                showLoader={false}
              />
            </View>
            {unreadNotificationCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text
                  style={[
                    styles.badgeText,
                    unreadNotificationCount > 99 && { fontSize: 7.5 },
                  ]}
                  allowFontScaling={false}
                >
                  {unreadNotificationCount > 99
                    ? '99+'
                    : unreadNotificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {userInfo?.user_type !== 'guest' && userInfo?.barsiq_ai_enabled && (
            <TouchableOpacity
              style={styles.barsiqContainer}
              activeOpacity={0.7}
              onPress={() => {
                setShowBarsiqModal(true);
                setBarsiqUnreadCount(0);
                NotificationService.clearBarsiqNotifications();
                setTimeout(() => {
                  markBarsiqAsRead().catch((e: any) =>
                    console.log('Error marking barsiq read', e),
                  );
                }, 600);
              }}
            >
              <View style={{ overflow: 'hidden', borderRadius: scale(21) }}>
                <FastImage
                  source={{ uri: userInfo.barsiq_avatar?.file_url }}
                  style={styles.barsiqImage}
                  resizeMode="contain"
                />
              </View>
              {barsiqUnreadCount > 0 && (
                <View style={styles.barsiqBadgeContainer} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* <LinearGradient colors={["#fd761581", "rgba(49, 225, 0, 0)"]} locations={[0, 1]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ position: 'absolute', bottom: -6, left: 0, right: 0, height: 6 }} /> */}

        <View
          style={{
            position: 'absolute',
            bottom: -2,
            left: 0,
            right: 0,
            height: 2,
            // backgroundColor: 'red',
            elevation: 10,
            shadowColor: Platform.OS == 'android' ? '#FD7415' : '#FD7415',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            zIndex: 2,
          }}
        />
        <ConfirmationModal
          isVisible={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onConfirm={() => {
            setShowLoginModal(false);
            dispatch(logoutUser());
          }}
          title="Login Required"
          message="Please login to access this feature and enjoy the full 360Sports experience."
          confirmText="Login"
          cancelText="Cancel"
          icon={logoSquare360Sports}
          iconBgColor="transparent"
        />

        {/* Basic Dialog for Barsiq AI */}
        <BarsiqAiModal
          isVisible={showBarsiqModal}
          onClose={() => setShowBarsiqModal(false)}
        />
      </View>
    );
  }

  if (customHeaderComponent) {
    return (
      <View style={[styles.container, styles.mainTabsHeader]}>
        {customHeaderComponent}
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.mainTabsHeader]}>
      <View style={styles.leftContainer}>
        {isBackIcon && navigation.canGoBack() && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <FastImage
              source={(backIcon ?? arrowLeftIc) as any}
              style={[styles.backIcon, backIconStyle] as any}
              resizeMode="contain"
              tintColor={colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={[
          styles.titleContainer,
          titleAlign === 'left' && { alignItems: 'flex-start' },
        ]}
      >
        {title ? (
          <Text
            style={[
              styles.title,
              titleAlign === 'left' && { textAlign: 'left' },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {title}
          </Text>
        ) : (
          showLogo && (
            <FastImage
              source={logo360Sports as any}
              style={styles.logo}
              resizeMode="contain"
            />
          )
        )}
      </View>
      <View style={styles.rightContainer}>
        {isRightIcon && isRightIcon}
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightButton}
          >
            <FastImage
              source={rightIcon as any}
              style={styles.rightIcon}
              resizeMode="contain"
              tintColor={colors.text || colors.BLACK}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: -2,
          left: 0,
          right: 0,
          height: 2,
          elevation: 10,
          shadowColor: Platform.OS == 'android' ? '#FD7415' : '#FD7415',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          zIndex: 2,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    // paddingVertical: verticalScale(5),
    backgroundColor: colors.primary,
    height: verticalScale(55),
  },
  leftContainer: {
    minWidth: scale(50),
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    minWidth: scale(50),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    ...textVariants.font_18,
    fontFamily: fonts.Bold,
    color: colors.WHITE,
    textAlign: 'center',
  },
  backButton: {
    padding: scale(5),
  },
  backIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: colors.BLACK,
  },
  rightButton: {
    padding: scale(5),
    alignItems: 'flex-end',
  },
  rightIcon: {
    width: scale(24),
    height: scale(24),
  },
  logo: {
    height: verticalScale(40),
    width: 'auto',
    aspectRatio: 2.69,
  },
  mainTabsHeader: {
    backgroundColor: colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 84, 0, 0.2)',
    // shadowColor: Platform.OS == 'android' ? '#FD7415' : '#FD7415',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // elevation: 10,
    paddingHorizontal: scale(17),
    justifyContent: 'space-between',
  },
  mainTabsLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  mainLogo: {
    height: verticalScale(35),
    width: 'auto',
    aspectRatio: 2.69,
  },
  mainTabsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
  },
  streakIcon: {
    width: scale(15),
    height: verticalScale(19),
    marginRight: scale(5),
  },
  streakText: {
    color: colors.WHITE,
    fontSize: 16,
    fontFamily: fonts.Bold,
  },
  profileContainer: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    overflow: 'visible',
  },
  profileImage: {
    width: scale(35),
    height: 'auto',
    aspectRatio: 1,
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF0054', // vibrant pink
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF', // border to contrast against profile pic
  },
  badgeText: {
    color: colors.WHITE,
    fontSize: 9,
    fontFamily: fonts.Bold,
  },
  barsiqContainer: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(21),
    borderWidth: 1,
    borderColor: colors.WHITE,
    backgroundColor: colors.whiteOverlay30,
    overflow: 'visible',
    marginLeft: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  barsiqImage: {
    width: scale(30),
    height: scale(30),
    aspectRatio: 1,
  },
  barsiqBadgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 100,
    width: scale(9),
    height: scale(9),
  },
});

export default Header;
