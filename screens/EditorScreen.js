import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { Video } from 'expo-av';
import { trimVideo } from '../lib/ffmpeg';

export default function EditorScreen({ route, navigation }) {
  const { videoUri } = route.params;
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [working, setWorking] = useState(false);

  function onLoad(status) {
    const secs = status.durationMillis / 1000;
    setDuration(secs);
    setEnd(secs);
  }

  async function handleTrim() {
    if (end <= start) {
      Alert.alert('Chưa hợp lệ', 'Điểm kết thúc phải sau điểm bắt đầu.');
      return;
    }
    setWorking(true);
    try {
      const trimmedUri = await trimVideo(videoUri, start, end);
      navigation.navigate('Watermark', { videoUri: trimmedUri });
    } catch (err) {
      Alert.alert('Lỗi khi cắt video', err.message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        onLoad={onLoad}
      />

      <Text style={styles.label}>Bắt đầu: {start.toFixed(1)}s</Text>
      <Slider
        minimumValue={0}
        maximumValue={duration}
        value={start}
        onValueChange={setStart}
        minimumTrackTintColor="#E8A33D"
      />

      <Text style={styles.label}>Kết thúc: {end.toFixed(1)}s</Text>
      <Slider
        minimumValue={0}
        maximumValue={duration}
        value={end}
        onValueChange={setEnd}
        minimumTrackTintColor="#E8A33D"
      />

      <TouchableOpacity style={styles.button} onPress={handleTrim} disabled={working}>
        {working ? <ActivityIndicator color="#26190A" /> : <Text style={styles.buttonText}>Cắt và tiếp tục</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C', padding: 16 },
  video: { width: '100%', aspectRatio: 9 / 16, backgroundColor: '#000', borderRadius: 12, marginBottom: 16 },
  label: { color: '#9B9A96', fontSize: 12, marginBottom: 4 },
  button: { backgroundColor: '#E8A33D', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#26190A', fontWeight: '600', fontSize: 14 },
});
