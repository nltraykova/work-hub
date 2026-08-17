import * as z from 'zod';

export const createProjectSchema = z.object({
    name: z.string()
        .trim()
        .min(3, { error: 'Project must be at least 3 characters long' })
        .max(80, { error: 'Project must not exceed 80 characters' }),
    description: z.string()
        .trim()
        .max(500, { error: 'Description must not exceed 500 characters' })
        .optional(),
});

export const editProjectSchema = createProjectSchema.extend({
    status: z.enum(
        ['ACTIVE', 'COMPLETED', 'ARCHIVED'],
        { error: 'Invalid status' },
    ),
});
