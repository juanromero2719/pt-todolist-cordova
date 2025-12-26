import { firstValueFrom } from 'rxjs';
import { FakeTaskRepository } from '../infraestructure/testing/fake-task.repository';
import { AddTaskUseCase, ToggleTaskDoneUseCase, DeleteTaskUseCase, LoadTasksUseCase } from './todo.usecases';
import { Task } from '../domain/task.model';

describe('Todo UseCases', () => {
  it('LoadTasksUseCase loads tasks', async () => {
    const initial: Task[] = [
      { id: '1', title: 'A', category: 'work', status: 'pending', createdAt: 1 },
    ];
    const repo = new FakeTaskRepository(initial);
    const uc = new LoadTasksUseCase(repo);

    const tasks = await firstValueFrom(uc.execute());
    expect(tasks.length).toBe(1);
    expect(tasks[0].id).toBe('1');
  });

  it('AddTaskUseCase adds a task and persists', async () => {
    const repo = new FakeTaskRepository([]);
    const uc = new AddTaskUseCase(repo);

    const tasks = await firstValueFrom(uc.execute('Comprar leche', 'home'));
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Comprar leche');
    expect(tasks[0].category).toBe('home');

    const persisted = await firstValueFrom(repo.tasks$);
    expect(persisted.length).toBe(1);
  });

  it('ToggleTaskDoneUseCase toggles status and persists', async () => {
    const repo = new FakeTaskRepository([
      { id: '1', title: 'A', category: 'work', status: 'pending', createdAt: 1 },
    ]);
    const uc = new ToggleTaskDoneUseCase(repo);

    const tasks = await firstValueFrom(uc.execute('1'));
    expect(tasks[0].status).toBe('done');

    const tasks2 = await firstValueFrom(uc.execute('1'));
    expect(tasks2[0].status).toBe('pending');
  });

  it('DeleteTaskUseCase deletes task and persists', async () => {
    const repo = new FakeTaskRepository([
      { id: '1', title: 'A', category: 'work', status: 'pending', createdAt: 1 },
      { id: '2', title: 'B', category: 'home', status: 'pending', createdAt: 2 },
    ]);
    const uc = new DeleteTaskUseCase(repo);

    const tasks = await firstValueFrom(uc.execute('1'));
    expect(tasks.map(t => t.id)).toEqual(['2']);
  });
});
