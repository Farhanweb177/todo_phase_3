'use client';

import Link from 'next/link';
import { Task } from '@/utils/types';

interface TaskItemProps {
  task: Task;
  onToggle?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'completed';

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`bg-white border rounded-lg p-4 transition-all hover:shadow-md ${
        isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle checkbox */}
        <button
          onClick={() => onToggle?.(task.id)}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isCompleted
              ? 'bg-success border-success text-white'
              : 'border-gray-300 hover:border-primary'
          }`}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/dashboard/tasks/${task.id}`}
            className={`text-base font-medium hover:text-primary transition-colors ${
              isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}
          >
            {task.title}
          </Link>

          {task.description && (
            <p
              className={`mt-1 text-sm ${
                isCompleted ? 'text-gray-400 line-through' : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Task metadata */}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
            <span>Created {formatDate(task.createdAt)}</span>
            {task.completedAt && (
              <span>Completed {formatDate(task.completedAt)}</span>
            )}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                isCompleted
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {isCompleted ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-gray-400 hover:text-primary rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 text-gray-400 hover:text-danger rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
