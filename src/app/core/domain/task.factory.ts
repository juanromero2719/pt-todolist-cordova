import { Task } from "./task.model";

export function CreateTask(title: string, category: string): Task {
    
    const now = Date.now();
    
    return {
        id: crypto.randomUUID(),
        title: title.trim(),
        category: category.trim() || 'general',
        status: 'pending',
        createdAt: now,
    }
}