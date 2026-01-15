import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { TaskRepository } from '../repositories/TaskRepository';
import { DatabaseMigrations } from '../database/migrations';
import { CategoryRepository } from '@/repositories/CategoryRepository';

export default function DebugScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [log, setLog] = useState<string[]>([]);

  function appendLog(line: string) {
    setLog((l) => [line, ...l].slice(0, 50));
    // also console.log for Metro
    console.log('[Debug]', line);
  }

  async function runMigrations() {
    appendLog('Running migrations...');
    try {
      await DatabaseMigrations.runMigrations();
      appendLog('Migrations completed');
    } catch (err: any) {
      appendLog('Migrations failed: ' + (err?.message ?? String(err)));
    }
  }

  async function loadTasks() {
    try {
      const all = await TaskRepository.findAll();
      setTasks(all as any[]);
      appendLog(`Loaded ${all.length} tasks`);
    } catch (err: any) {
      appendLog('Failed to load tasks: ' + (err?.message ?? String(err)));
    }
  }

  async function loadCategories() {
    appendLog('Loading categories...');
    try {
      const categories = await CategoryRepository.findAll();
      setCategories(categories as any[]);
      appendLog(`Loaded ${categories.length} categories`);
    } catch (err: any) {
      appendLog('Failed to load categories: ' + (err?.message ?? String(err)));
    }
  }

  async function createSampleData() {
    appendLog('Creating sample data...');
    try {
      // Find or create sample categories
      let workCatId: number;
      let personalCatId: number;

      const existingCategories = await CategoryRepository.findAll();
      const workCategory = existingCategories.find(c => c.name === 'Work');
      const personalCategory = existingCategories.find(c => c.name === 'Personal');

      if (workCategory) {
        workCatId = workCategory.id!;
        appendLog('Using existing Work category');
      } else {
        workCatId = await CategoryRepository.create({
          name: 'Work',
          color: '#3B82F6',
        });
        appendLog('Created Work category');
      }

      if (personalCategory) {
        personalCatId = personalCategory.id!;
        appendLog('Using existing Personal category');
      } else {
        personalCatId = await CategoryRepository.create({
          name: 'Personal',
          color: '#10B981',
        });
        appendLog('Created Personal category');
      }

      // Create sample tasks
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      await TaskRepository.create({
        title: 'Finish project proposal',
        description: 'Complete the Q1 project proposal document',
        deadline: tomorrow.toISOString(),
        completed: false,
        priority: 'high',
        categoryId: workCatId,
        notifications: [1440, 120], // 1 day and 2 hours before
        isActive: true,
      });

      await TaskRepository.create({
        title: 'Buy groceries',
        description: 'Weekly grocery shopping',
        deadline: nextWeek.toISOString(),
        completed: false,
        priority: 'medium',
        categoryId: personalCatId,
        notifications: [1440], // 1 day before
        isActive: true,
      });

      await TaskRepository.create({
        title: 'Call dentist',
        description: 'Schedule annual checkup',
        deadline: nextWeek.toISOString(),
        completed: false,
        priority: 'low',
        categoryId: personalCatId,
        notifications: [2880], // 2 days before
        isActive: true,
      });

      appendLog('Created sample tasks');
      await loadTasks();
      await loadCategories();
    } catch (err: any) {
      appendLog('Failed to create sample data: ' + (err?.message ?? String(err)));
    }
  }

  async function resetDatabase() {
    appendLog('Resetting database...');
    try {
      await DatabaseMigrations.resetDatabase();
      appendLog('Database reset complete');
      await loadTasks();
      await loadCategories();
    } catch (err: any) {
      appendLog('Reset failed: ' + (err?.message ?? String(err)));
    }
  }

  useEffect(() => {
    // load tasks and categories on mount
    loadTasks();
    loadCategories();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Debug</Text>
      <View style={{ marginBottom: 8 }}>
        <Button title="Run Migrations" onPress={runMigrations} />
      </View>
      <View style={{ marginBottom: 8 }}>
        <Button title="Load Categories" onPress={loadCategories} />
      </View>
      <View style={{ marginBottom: 8 }}>
        <Button title="Create Sample Data" onPress={createSampleData} />
      </View>
      <View style={{ marginBottom: 8 }}>
        <Button title="⚠️ Reset Database" onPress={resetDatabase} color="red" />
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 12 }}>Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {}}>
            <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text style={{ fontWeight: '600' }}>{item.title}</Text>
              <Text>{item.deadline}</Text>
              <Text>Completed: {item.completed ? 'yes' : 'no'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 12 }}>Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {}}>
            <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text style={{ fontWeight: '600' }}>{item.name}</Text>
              <Text>Color: {item.color}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 12 }}>Logs</Text>
      <FlatList
        data={log}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item }) => <Text style={{ fontSize: 12 }}>{item}</Text>}
      />
    </View>
  );
}
