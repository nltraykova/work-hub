import * as z from 'zod';

export const createTaskSchema = z.object({
    title: z.string()
        .trim()
        .min(3, { error: 'Title must be at least 3 characters long'})
        .max(120, { error: 'Title must not exceed 120 characters'}),
    description: z.string()
        .trim()
        .max(1000, { error: 'Description must not exceed 1000 characters' })
        .optional(),
    status: z.enum(
        ['TODO', 'IN_PROGRESS', 'COMPLETED'],
        { error: 'Invalid status'}
    ),
    priority: z.enum(
        ['LOW', 'MEDIUM', 'HIGH'],
        { error: 'Invalid priority'}
    ),
    assigneeId: z.string()
        .trim()
        .transform(value => value || undefined)
        .optional(),
    dueDate: z.string()
        .transform(value => value ? new Date(value) : undefined)
        .optional(),
});