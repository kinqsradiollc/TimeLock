/**
 * Time Tracking Utilities
 * Provides comprehensive time calculation and formatting for task deadlines
 */

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
  isOverdue: boolean;
  isUrgent: boolean; // Less than 24 hours
  isCritical: boolean; // Less than 1 hour
}

export interface TimeProgress {
  percentage: number; // 0-1
  elapsed: number; // milliseconds
  total: number; // milliseconds
  remaining: number; // milliseconds
}

export interface UrgencyLevel {
  level: 'normal' | 'warning' | 'urgent' | 'critical' | 'overdue';
  color: string;
  label: string;
}

/**
 * Calculate time remaining until deadline
 */
export function calculateTimeRemaining(deadline: Date | string, now: Date = new Date()): TimeRemaining {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const timeLeft = deadlineDate.getTime() - now.getTime();
  
  const isOverdue = timeLeft < 0;
  const absTimeLeft = Math.abs(timeLeft);
  
  const days = Math.floor(absTimeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absTimeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absTimeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absTimeLeft % (1000 * 60)) / 1000);
  
  const isUrgent = !isOverdue && absTimeLeft < 24 * 60 * 60 * 1000; // Less than 24 hours
  const isCritical = !isOverdue && absTimeLeft < 60 * 60 * 1000; // Less than 1 hour
  
  return {
    days,
    hours,
    minutes,
    seconds,
    totalMilliseconds: timeLeft,
    isOverdue,
    isUrgent,
    isCritical,
  };
}

/**
 * Calculate progress from creation to deadline
 */
export function calculateProgress(
  createdAt: Date | string,
  deadline: Date | string,
  now: Date = new Date()
): TimeProgress {
  const createdDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  
  const total = deadlineDate.getTime() - createdDate.getTime();
  const elapsed = now.getTime() - createdDate.getTime();
  const remaining = deadlineDate.getTime() - now.getTime();
  
  // Ensure percentage is between 0 and 1
  const percentage = Math.min(Math.max(elapsed / total, 0), 1);
  
  return {
    percentage,
    elapsed,
    total,
    remaining,
  };
}

/**
 * Get urgency level based on time remaining
 */
export function getUrgencyLevel(timeRemaining: TimeRemaining): UrgencyLevel {
  if (timeRemaining.isOverdue) {
    return {
      level: 'overdue',
      color: '#EF4444', // Red
      label: 'Overdue',
    };
  }
  
  if (timeRemaining.isCritical) {
    return {
      level: 'critical',
      color: '#DC2626', // Dark Red
      label: 'Critical',
    };
  }
  
  if (timeRemaining.isUrgent) {
    return {
      level: 'urgent',
      color: '#F97316', // Orange
      label: 'Urgent',
    };
  }
  
  const { days } = timeRemaining;
  
  if (days <= 3) {
    return {
      level: 'warning',
      color: '#F59E0B', // Amber
      label: 'Soon',
    };
  }
  
  return {
    level: 'normal',
    color: '#3B82F6', // Blue
    label: 'On Track',
  };
}

/**
 * Get urgency color based on progress percentage
 */
export function getProgressColor(progress: number, isOverdue: boolean): string {
  if (isOverdue) return '#EF4444'; // Red
  if (progress > 0.9) return '#DC2626'; // Critical - Dark Red
  if (progress > 0.8) return '#F97316'; // Urgent - Orange
  if (progress > 0.6) return '#F59E0B'; // Warning - Amber
  return '#3B82F6'; // Normal - Blue
}

/**
 * Format time remaining as human-readable string
 */
export function formatTimeRemaining(timeRemaining: TimeRemaining, detailed: boolean = false): string {
  const { days, hours, minutes, isOverdue } = timeRemaining;
  
  if (isOverdue) {
    if (detailed) {
      if (days > 0) return `${days}d ${hours}h overdue`;
      if (hours > 0) return `${hours}h ${minutes}m overdue`;
      return `${minutes}m overdue`;
    }
    return 'Overdue';
  }
  
  if (detailed) {
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  }
  
  // Short format
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

/**
 * Format time remaining with unit
 */
export function formatTimeDisplay(timeRemaining: TimeRemaining): { value: string | number; unit: string } {
  const { days, hours, minutes, isOverdue } = timeRemaining;
  
  if (isOverdue) {
    return { value: 'Over', unit: 'due' };
  }
  
  if (days > 0) {
    return { value: days, unit: days === 1 ? 'day' : 'days' };
  }
  
  if (hours > 0) {
    return { value: hours, unit: hours === 1 ? 'hr' : 'hrs' };
  }
  
  return { value: minutes, unit: minutes === 1 ? 'min' : 'mins' };
}

/**
 * Format detailed countdown string
 */
export function formatDetailedCountdown(timeRemaining: TimeRemaining): string {
  const { days, hours, minutes, seconds, isOverdue } = timeRemaining;
  
  const parts: string[] = [];
  
  if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours > 0 || days > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (days === 0 && hours === 0) parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  
  const timeString = parts.join(', ');
  
  return isOverdue ? `${timeString} overdue` : `${timeString} remaining`;
}

/**
 * Check if task should show urgent indicator
 */
export function shouldShowUrgentIndicator(timeRemaining: TimeRemaining): boolean {
  return !timeRemaining.isOverdue && (timeRemaining.isUrgent || timeRemaining.isCritical);
}

/**
 * Get progress percentage (0-100) for UI display
 */
export function getProgressPercentage(progress: TimeProgress): number {
  return Math.round(progress.percentage * 100);
}

/**
 * Calculate time tracking statistics for a list of tasks
 */
export interface TimeTrackingStats {
  totalTasks: number;
  overdueTasks: number;
  urgentTasks: number;
  criticalTasks: number;
  completedTasks: number;
  averageTimeRemaining: number; // milliseconds
}

export function calculateTimeTrackingStats(
  tasks: Array<{ deadline: Date | string; completed: boolean; createdAt: Date | string }>,
  now: Date = new Date()
): TimeTrackingStats {
  const stats: TimeTrackingStats = {
    totalTasks: tasks.length,
    overdueTasks: 0,
    urgentTasks: 0,
    criticalTasks: 0,
    completedTasks: 0,
    averageTimeRemaining: 0,
  };
  
  let totalTimeRemaining = 0;
  let activeTaskCount = 0;
  
  tasks.forEach(task => {
    if (task.completed) {
      stats.completedTasks++;
      return;
    }
    
    const timeRemaining = calculateTimeRemaining(task.deadline, now);
    
    if (timeRemaining.isOverdue) {
      stats.overdueTasks++;
    } else {
      activeTaskCount++;
      totalTimeRemaining += timeRemaining.totalMilliseconds;
      
      if (timeRemaining.isCritical) {
        stats.criticalTasks++;
      } else if (timeRemaining.isUrgent) {
        stats.urgentTasks++;
      }
    }
  });
  
  if (activeTaskCount > 0) {
    stats.averageTimeRemaining = totalTimeRemaining / activeTaskCount;
  }
  
  return stats;
}
