import { ActivityIndicator, View, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';
import { profilePlaceholderIcon as profilePlaceholder } from '@assets/icons';
import { FastImageProps } from './types';
import { styles } from './styles';
import { downloadGenerateUrl } from '@features/profile';

const FastImages: React.FC<FastImageProps> = ({ profilePicture, style }) => {
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);

  useEffect(() => {
    if (!profilePicture) {
      setImageUri(null);
      setHasError(true); // no picture → show placeholder
      setLoading(false);
      return;
    }

    // Handle local assets (numbers)
    if (typeof profilePicture === 'number') {
      setImageUri(null); // renderSource will use profilePicture as source directly
      setHasError(false);
      setLoading(false);
      return;
    }

    // Handle source objects (e.g. { uri: 'profile_placeholder' } or { uri: 'https://...' })
    if (typeof profilePicture === 'object') {
      setImageUri(null);
      setHasError(false);
      setLoading(false);
      return;
    }

    // From here on, profilePicture should be a string
    if (typeof profilePicture === 'string') {
      // local files (picked from device)
      if (
        profilePicture.startsWith('file://') ||
        profilePicture.startsWith('content://') ||
        profilePicture.startsWith('/')
      ) {
        const uri = profilePicture.startsWith('/')
          ? `file://${profilePicture}`
          : profilePicture;
        setImageUri(uri);
        setHasError(false);
        setLoading(false);
        return;
      }

      // Remote file (S3 or server)
      if (profilePicture.startsWith('http')) {
        setImageUri(profilePicture);
        setHasError(false);
        setLoading(false);
        return;
      }

      const fetchDownloadUrl = async () => {
        setLoading(true);
        setHasError(false);
        try {
          const response = await downloadGenerateUrl({
            file_path: profilePicture,
          });
          if (response.success && response.data?.downloadUrl) {
            setImageUri(response.data.downloadUrl);
            setHasError(false);
          } else {
            setImageUri(null);
            setHasError(true);
          }
        } catch {
          setImageUri(null);
          setHasError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchDownloadUrl();
    }
  }, [profilePicture]);

  // logic for what to render
  const renderSource = hasError
    ? profilePlaceholder
    : typeof profilePicture === 'number'
    ? profilePicture
    : typeof profilePicture === 'object'
    ? profilePicture
    : imageUri
    ? { uri: imageUri, priority: FastImage.priority.normal }
    : null;

  return (
    <View style={[styles.container, style]}>
      <FastImage
        style={[
          styles.profilePicStyle,
          style,
          { opacity: loading || (imageUri && !isImageReady) ? 0 : 1 },
        ]}
        source={renderSource ?? profilePlaceholder}
        resizeMode={
          hasError || !imageUri
            ? FastImage.resizeMode.contain
            : FastImage.resizeMode.cover
        }
        onLoadStart={() => {
          if (imageUri) setIsImageReady(false);
        }}
        onLoad={() => setIsImageReady(true)}
        onError={() => {
          setHasError(true);
          setIsImageReady(true);
        }}
      />
      {(loading || (imageUri && !isImageReady)) && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <ActivityIndicator size="small" color="grey" />
        </View>
      )}
    </View>
  );
};

export default FastImages;
