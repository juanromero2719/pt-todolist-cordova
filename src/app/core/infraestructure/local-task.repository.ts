import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Task } from "../domain/task.model";
import { TaskRepository } from "../application/task.repository";

const KEY = 'pt.todo.tasks.v1';

@Injectable({ providedIn: 'root'})
export class LocalTaskRepository implements TaskRepository {
    
    private readonly subject = new BehaviorSubject<Task[]>([]);
    readonly tasks$ = this.subject.asObservable();

    load(): Observable<Task[]> {
        const raw = localStorage.getItem(KEY);
        const tasks = raw ? JSON.parse(raw) as Task[] : [];
        this.subject.next(tasks);
        return of(tasks);
    }

    save(tasks: Task[]): Observable<void> {
        localStorage.setItem(KEY, JSON.stringify(tasks));
        this.subject.next(tasks);
        return of(void 0);
    }
}