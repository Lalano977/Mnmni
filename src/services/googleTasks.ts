/**
 * Google Tasks API integration service.
 * Allows teachers and students to create interactive educational assignments and checklists
 * for the Butterfly and Grasshopper lifecycle games.
 */

export interface TaskItem {
  id?: string;
  title: string;
  notes?: string;
  status?: 'needsAction' | 'completed';
}

export async function getOrCreateTaskList(accessToken: string, listTitle: string): Promise<string> {
  // Check if list already exists
  const listRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (listRes.ok) {
    const data = await listRes.json();
    const existing = data.items?.find((item: { title: string; id: string }) => item.title === listTitle);
    if (existing) {
      return existing.id;
    }
  }

  // Create new task list
  const createRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: listTitle }),
  });

  if (!createRes.ok) {
    throw new Error('فشل في إنشاء قائمة المهام في Google Tasks');
  }

  const created = await createRes.json();
  return created.id;
}

export async function addEducationalTasks(
  accessToken: string,
  taskListId: string,
  tasks: Array<{ title: string; notes: string }>
): Promise<number> {
  let createdCount = 0;
  for (const task of tasks) {
    const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.title,
        notes: task.notes,
      }),
    });
    if (res.ok) {
      createdCount++;
    }
  }
  return createdCount;
}

export async function fetchTasks(accessToken: string, taskListId: string): Promise<TaskItem[]> {
  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []).map((t: { id: string; title: string; notes?: string; status: string }) => ({
    id: t.id,
    title: t.title,
    notes: t.notes,
    status: t.status as 'needsAction' | 'completed',
  }));
}
