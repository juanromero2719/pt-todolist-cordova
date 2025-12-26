import { Observable, map, switchMap, take } from "rxjs";
import { Task, TaskStatus } from "../domain/task.model";
import { CreateTask } from "../domain/task.factory";
import { TaskRepository } from "./task.repository";

export class LoadTasksUseCase {
    constructor(private taskRepository: TaskRepository) {}
    execute(): Observable<Task[]> {
        return this.taskRepository.load();
    }
}

export class AddTaskUseCase {
    constructor(private taskRepository: TaskRepository) {}
    execute(title: string, category: string): Observable<Task[]> {   
        return this.taskRepository.tasks$.pipe(
            take(1),
            map(tasks => [CreateTask(title, category), ...tasks]),
            switchMap(next => this.taskRepository.save(next).pipe(map(() => next)))
        );
    }
}

export class ToggleTaskDoneUseCase {
    constructor(private taskRepository: TaskRepository) {}
    execute(id: string): Observable<Task[]> {
        return this.taskRepository.tasks$.pipe(
            take(1),
            map(tasks => 
                tasks.map(task =>
                    task.id !== id
                        ? task
                        : {
                            ...task,
                            status: (task.status === 'done' ? 'pending' : 'done') as TaskStatus,
                            completedAt: task.status === 'done' ? undefined : new Date(),
                        }
                )
            ),
            switchMap(next => this.taskRepository.save(next).pipe(map(() => next)))
        );
    }
}

export class DeleteTaskUseCase {
    constructor(private taskRepository: TaskRepository) {}
    execute(id: string): Observable<Task[]> {
        return this.taskRepository.tasks$.pipe(
            take(1),
            map(tasks => tasks.filter(task => task.id !== id)),
            switchMap(next => this.taskRepository.save(next).pipe(map(() => next)))
        );
    }
}