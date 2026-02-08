import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '@/components/TaskItem';
import { Task } from '@/utils/types';

const mockPendingTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test description',
  status: 'pending',
  userId: 'user1',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

const mockCompletedTask: Task = {
  ...mockPendingTask,
  id: '2',
  status: 'completed',
  completedAt: '2025-01-02T00:00:00Z',
};

describe('TaskItem', () => {
  it('renders task title and description', () => {
    render(<TaskItem task={mockPendingTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('shows pending status badge for pending tasks', () => {
    render(<TaskItem task={mockPendingTask} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows completed status badge for completed tasks', () => {
    render(<TaskItem task={mockCompletedTask} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('applies line-through styling for completed tasks', () => {
    render(<TaskItem task={mockCompletedTask} />);
    const title = screen.getByText('Test Task');
    expect(title.className).toContain('line-through');
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = jest.fn();
    render(<TaskItem task={mockPendingTask} onToggle={onToggle} />);
    const checkbox = screen.getByRole('button', { name: /mark as completed/i });
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<TaskItem task={mockPendingTask} onEdit={onEdit} />);
    const editBtn = screen.getByRole('button', { name: /edit task/i });
    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(mockPendingTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<TaskItem task={mockPendingTask} onDelete={onDelete} />);
    const deleteBtn = screen.getByRole('button', { name: /delete task/i });
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('does not render edit/delete buttons when callbacks not provided', () => {
    render(<TaskItem task={mockPendingTask} />);
    expect(screen.queryByRole('button', { name: /edit task/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete task/i })).not.toBeInTheDocument();
  });

  it('displays created date', () => {
    render(<TaskItem task={mockPendingTask} />);
    expect(screen.getByText(/created/i)).toBeInTheDocument();
  });
});
