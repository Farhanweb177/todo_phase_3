import { getTasks, getTaskById, createTask, updateTask, deleteTask, toggleTaskCompletion } from '@/services/tasks';
import apiClient from '@/services/api';

jest.mock('@/services/api');

const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

describe('Tasks Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('fetches tasks without filters', async () => {
      const mockResponse = { data: { tasks: [], total: 0 } };
      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await getTasks();

      expect(mockedApi.get).toHaveBeenCalledWith('/tasks', { params: {} });
      expect(result).toEqual(mockResponse.data);
    });

    it('passes status filter as param', async () => {
      const mockResponse = { data: { tasks: [], total: 0 } };
      mockedApi.get.mockResolvedValue(mockResponse);

      await getTasks({ status: 'pending' });

      expect(mockedApi.get).toHaveBeenCalledWith('/tasks', { params: { status: 'pending' } });
    });

    it('does not pass status param for "all"', async () => {
      const mockResponse = { data: { tasks: [], total: 0 } };
      mockedApi.get.mockResolvedValue(mockResponse);

      await getTasks({ status: 'all' });

      expect(mockedApi.get).toHaveBeenCalledWith('/tasks', { params: {} });
    });
  });

  describe('getTaskById', () => {
    it('fetches a single task', async () => {
      const mockTask = { id: '1', title: 'Test' };
      mockedApi.get.mockResolvedValue({ data: mockTask });

      const result = await getTaskById('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('sends POST request with task data', async () => {
      const taskData = { title: 'New Task', description: 'Description' };
      const mockTask = { id: '1', ...taskData, status: 'pending' };
      mockedApi.post.mockResolvedValue({ data: mockTask });

      const result = await createTask(taskData);

      expect(mockedApi.post).toHaveBeenCalledWith('/tasks', taskData);
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('sends PUT request with updated data', async () => {
      const updateData = { title: 'Updated Task' };
      const mockTask = { id: '1', title: 'Updated Task' };
      mockedApi.put.mockResolvedValue({ data: mockTask });

      const result = await updateTask('1', updateData);

      expect(mockedApi.put).toHaveBeenCalledWith('/tasks/1', updateData);
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('sends DELETE request', async () => {
      mockedApi.delete.mockResolvedValue({});

      await deleteTask('1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/tasks/1');
    });
  });

  describe('toggleTaskCompletion', () => {
    it('sends PATCH request', async () => {
      const mockTask = { id: '1', status: 'completed' };
      mockedApi.patch.mockResolvedValue({ data: mockTask });

      const result = await toggleTaskCompletion('1');

      expect(mockedApi.patch).toHaveBeenCalledWith('/tasks/1/toggle');
      expect(result).toEqual(mockTask);
    });
  });
});
