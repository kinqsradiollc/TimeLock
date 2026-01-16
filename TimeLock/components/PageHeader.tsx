import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors } from '@/styles/common';
import { pageHeaderStyles as styles } from '@/styles/components/pageHeader.styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useHaptics } from '@/hooks/useHaptics';

interface StatCard {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  value: number | string;
  label: string;
  onPress?: () => void;
  active?: boolean;
}

interface FilterOption {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

interface PageHeaderProps {
  greeting?: string;
  title: string;
  showAvatar?: boolean;
  onAvatarPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showSettings?: boolean;
  onSettingsPress?: () => void;
  stats?: StatCard[];
  filters?: FilterOption[];
}

export function PageHeader({
  greeting,
  title,
  showAvatar = true,
  onAvatarPress,
  showBackButton = false,
  onBackPress,
  showSettings = true,
  onSettingsPress,
  stats,
  filters,
}: PageHeaderProps) {
  const { effectiveTheme } = useTheme();
  const haptics = useHaptics();
  const colors = effectiveTheme === 'dark' ? DarkColors : LightColors;

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      {/* Header Top */}
      <View style={styles.headerTop}>
        {showBackButton && (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            onPress={() => {
              haptics.light();
              onBackPress?.();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.greetingContainer}>
          {greeting && (
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {greeting}
            </Text>
          )}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
        </View>
        {showSettings && (
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: colors.surface }]}
            onPress={() => {
              haptics.light();
              onSettingsPress?.();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        {showAvatar && (
          <TouchableOpacity
            style={[styles.avatarButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              haptics.light();
              onAvatarPress?.();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Cards */}
      {stats && stats.length > 0 && (
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => {
            const StatWrapper = stat.onPress ? TouchableOpacity : View;
            return (
              <StatWrapper
                key={index}
                style={[
                  styles.statCard,
                  { 
                    backgroundColor: colors.surface,
                    borderWidth: stat.active ? 2 : 0,
                    borderColor: stat.active ? colors.primary : 'transparent',
                  },
                ]}
                onPress={stat.onPress ? () => {
                  haptics.light();
                  stat.onPress?.();
                } : undefined}
                activeOpacity={stat.onPress ? 0.7 : 1}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: stat.iconBgColor },
                  ]}
                >
                  <Ionicons name={stat.icon} size={20} color={stat.iconColor} />
                </View>
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                    {stat.value}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {stat.label}
                  </Text>
                </View>
              </StatWrapper>
            );
          })}
        </View>
      )}

      {/* Filter Pills */}
      {filters && filters.length > 0 && (
        <View style={styles.filterContainer}>
          {filters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterPill,
                filter.active && styles.filterPillActive,
                {
                  backgroundColor: filter.active
                    ? colors.primary
                    : colors.surface,
                },
              ]}
              onPress={() => {
                haptics.light();
                filter.onPress?.();
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  filter.active && styles.filterTextActive,
                  !filter.active && { color: colors.textSecondary },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
