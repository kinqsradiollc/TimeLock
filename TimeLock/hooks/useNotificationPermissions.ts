import { useEffect, useState } from 'react';
import { NotificationService } from '@/services/NotificationService';

export function useNotificationPermissions() {
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const hasPermission = await NotificationService.hasPermissions();
    setPermissionStatus(hasPermission ? 'granted' : 'undetermined');
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const granted = await NotificationService.requestPermissions();
      setPermissionStatus(granted ? 'granted' : 'denied');
      return granted;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      setPermissionStatus('denied');
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
