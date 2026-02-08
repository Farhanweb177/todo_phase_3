import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '@/components/TaskForm';
import { Task } from '@/utils/types';

const mockTask: Task = {
  id: '1',
  title: 'Existing Task',
  description: 'Existing description',
  status: 'pending',
  userId: 'user1',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

describe('TaskForm', () => {
  it('renders create form with empty fields', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
  });

  it('renders edit form with pre-filled data', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(<TaskForm task={mockTask} onSubmit={onSubmit} onCancel={onCancel} isEditing />);

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Task');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Existing description');
  });

  it('shows validation error for empty title', async () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows character count for title', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    expect(screen.getByText('0/200')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Hello' } });
    expect(screen.getByText('5/200')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button clicked', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onSubmit with form data on valid submission', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const onCancel = jest.fn();
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Task details' } });
    fireEvent.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task details',
      });
    });
  });

  it('shows Update Task button when editing', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(<TaskForm task={mockTask} onSubmit={onSubmit} onCancel={onCancel} isEditing />);

    expect(screen.getByText('Update Task')).toBeInTheDocument();
  });
});
