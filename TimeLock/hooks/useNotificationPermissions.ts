import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export function useNotificationPermissions() {
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status as 'granted' | 'denied' | 'undetermined');
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = status;
      }

      setPermissionStatus(finalStatus as 'granted' | 'denied' | 'undetermined');
      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  return {
    permissionStatus,
    hasPermission: permissionStatus === 'granted',
    requestPermissions,
    checkPermissions,
  };
}
