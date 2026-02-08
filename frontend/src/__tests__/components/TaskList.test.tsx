import { render, screen } from '@testing-library/react';
import TaskList from '@/components/TaskList';
import { Task } from '@/utils/types';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'First Task',
    description: 'First description',
    status: 'pending',
    userId: 'user1',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Second Task',
    status: 'completed',
    userId: 'user1',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    completedAt: '2025-01-02T12:00:00Z',
  },
];

describe('TaskList', () => {
  it('renders empty state when no tasks', () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText(/get started by creating your first task/i)).toBeInTheDocument();
  });

  it('renders create task link in empty state', () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('renders all tasks', () => {
    render(<TaskList tasks={mockTasks} />);
    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
  });

  it('passes callbacks to TaskItem components', () => {
    const onToggle = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(
      <TaskList
        tasks={mockTasks}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    // Verify edit buttons are rendered (meaning callbacks were passed)
    const editButtons = screen.getAllByRole('button', { name: /edit task/i });
    expect(editButtons).toHaveLength(2);
  });
});
