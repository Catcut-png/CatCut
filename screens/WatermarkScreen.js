import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { addWatermark } from '../lib/ffmpeg';

const LOGO_URI = require('../assets/cat_icon.png');

export default function WatermarkScreen({ route, navigation }) {
  const { videoUri } = route.params;
  const [subtitle, setSubtitle] = useState('Gấu Media');
  const [working, setWorking] = useState(false);

  async function handleApply() {
    setWorking(true);
    try {
      const resolvedLogo = Video.resolveAssetSource
        ? Video.resolveAssetSource(LOGO_URI).uri
        : LOGO_URI;
      const outUri = await addWatermark(videoUri, resolvedLogo, subtitle);
      navigation.navigate('Export', { videoUri: outUri });
    } catch (err) {
      Alert.alert('Lỗi khi chèn logo', err.message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <View style={styles.container}>
      <Video source={{ uri: videoUri }} style={styles.video} useNativeControls resizeMode="contain" />

      <Text style={styles.label}>Dòng chữ nhỏ của bạn</Text>
      <View style={styles.field}>
        <Text style={styles.dash}>-</Text>
        <TextInput
          style={styles.input}
          value={subtitle}
          onChangeText={setSubtitle}
          placeholder="Nhập tên kênh..."
          placeholderTextColor="#6B6A67"
        />
        <Text style={styles.dash}>-</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleApply} disabled={working}>
        {working ? <ActivityIndicator color="#26190A" /> : <Text style={styles.buttonText}>Chèn logo và tiếp tục</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C', padding: 16 },
  video: { width: '100%', aspectRatio: 9 / 16, backgroundColor: '#000', borderRadius: 12, marginBottom: 16 },
  label: { color: '#9B9A96', fontSize: 12, marginBottom: 6 },
  field: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#151517',
    borderColor: '#2E2E32', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14,
  },
  dash: { color: '#6B6A67', fontSize: 14 },
  input: { flex: 1, color: '#F0EEE9', fontSize: 14, paddingVertical: 12, textAlign: 'center' },
  button: { backgroundColor: '#E8A33D', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#26190A', fontWeight: '600', fontSize: 14 },
});
