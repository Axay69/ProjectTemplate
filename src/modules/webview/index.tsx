import { View, Linking } from 'react-native';
import React, { useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useNavigationState } from '@app/navigation';
import { ToastManager } from '@shared/utils/toast/ToastManager';
import { ScreenContainer, TitleHeader } from '@shared/components';
import { leftBackIcon } from '@shared/assets/icons';
import { styles } from './styles';
import Logger from '@core/logger';
import WebView from 'react-native-webview';
import { getWebUri } from '@features/profile/services/profile.service';

type WebViewRouteParams = { title?: string; uriType?: string };

const WebViewScreen = () => {
  const route =
    useRoute<
      RouteProp<{ WebViewScreen: WebViewRouteParams }, 'WebViewScreen'>
    >();
  const title = route?.params?.title ?? 'WebView';
  const uriType = route?.params?.uriType;
  const navigation = useNavigationState();
  const [webUri, setWebUri] = useState<string>();
  const [webKey, setWebKey] = useState<number>(0);
  const [_loading, setLoading] = useState(false);

  React.useEffect(() => {
    const getUrlApi = async () => {
      setLoading(true);
      const req = {
        content_type: uriType ?? '',
      };
      const response = await getWebUri(req);
      setLoading(false);
      if (response.success) {
        setWebUri(response.data?.content);
        setWebKey(prev => prev + 1);
      } else {
        ToastManager.showError(response.message || '');
      }
    };
    getUrlApi();
  }, [uriType, title]);

  return (
    <ScreenContainer>
      <TitleHeader
        title={title}
        leftIcon={leftBackIcon}
        onPressLeft={() => navigation.goBack()}
      />
      <View style={styles.webContainer}>
        {webUri && (
          <WebView
            key={webKey}
            source={{ uri: webUri }}
            startInLoadingState={true}
            originWhitelist={['*']}
            bounces={false}
            injectedJavaScript={`
          const meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
          document.head.appendChild(meta);
        `}
            allowUniversalAccessFromFileURLs={true}
            onShouldStartLoadWithRequest={event => {
              const requestedUrl = event.url;

              if (requestedUrl.startsWith('mailto:')) {
                Linking.openURL(requestedUrl).catch(err =>
                  Logger.error('Failed to open mail client:', err),
                );
                return false;
              }

              return true;
            }}
            onError={syntheticEvent => {
              const { nativeEvent } = syntheticEvent;
              Logger.error('WebView error:', nativeEvent);
              ToastManager.showError('Failed to load content');
            }}
            onHttpError={() => {
              ToastManager.showError('Network error loading content');
            }}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

export default WebViewScreen;
