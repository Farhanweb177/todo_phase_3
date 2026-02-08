'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/utils/types';
import { validateTitle, validateDescription } from '@/utils/validation';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
}

export default function TaskForm({ task, onSubmit, onCancel, isEditing = false }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const titleError = validateTitle(title);
    if (titleError) newErrors.title = titleError;

    if (description) {
      const descError = validateDescription(description);
      if (descError) newErrors.description = descError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await onSubmit({ title: title.trim(), description: description.trim() || undefined });
      } else {
        await onSubmit({ title: title.trim(), description: description.trim() || undefined });
      }
    } catch (err: unknown) {
      const { getErrorMessage } = await import('@/utils/types');
      setApiError(getErrorMessage(err, 'An error occurred. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </h2>

      {apiError && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-800">{apiError}</p>
        </div>
      )}

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 border ${
            errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'
          }`}
          placeholder="What needs to be done?"
          maxLength={200}
          disabled={isSubmitting}
        />
        <div className="mt-1 flex justify-between">
          {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
          <p className="text-xs text-gray-400 ml-auto">{title.length}/200</p>
        </div>
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          rows={3}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 border ${
            errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'
          }`}
          placeholder="Add details about this task..."
          maxLength={1000}
          disabled={isSubmitting}
        />
        <div className="mt-1 flex justify-between">
          {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          <p className="text-xs text-gray-400 ml-auto">{description.length}/1000</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Task' : 'Create Task'
          )}
        </button>
      </div>
    </form>
  );
}
