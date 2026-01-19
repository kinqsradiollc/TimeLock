import React from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { LightColors, DarkColors } from '@/styles/common';
import { useTheme } from '@/contexts/ThemeContext';
import type { Task } from '@/types/task';

interface QRCodeModalProps {
  task: Task;
  visible: boolean;
  onClose: () => void;
}

export function QRCodeModal({ task, visible, onClose }: QRCodeModalProps) {
  const { effectiveTheme } = useTheme();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;

  // Prepare task data for sharing (exclude sensitive/internal fields)
  const shareData = {
    title: task.title,
    description: task.description,
    deadline: task.deadline,
    priority: task.priority,
    // Note: categoryId is not included as categories may differ between devices
  };

  const qrValue = JSON.stringify(shareData);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 24,
          width: '90%',
          maxWidth: 400,
          alignItems: 'center',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.textPrimary,
            }}>
              Share Task
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: colors.surfaceAlt,
              }}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={{
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 20,
          }}>
            Scan this QR code to share this task with another device
          </Text>

          <View style={{
            backgroundColor: '#000000',
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
          }}>
            <QRCode
              value={qrValue}
              size={200}
              color="#FFFFFF"
              backgroundColor="#000000"
            />
          </View>

          <Text style={{
            fontSize: 12,
            color: colors.textTertiary,
            textAlign: 'center',
          }}>
            Task: {task.title}
          </Text>
        </View>
      </View>
    </Modal>
  );
}