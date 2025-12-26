import { firstValueFrom } from 'rxjs';
import { FakeTaskRepository } from '../../../core/infraestructure/testing/fake-task.repository';
import { TodoStore } from './todo.store';

describe('TodoStore', () => {
  it('filters tasks by selected category', async () => {
    const repo = new FakeTaskRepository([
      { id: '1', title: 'A', category: 'work', status: 'pending', createdAt: 1 },
      { id: '2', title: 'B', category: 'home', status: 'pending', createdAt: 2 },
    ]);

    const store = new TodoStore(repo as any);

    store.load();
    store.setCategory('work');

    const visible = await firstValueFrom(store.visibleTasks$);
    expect(visible.map(t => t.id)).toEqual(['1']);
  });
});
