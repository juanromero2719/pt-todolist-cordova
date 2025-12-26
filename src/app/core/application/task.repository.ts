import { Observable } from "rxjs";
import { Task } from "../domain/task.model";

export interface TaskRepository {
    tasks$: Observable<Task[]>;
    load(): Observable<Task[]>;
    save(tasks: Task[]): Observable<void>;
}