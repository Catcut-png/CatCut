import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { exportVideo } from '../lib/ffmpeg';

export default function ExportScreen({ route }) {
  const { videoUri } = route.params;
  const [resolution, setResolution] = useState('1080p');
  const [ratio, setRatio] = useState('9:16');
  const [working, setWorking] = useState(false);
  const [done, setDone] = useState(null);

  async function handleExport() {
    setWorking(true);
    setDone(null);
    try {
      const outUri = await exportVideo(videoUri, resolution, ratio);
      setDone(outUri);
      Alert.alert('Xuất video xong', outUri);
    } catch (err) {
      Alert.alert('Lỗi khi xuất video', err.message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Độ phân giải</Text>
      <View style={styles.row}>
        {['720p', '1080p'].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.chip, resolution === r && styles.chipActive]}
            onPress={() => setResolution(r)}
          >
            <Text style={[styles.chipText, resolution === r && styles.chipTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Tỉ lệ khung hình</Text>
      <View style={styles.row}>
        {['16:9', '9:16'].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.chip, ratio === r && styles.chipActive]}
            onPress={() => setRatio(r)}
          >
            <Text style={[styles.chipText, ratio === r && styles.chipTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={handleExport} disabled={working}>
        {working
          ? <ActivityIndicator color="#26190A" />
          : <Text style={styles.exportText}>Xuất video {resolution} · {ratio}</Text>}
      </TouchableOpacity>

      {done && <Text style={styles.doneText}>Đã lưu: {done}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C', padding: 16 },
  sectionLabel: { color: '#9B9A96', fontSize: 12, marginTop: 18, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 10 },
  chip: {
    flex: 1, borderWidth: 1, borderColor: '#2E2E32', borderRadius: 12,
    paddingVertical: 12, alignItems: 'center', backgroundColor: '#151517',
  },
  chipActive: { borderColor: '#E8A33D', backgroundColor: '#3A2E19' },
  chipText: { color: '#F0EEE9', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#E8A33D' },
  exportButton: { backgroundColor: '#E8A33D', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 24 },
  exportText: { color: '#26190A', fontWeight: '600', fontSize: 14 },
  doneText: { color: '#9B9A96', fontSize: 11, marginTop: 12 },
});
