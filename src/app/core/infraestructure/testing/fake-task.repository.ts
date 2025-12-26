import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task } from '../../domain/task.model';
import { TaskRepository } from '../../application/task.repository';

export class FakeTaskRepository implements TaskRepository {
  private readonly subject = new BehaviorSubject<Task[]>([]);
  readonly tasks$ = this.subject.asObservable();

  constructor(initial: Task[] = []) {
    this.subject.next(initial);
  }

  load(): Observable<Task[]> {
    return of(this.subject.value);
  }

  save(tasks: Task[]): Observable<void> {
    this.subject.next(tasks);
    return of(void 0);
  }
}
