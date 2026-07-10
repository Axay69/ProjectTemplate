import {
  View,
  StatusBar,
  Platform,
  RefreshControlProps,
  ScrollView,
} from 'react-native';
import React from 'react';
import { styles } from './styles';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ScreenProps } from './types';
import { colors } from '@theme';
import Header from '../Header';
import KeyboardSpacer from '../KeyboardSpacer';
import { useIsFocused } from '@react-navigation/native';

const ScreenContainer: React.FC<ScreenProps> = ({
  children,
  style,
  isHeaderShown = false,
  headerProps,
  isGradientBg = false,
  wrapWithScrollview = true,
  edges = ['top', 'bottom'],
  refreshControl,
  contentContainerStyle,
  isMainTabsScreen = false,
  isStatusBarTranslucent = false,
  statusBarBgColor: propStatusBarBgColor,
  isBottomTransparent = false,
  keyScrollporps,
  useCustomKeyboardSpacer = false,
}) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  // Decide the color for the status bar area
  // If header is shown, use primary, otherwise use the provided style background or default
  const statusBarBgColor =
    propStatusBarBgColor ||
    (isHeaderShown
      ? colors.primary
      : (style as { backgroundColor?: string })?.backgroundColor ||
        colors.background);

  return (
    <View style={[styles.container, style]}>
      {isFocused && (
        <StatusBar
          translucent
          backgroundColor={
            isStatusBarTranslucent ? 'transparent' : colors.primary
          }
          barStyle="light-content"
        />
      )}

      {/* 🔹 Dedicated Status Bar Background for iOS to fill the notch area */}
      {Platform.OS === 'ios' && !isStatusBarTranslucent && (
        <View
          style={{
            height: insets.top,
            backgroundColor: statusBarBgColor,
            width: '100%',
            position: 'absolute',
            top: 0,
            zIndex: 10,
          }}
        />
      )}
      {/*
        isGradientBg is supported in props but LinearGradient
        is omitted as it is not currently a project dependency.
      */}
      {isGradientBg && (
        <View
          style={[styles.gradientBg, { backgroundColor: colors.primary }]}
        />
      )}

      <View
        style={{
          paddingTop: isHeaderShown ? insets.top : 0,
          backgroundColor: isHeaderShown ? colors.primary : 'transparent',
        }}
      >
        {isHeaderShown && (
          <Header
            {...headerProps}
            isMainTabsScreen={isMainTabsScreen || headerProps?.isMainTabsScreen}
          />
        )}
      </View>

      <SafeAreaView
        style={styles.safeAreaContent}
        edges={isHeaderShown ? (isBottomTransparent ? [] : ['bottom']) : edges}
      >
        <View style={styles.childrenWrapper}>
          {wrapWithScrollview ? (
            useCustomKeyboardSpacer ? (
              <ScrollView
                style={styles.keyboardAvoidingContainer}
                contentContainerStyle={[
                  styles.contentContainerStyle,
                  contentContainerStyle,
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  refreshControl as React.ReactElement<RefreshControlProps>
                }
                keyboardShouldPersistTaps="handled"
                {...keyScrollporps}
              >
                {children}
                <KeyboardSpacer />
              </ScrollView>
            ) : (
              <KeyboardAwareScrollView
                style={styles.keyboardAvoidingContainer}
                contentContainerStyle={[
                  styles.contentContainerStyle,
                  contentContainerStyle,
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  refreshControl as React.ReactElement<RefreshControlProps>
                }
                bottomOffset={50}
                keyboardShouldPersistTaps="handled"
                {...keyScrollporps}
              >
                {children}
              </KeyboardAwareScrollView>
            )
          ) : (
            children
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ScreenContainer;
