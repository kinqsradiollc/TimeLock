import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { TaskRepository } from '@/repositories/TaskRepository';
import { PageHeader } from '@/components/PageHeader';
import { LightColors, DarkColors } from '@/styles/common';
import { scanQRStyles as styles } from '@/styles/screens/scanQR.styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useHaptics } from '@/hooks/useHaptics';
import type { Task } from '@/types/task';

export default function ScanQRScreen() {
  const router = useRouter();
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;
  const haptics = useHaptics();

  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [hasScanned, setHasScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!processing && isScanning && !hasScanned) {
      setProcessing(true);
      setHasScanned(true);
      setIsScanning(false);
      haptics.success();
      processScannedCode(data);
    }
  };

  const processScannedCode = async (value: string) => {
    try {
      const taskData = JSON.parse(value);
      
      // Validate the data
      if (!taskData.title || !taskData.deadline || !taskData.priority) {
        Alert.alert('Invalid QR Code', 'The scanned QR code does not contain valid task data.', [
          {
            text: 'OK',
            onPress: () => {
              setIsScanning(true);
              setHasScanned(false);
              setProcessing(false);
            },
          },
        ]);
        return;
      }

      // Create new task
      const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title: taskData.title,
        description: taskData.description || undefined,
        deadline: taskData.deadline,
        priority: taskData.priority as 'low' | 'medium' | 'high' | 'urgent',
        completed: false,
        categoryId: undefined,
        isActive: true,
        notifications: [],
      };

      await TaskRepository.create(newTask);
      
      router.replace('/');
    } catch (error) {
      console.error('Failed to process scanned code:', error);
      Alert.alert('Error', 'Failed to import task from QR code.', [
        {
          text: 'OK',
          onPress: () => {
            setIsScanning(true);
            setHasScanned(false);
            setProcessing(false);
          },
        },
      ]);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <PageHeader
          title="Scan QR Code"
          showBackButton={true}
          onBackPress={() => router.back()}
          showSettings={false}
        />
        <View style={styles.permissionContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <PageHeader
          title="Scan QR Code"
          showBackButton={true}
          onBackPress={() => router.back()}
          showSettings={false}
        />
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.permissionTitle, { color: colors.textPrimary }]}>
            Camera Permission Required
          </Text>
          <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
            To scan QR codes, we need access to your camera.
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PageHeader
        title="Scan QR Code"
        showBackButton={true}
        onBackPress={() => router.back()}
        showSettings={false}
        showAvatar={false}
      />

      <View style={styles.cameraContainer}>
        {isScanning && (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
        )}
        
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          
          <Text style={[styles.instructionText, { color: colors.surface }]}>
            Position QR code within the frame
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}