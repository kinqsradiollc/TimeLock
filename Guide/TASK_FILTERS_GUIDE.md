# Task Filtering & Management Guide

## Overview
The Tasks screen now includes comprehensive filtering and task management features to keep your task list clean and organized.

## Features Implemented

### 1. **Working Filters**
The filter buttons now properly filter tasks:

- **All**: Shows all active tasks (and completed if toggled on)
- **Today**: Shows only tasks with deadlines today
- **Upcoming**: Shows only tasks with deadlines in the future

### 2. **Completed Tasks Toggle**
- Click the eye icon in the header to show/hide completed tasks
- By default, completed tasks are **hidden** to keep the list clean
- Toggle on to review what you've accomplished

### 3. **Overdue Tasks Section**
Tasks that are past their deadline and not completed appear in a special **"🔴 Overdue"** section at the top of the list:
- Always appears first when there are overdue tasks
- Helps you immediately see what needs urgent attention
- Only shows incomplete tasks that are past due

### 4. **Date Grouping**
Tasks are organized by date:
- **🔴 Overdue**: Past-due incomplete tasks
- **Today**: Tasks due today
- **Tomorrow**: Tasks due tomorrow
- **Specific dates**: Future tasks grouped by date (e.g., "Wed, Jan 15")

## How It Works

### Filter Logic
```
1. Start with all tasks
2. Filter by completion status (hide completed if toggle is off)
3. Apply time filter:
   - All: Show all tasks
   - Today: Only tasks with deadline === today
   - Upcoming: Only tasks with deadline > today
4. Separate into overdue and upcoming
5. Group by date and display
```

### What Happens to Different Task Types

**Completed Tasks**:
- Hidden by default (cleaner list)
- Can be shown by toggling the eye icon
- Still included in "Done" stat in header

**Overdue Tasks**:
- Shown in red "Overdue" section at top
- Only appears for incomplete tasks past their deadline
- Sorted by deadline (oldest first)

**Yesterday's Tasks**:
- If incomplete → Appears in "Overdue" section
- If completed → Hidden by default (toggle eye to see)

**Today's Tasks**:
- Grouped under "Today" section
- Sorted by deadline time

**Future Tasks**:
- Grouped by their specific date
- Sections sorted chronologically

## UI Changes

### Header Stats
- **Active**: Count of incomplete tasks
- **Done**: Count of completed tasks

### Filter Buttons
- Active filter is highlighted
- Click to switch between All/Today/Upcoming

### Show/Hide Completed Toggle
- Eye icon indicates current state
- Click to toggle visibility of completed tasks

## Benefits

✅ **Cleaner List**: Completed tasks hidden by default  
✅ **Better Focus**: See only what matters for your selected timeframe  
✅ **Urgent Visibility**: Overdue tasks always at top in red  
✅ **Flexible Views**: Toggle between different perspectives  
✅ **Better Organization**: Date grouping keeps everything structured  

## Tips

- Start your day with the "Today" filter to focus on what's due
- Use "Upcoming" to plan ahead
- Check "Overdue" section regularly to catch up
- Toggle completed tasks on occasionally to see your progress
- Use "All" when you want the complete picture
