import { ActivityIndicator, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import FastImage, { Source } from 'react-native-fast-image';
import { profilePlaceholderIcon } from '@assets/icons';
import { FastImageProps } from './types';
import { styles } from './styles';
import { downloadGenerateUrl } from '@features/profile/services/profile.service';

const FastImages: React.FC<FastImageProps> = ({
  profilePicture,
  style,
  styleActivityIndicator,
}) => {
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!profilePicture) {
      setImageUri(null);
      setHasError(true); // no picture → show placeholder
      setLoading(false);
      return;
    }

    // local files (picked from device)
    if (
      profilePicture.startsWith('file://') ||
      profilePicture.startsWith('content://')
    ) {
      setImageUri(profilePicture);
      setHasError(false);
      setLoading(false);
      return;
    }

    // Remote file (S3 or server)
    const fetchDownloadUrl = async () => {
      setLoading(true);
      try {
        const response = await downloadGenerateUrl({
          file_path: profilePicture,
        });
        if (response.success && response.data?.downloadUrl) {
          setImageUri(response.data.downloadUrl);
        } else {
          setImageUri(null);
          setHasError(true);
        }
      } catch {
        setImageUri(null);
        setHasError(true);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    // Trigger URL fetch
    fetchDownloadUrl();
  }, [profilePicture]);

  // logic for what to render
  const renderSource: Source | number = hasError
    ? (profilePlaceholderIcon as number)
    : imageUri
    ? { uri: imageUri, priority: FastImage.priority.normal }
    : (profilePlaceholderIcon as number);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={[styleActivityIndicator]}>
          <ActivityIndicator size="small" color="grey" style={styles.loader} />
        </View>
      ) : (
        <FastImage
          style={[styles.profilePicStyle, style]}
          source={renderSource}
          resizeMode={FastImage.resizeMode.contain}
          onError={() => setHasError(true)}
          defaultSource={profilePlaceholderIcon as number}
        />
      )}
    </View>
  );
};

export default FastImages;
