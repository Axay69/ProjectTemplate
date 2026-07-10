import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  StatusBar,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { colors } from '@theme';
import Header, { HeaderProps } from '../Header';
import { useIsFocused } from '@react-navigation/native';

interface SimpleScreenContainerProps {
  children: React.ReactNode;
  safeAreaStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  topInsetsColor?: string;
  bottomInsetsColor?: string;
  barStyle?: 'light-content' | 'dark-content';
  isHeaderShown?: boolean;
  headerProps?: HeaderProps;
  isMainTabsScreen?: boolean;
  bottomEdgeTransperent?: boolean;
  topEdgeTransperent?: boolean;
  isFullScreen?: boolean;
}

const SimpleScreenContainer: React.FC<SimpleScreenContainerProps> = ({
  children,
  safeAreaStyle,
  containerStyle,
  topInsetsColor = colors.primary,
  bottomInsetsColor = colors.background,
  barStyle = 'light-content',
  isHeaderShown = false,
  headerProps,
  isMainTabsScreen = false,
  bottomEdgeTransperent = false,
  topEdgeTransperent = false,
  isFullScreen = false,
}) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const finalTopInsetsColor = topEdgeTransperent
    ? 'transparent'
    : topInsetsColor;

  return (
    <View style={styles.flex}>
      {isFocused && (
        <StatusBar
          barStyle={barStyle}
          backgroundColor="transparent"
          translucent
        />
      )}

      {isHeaderShown && !isFullScreen ? (
        <View
          style={{
            paddingTop: insets.top,
            backgroundColor: finalTopInsetsColor,
          }}
        >
          <Header
            {...headerProps}
            isMainTabsScreen={isMainTabsScreen || headerProps?.isMainTabsScreen}
          />
        </View>
      ) : !isFullScreen ? (
        /* Top SafeAreaView to handle the top inset color */
        <SafeAreaView
          style={{
            flex: 0,
            backgroundColor: finalTopInsetsColor || 'transparent',
          }}
          edges={topEdgeTransperent ? [] : ['top']}
        />
      ) : null}

      {/* Main SafeAreaView to handle the bottom, left, and right insets */}
      <SafeAreaView
        style={[
          styles.flex,
          { backgroundColor: bottomInsetsColor || 'transparent' },
          safeAreaStyle,
        ]}
        edges={isFullScreen || bottomEdgeTransperent ? [] : ['bottom']}
      >
        <View style={[styles.flex, containerStyle]}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default SimpleScreenContainer;
