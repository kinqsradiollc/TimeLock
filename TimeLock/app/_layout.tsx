import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import 'react-native-reanimated';

import { DatabaseMigrations } from '@/database/migrations';
import { NotificationPermissionModal } from '@/components/NotificationPermissionModal';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { LightColors, DarkColors } from '@/styles/common';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;
  const router = useRouter();

  // Handle notification taps - navigate to task detail
  useEffect(() => {
    // Handle notification tap when app is in foreground or background
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const taskId = response.notification.request.content.data.taskId;
      
      if (taskId) {
        console.log(`[Notifications] Tapped notification for task ${taskId}, navigating to detail...`);
        
        // Navigate to task detail screen
        router.push({
          pathname: '/task-detail',
          params: { id: taskId.toString() }
        });
      }
    });

    return () => subscription.remove();
  }, [router]);
  
  const navigationTheme = effectiveTheme === 'dark' 
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: DarkColors.background,
          card: DarkColors.surface,
          border: DarkColors.border,
          notification: DarkColors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: LightColors.background,
          card: LightColors.surface,
          border: LightColors.border,
          notification: LightColors.primary,
        },
      };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NavigationThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }} 
          />
          <Stack.Screen 
            name="task-form" 
            options={{ 
              presentation: 'modal',
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }} 
          />
          <Stack.Screen 
            name="task-detail" 
            options={{ 
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }} 
          />
          <Stack.Screen 
            name="category-manager" 
            options={{ 
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }} 
          />
          <Stack.Screen 
            name="settings" 
            options={{ 
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }} 
          />
        </Stack>
        
        <StatusBar style={effectiveTheme === 'dark' ? 'light' : 'dark'} />
        <NotificationPermissionModal />
      </NavigationThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        console.log('[App] Initializing database...');
        await DatabaseMigrations.runMigrations();
        setIsDbReady(true);
        console.log('[App] Database ready');
      } catch (error) {
        console.error('[App] Database initialization failed:', error);
        setDbError(error instanceof Error ? error.message : 'Unknown error');
      }
    }

    initializeDatabase();
  }, []);

  if (dbError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'red' }}>
          Database Error
        </Text>
        <Text style={{ textAlign: 'center' }}>{dbError}</Text>
      </View>
    );
  }

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Initializing database...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
