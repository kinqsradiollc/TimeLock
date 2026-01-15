import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors } from '@/styles/common';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const router = useRouter();
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarIcon: () => null,
          tabBarButton: () => (
            <TouchableOpacity
              style={styles.fabWrapper}
              onPress={() => router.push('/task-form')}
              activeOpacity={0.8}
            >
              <View style={[styles.fab, { backgroundColor: colors.primary }]}>
                <Ionicons name="add" size={32} color="#fff" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: -20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
