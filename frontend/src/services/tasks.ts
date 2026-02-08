import apiClient from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Task, TasksResponse, CreateTaskRequest, UpdateTaskRequest, TaskFilter } from '@/utils/types';

// Get all tasks for authenticated user
export const getTasks = async (filters?: TaskFilter): Promise<TasksResponse> => {
  const params: Record<string, string> = {};

  if (filters?.status && filters.status !== 'all') {
    params.status_filter = filters.status;
  }

  if (filters?.sortBy) {
    params.sortBy = filters.sortBy;
  }

  if (filters?.sortOrder) {
    params.sortOrder = filters.sortOrder;
  }

  const response = await apiClient.get<TasksResponse>(API_ENDPOINTS.TASKS.BASE, { params });
  return response.data;
};

// Get a specific task by ID
export const getTaskById = async (id: string): Promise<Task> => {
  const response = await apiClient.get<Task>(API_ENDPOINTS.TASKS.BY_ID(id));
  return response.data;
};

// Create a new task
export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await apiClient.post<Task>(API_ENDPOINTS.TASKS.BASE, data);
  return response.data;
};

// Update an existing task
export const updateTask = async (id: string, data: UpdateTaskRequest): Promise<Task> => {
  const response = await apiClient.put<Task>(API_ENDPOINTS.TASKS.BY_ID(id), data);
  return response.data;
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.TASKS.BY_ID(id));
};

// Toggle task completion status
export const toggleTaskCompletion = async (id: string): Promise<Task> => {
  const response = await apiClient.patch<Task>(API_ENDPOINTS.TASKS.TOGGLE(id));
  return response.data;
};
