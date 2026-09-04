import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProjectListScreen({ navigation }) {
  async function pickVideo() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Cần quyền truy cập', 'Hãy cho phép CatCut truy cập thư viện video.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.canceled) {
      navigation.navigate('Editor', { videoUri: result.assets[0].uri });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dự án của bạn</Text>
      <Text style={styles.caption}>Chọn một video để bắt đầu chỉnh sửa</Text>

      <TouchableOpacity style={styles.fab} onPress={pickVideo}>
        <Text style={styles.fabText}>+ Chọn video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C', padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#F0EEE9', fontSize: 20, fontWeight: '600', marginBottom: 6 },
  caption: { color: '#6B6A67', fontSize: 12, marginBottom: 24 },
  fab: { backgroundColor: '#E8A33D', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24 },
  fabText: { color: '#26190A', fontWeight: '600', fontSize: 14 },
});
