// This file contains documentation and types for the native iOS Live Activity widget
// The actual widget implementation must be done in native iOS code (SwiftUI)
// This file serves as a reference for the data structure and behavior

import { LiveActivityState } from 'expo-live-activity';

export interface TaskCountdownActivityData {
  taskId: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeRemaining: number;
  deadline: string;
  isUrgent: boolean;
  isCritical: boolean;
  completed: boolean;
}

/**
 * Converts task data to LiveActivityState for the native widget
 * This function is used by the LiveActivitiesService to format data
 * for the native iOS Live Activity widget
 */
export function createTaskActivityState(data: TaskCountdownActivityData): LiveActivityState {
  const { title, description, priority, timeRemaining, isUrgent, isCritical, completed } = data;

  if (completed) {
    return {
      title: 'Task Completed! 🎉',
      subtitle: title,
    };
  }

  // Format time remaining
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  const timeString = hours > 0
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    : `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const priorityEmoji = {
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    urgent: '🔴'
  }[priority];

  let subtitle = description || 'Task in progress';
  if (isCritical) {
    subtitle += ' ⚠️ Critical - Due soon!';
  } else if (isUrgent) {
    subtitle += ' ⏰ Urgent - Due within 24hrs';
  }

  return {
    title: `${priorityEmoji} ${title}`,
    subtitle,
    progressBar: {
      date: timeRemaining, // This will show a countdown timer
    },
  };
}

/**
 * NOTE: The actual iOS Live Activity widget must be implemented in native code.
 *
 * To create the native widget:
 * 1. Create a Widget Extension target in Xcode
 * 2. Implement the widget using SwiftUI with ActivityConfiguration
 * 3. Use the data passed from startActivity() to display the countdown
 *
 * Example SwiftUI code structure:
 *
 * struct TaskCountdownActivity: Widget {
 *   var body: some WidgetConfiguration {
 *     ActivityConfiguration(for: TaskCountdownAttributes.self) { context in
 *       // Lock screen content
 *       VStack {
 *         Text(context.state.title)
 *         Text(context.state.subtitle ?? "")
 *         Text(timerInterval: context.state.targetDate ?? Date()...,
 *              countsDown: true)
 *       }
 *     } dynamicIsland: { context in
 *       // Dynamic Island content
 *       DynamicIsland {
 *         // Expanded content
 *       } compactLeading: {
 *         // Compact leading content
 *       } compactTrailing: {
 *         // Compact trailing content
 *       } minimal: {
 *         // Minimal content
 *       }
 *     }
 *   }
 * }
 */