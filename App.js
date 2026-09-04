import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProjectListScreen from './screens/ProjectListScreen';
import EditorScreen from './screens/EditorScreen';
import WatermarkScreen from './screens/WatermarkScreen';
import ExportScreen from './screens/ExportScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={{
      dark: true,
      colors: {
        primary: '#E8A33D', background: '#0B0B0C', card: '#151517',
        text: '#F0EEE9', border: '#2E2E32', notification: '#E8A33D',
      },
    }}>
      <Stack.Navigator initialRouteName="ProjectList">
        <Stack.Screen name="ProjectList" component={ProjectListScreen} options={{ title: 'CatCut' }} />
        <Stack.Screen name="Editor" component={EditorScreen} options={{ title: 'Chỉnh sửa' }} />
        <Stack.Screen name="Watermark" component={WatermarkScreen} options={{ title: 'Logo & watermark' }} />
        <Stack.Screen name="Export" component={ExportScreen} options={{ title: 'Xuất video' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
