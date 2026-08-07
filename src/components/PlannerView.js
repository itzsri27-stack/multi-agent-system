/* ==========================================================================
   Planner View Component (Tasks, Interactive Calendar & Schedule Timeline)
   ========================================================================== */

import { renderIcon } from './Icon.js';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseISODate(iso) {
  return new Date(iso + 'T00:00:00');
}

function toISO(date) {
  return date.toISOString().split('T')[0];
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatMonthYear(iso) {
  return parseISODate(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatTimelineRange(event) {
  if (event.startTime && event.endTime) {
    return `${event.startTime.replace(/^(\d{2}):(\d{2})$/, (_, h, m) => {
      const hour = parseInt(h, 10);
      return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
    })} — ${event.endTime.replace(/^(\d{2}):(\d{2})$/, (_, h, m) => {
      const hour = parseInt(h, 10);
      return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
    })}`;
  }
  return event.time.replace(' - ', ' — ');
}

function getEventDateISO(event) {
  if (event.dateISO) return event.dateISO;
  const today = new Date();
  if (event.date === 'Tomorrow') {
    return toISO(addDays(today, 1));
  }
  return toISO(today);
}

function buildWeekDays(weekStartISO) {
  const start = parseISODate(weekStartISO);
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(start, i);
    return { iso: toISO(d), dayNum: d.getDate(), weekday: WEEKDAY_LABELS[i] };
  });
}

function priorityBadgeClass(priority) {
  if (priority === 'High') return 'badge-teal badge-priority-high';
  if (priority === 'Medium') return 'badge-teal badge-priority-medium';
  return 'badge-teal badge-priority-low';
}

export function renderPlannerView(state) {
  const { tasks, events, plannerSelectedDate, plannerWeekStart } = state;
  const selectedDate = plannerSelectedDate || toISO(new Date());
  const weekStart = plannerWeekStart || toISO(addDays(parseISODate(selectedDate), -parseISODate(selectedDate).getDay()));
  const weekDays = buildWeekDays(weekStart);
  const monthLabel = formatMonthYear(selectedDate);

  const dayEvents = events
    .filter(evt => getEventDateISO(evt) === selectedDate)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  return `
    <div class="planner-page animate-fade-in px-4 pb-24" style="background-color: var(--bg-base); min-height: 100vh;">
      <div class="view-header flex row justify-between items-center w-full" style="margin-bottom: var(--space-6);">
        <h1 style="margin: 0; padding: 0;">Daily Focus</h1>
        <button id="open-add-task-modal" class="btn btn-primary" style="flex-shrink: 0; display: flex; align-items: center; gap: 6px;">
          ${renderIcon('plus', 18)}
          <span class="hide-on-mobile">New Task</span>
        </button>
      </div>

      <div class="planner-layout-grid">
        <!-- Main Column (Left: 1fr) -->
        <div class="planner-main-col" style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Calendar Card -->
          <section class="glass-card planner-calendar-card planner-card-padding" style="background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px;">
            <div class="planner-calendar-header" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 20px;">
              <button id="calendar-prev-week" class="btn btn-secondary btn-icon" title="Previous Week" aria-label="Previous week">
                ${renderIcon('chevron-left', 18)}
              </button>

              <div class="planner-calendar-title" style="display: flex; flex-direction: row; align-items: center; gap: 8px; font-weight: 600;">
                ${renderIcon('calendar', 20, 'var(--accent-primary)')}
                <span id="calendar-month-label" class="mobile-text-sm">${monthLabel}</span>
              </div>

              <button id="calendar-next-week" class="btn btn-secondary btn-icon" title="Next Week" aria-label="Next week">
                ${renderIcon('chevron-right', 18)}
              </button>
            </div>

            <div class="grid grid-cols-7 text-center w-full gap-1" style="margin-bottom: 12px;">
              ${weekDays.map(day => `
                <div class="text-muted" style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase;">${day.weekday}</div>
              `).join('')}
            </div>

            <div class="grid grid-cols-7 text-center w-full gap-1">
              ${weekDays.map(day => `
                <div style="display: flex; justify-content: center;">
                  <button
                    type="button"
                    class="btn-ghost planner-day-pill"
                    data-date="${day.iso}"
                    aria-label="Select ${day.weekday}, day ${day.dayNum}"
                    style="width: 36px; height: 36px; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center; font-weight: ${day.iso === selectedDate ? 'bold' : 'normal'}; background-color: ${day.iso === selectedDate ? 'var(--accent-primary)' : 'transparent'}; color: ${day.iso === selectedDate ? '#ffffff' : 'inherit'}; border: none; transition: transform var(--transition-fast);"
                    onmouseover="this.style.transform='scale(1.1)';" onmouseout="this.style.transform='scale(1)';"
                  >${day.dayNum}</button>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Tasks List Panel -->
          <section class="planner-tasks-panel" style="padding: 0;">
            <div class="planner-tasks-header flex row justify-between items-center w-full" style="margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
              <div class="planner-section-heading" style="display: flex; flex-direction: row; align-items: center; gap: 10px; margin: 0;">
                ${renderIcon('check-circle', 20, 'var(--accent-primary)')}
                <h2 style="margin: 0; font-size: var(--text-lg); font-weight: 600;">Tasks (${tasks.length})</h2>
              </div>
              <div class="task-filter-group" style="display: flex; flex-direction: row; gap: 8px;" id="task-filter-group">
                <button class="btn btn-ghost btn-sm active" data-filter="all" style="border: 1px solid var(--border-subtle); border-radius: 8px;">All</button>
                <button class="btn btn-ghost btn-sm" data-filter="high" style="border: 1px solid var(--border-subtle); border-radius: 8px;">High</button>
              </div>
            </div>

            <div id="tasks-container" class="tasks-list" style="display: flex; flex-direction: column; gap: 12px;">
              ${tasks.map(task => `
                <div class="task-item task-card-padding ${task.completed ? 'completed' : ''}" data-priority="${task.priority.toLowerCase()}" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; gap: 12px;">
                  
                  <div style="display: flex; flex-direction: row; align-items: center; gap: 12px; flex: 1; min-width: 0;">
                    <div class="task-checkbox toggle-task-btn" data-id="${task.id}" style="flex-shrink: 0; width: 22px; height: 22px; border: 2px solid var(--border-medium); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: ${task.completed ? 'var(--accent-primary)' : 'transparent'}; border-color: ${task.completed ? 'var(--accent-primary)' : 'var(--border-medium)'};">
                      ${task.completed ? renderIcon('check', 14, '#fff', '', 2.5) : ''}
                    </div>
                    
                    <div style="display: flex; flex-direction: column; justify-content: center; gap: 6px; flex: 1; min-width: 0;">
                      <span class="task-title" style="font-weight: 500; font-size: var(--text-base); color: ${task.completed ? 'var(--text-muted)' : 'var(--text-primary)'}; text-decoration: ${task.completed ? 'line-through' : 'none'}; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${task.title}</span>
                      
                      <div class="task-meta-row" style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 6px; padding-left: 0;">
                        <span class="badge ${priorityBadgeClass(task.priority)}" style="font-size: 10px; line-height: 1; padding: 3px 6px; border-radius: 4px;">${task.priority.toUpperCase()}</span>
                        <span class="task-date-tag" style="display: flex; flex-direction: row; align-items: center; gap: 4px; font-size: 11px; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px; line-height: 1;">
                          ${renderIcon('calendar', 12, 'var(--text-muted)')}
                          ${task.dueDate}
                        </span>
                        <span class="task-category-tag" style="display: flex; flex-direction: row; align-items: center; gap: 4px; font-size: 11px; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px; line-height: 1;">
                          ${renderIcon('tag', 12, 'var(--text-muted)')}
                          ${task.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="task-actions-row" style="display: flex; flex-direction: row; align-items: center; gap: 4px; flex-shrink: 0;">
                    <button class="btn btn-ghost btn-icon set-hero-btn" data-id="${task.id}" title="Set as Today's Focus">
                      ${renderIcon('star', 18, task.isTodayFocus ? 'var(--accent-primary)' : 'var(--text-muted)')}
                    </button>
                    <button class="btn btn-ghost btn-icon delete-task-btn" data-id="${task.id}" title="Delete Task">
                      ${renderIcon('trash', 18, 'var(--text-muted)')}
                    </button>
                  </div>

                </div>
              `).join('')}
            </div>
          </section>
        </div>

        <!-- Sidebar Column (Right: 360px) -->
        <div class="planner-side-col" style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Today's Schedule Timeline -->
          <section class="planner-schedule-section" style="padding: 0;">
            <div class="planner-section-heading" style="display: flex; flex-direction: row; align-items: center; gap: 10px; margin-bottom: 20px;">
              ${renderIcon('clock', 20, 'var(--accent-primary)')}
              <h2 style="margin: 0; font-size: var(--text-lg); font-weight: 600;">Today's Schedule</h2>
            </div>

            <div class="schedule-timeline" id="schedule-timeline">
              ${dayEvents.length > 0 ? dayEvents.map(evt => `
                <article class="timeline-item" style="margin-bottom: 12px;">
                  <div class="timeline-content glass-card task-card-padding" style="background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-left: 3px solid var(--accent-primary); border-radius: 12px;">
                    <time class="timeline-time text-muted text-xs" style="display: block; margin-bottom: 6px;">${formatTimelineRange(evt)}</time>
                    <h3 class="timeline-title" style="margin: 0 0 8px 0; font-size: var(--text-base); font-weight: 600;">${evt.title}</h3>
                    <p class="timeline-meta" style="display: flex; flex-direction: row; align-items: center; gap: 6px; color: var(--text-secondary); font-size: var(--text-xs); margin: 0;">
                      ${renderIcon('map-pin', 14, 'var(--text-secondary)')}
                      <span>${evt.location}</span>
                    </p>
                  </div>
                </article>
              `).join('') : `
                <div class="timeline-empty glass-card text-center planner-card-padding" style="background-color: var(--bg-surface); border: 1px dashed var(--border-subtle); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;">
                  ${renderIcon('calendar', 24, 'var(--text-muted)')}
                  <p class="text-muted text-sm m-0">No events scheduled for this day.</p>
                </div>
              `}
            </div>
          </section>

          <!-- Active Reminders -->
          <section class="planner-reminders-card glass-card planner-card-padding" style="background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 12px; width: 100%;">
            <div class="planner-section-heading" style="display: flex; flex-direction: row; align-items: center; gap: 10px; margin-bottom: 16px;">
              ${renderIcon('bell', 20, 'var(--accent-primary)')}
              <h2 style="margin: 0; font-size: var(--text-lg); font-weight: 600;">Active Reminders</h2>
            </div>

            <div class="reminder-item" style="display: flex; flex-direction: row; align-items: flex-start; gap: 14px; width: 100%;">
              <div style="background: rgba(249, 115, 22, 0.1); padding: 10px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${renderIcon('clock', 20, 'var(--accent-orange)')}
              </div>
              <div style="display: flex; flex-direction: column; justify-content: center; gap: 4px; margin-top: 2px;">
                <span class="reminder-title" style="font-weight: 600; font-size: var(--text-base); color: var(--text-primary); line-height: 1.2;">Design Sync Standup</span>
                <span class="reminder-sub" style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.2;">Triggers in 15 mins (10:30 AM)</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Add Task Modal -->
      <div id="add-task-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content">
          <div class="flex-between" style="margin-bottom: var(--space-4);">
            <h3 style="font-size: var(--text-lg); font-weight: bold;">Create New Task</h3>
            <button id="close-add-task-modal" class="btn btn-ghost btn-icon">${renderIcon('x', 18)}</button>
          </div>

          <form id="add-task-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div>
              <label style="font-size: var(--text-xs); color: var(--text-secondary);">Task Title</label>
              <input type="text" id="task-title-input" class="input-field" placeholder="e.g. Prepare Q3 presentation" required />
            </div>

            <div>
              <label style="font-size: var(--text-xs); color: var(--text-secondary);">Description (Optional)</label>
              <textarea id="task-desc-input" class="input-field" rows="2" placeholder="Task notes or details..."></textarea>
            </div>

            <div class="grid-2-col-mobile">
              <div>
                <label style="font-size: var(--text-xs); color: var(--text-secondary);">Priority</label>
                <select id="task-priority-input" class="input-field">
                  <option value="High">High Priority</option>
                  <option value="Medium" selected>Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
              <div>
                <label style="font-size: var(--text-xs); color: var(--text-secondary);">Category</label>
                <input type="text" id="task-category-input" class="input-field" value="Work" />
              </div>
            </div>

            <div class="grid-2-col-mobile">
              <div>
                <label style="font-size: var(--text-xs); color: var(--text-secondary);">Due Date</label>
                <input type="date" id="task-date-input" class="input-field" value="2026-08-06" />
              </div>
              <div>
                <label style="font-size: var(--text-xs); color: var(--text-secondary);">Due Time</label>
                <input type="time" id="task-time-input" class="input-field" value="14:00" />
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <input type="checkbox" id="task-focus-input" style="width: 18px; height: 18px;" />
              <label for="task-focus-input" style="font-size: var(--text-sm); color: var(--text-primary);">Set as Today's Focus</label>
            </div>

            <button type="submit" class="btn btn-primary btn-mobile-full" style="margin-top: var(--space-2);">Save Task</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function attachPlannerEvents(store) {
  const openModalBtn = document.getElementById('open-add-task-modal');
  const closeModalBtn = document.getElementById('close-add-task-modal');
  const modal = document.getElementById('add-task-modal');
  const form = document.getElementById('add-task-form');

  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
  }
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      store.addTask({
        title: document.getElementById('task-title-input').value,
        description: document.getElementById('task-desc-input').value,
        priority: document.getElementById('task-priority-input').value,
        category: document.getElementById('task-category-input').value,
        dueDate: document.getElementById('task-date-input').value,
        dueTime: document.getElementById('task-time-input').value,
        isTodayFocus: document.getElementById('task-focus-input').checked
      });
      modal.style.display = 'none';
      form.reset();
    });
  }

  const prevWeekBtn = document.getElementById('calendar-prev-week');
  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', () => store.navigatePlannerWeek(-1));
  }

  const nextWeekBtn = document.getElementById('calendar-next-week');
  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', () => store.navigatePlannerWeek(1));
  }

  document.querySelectorAll('.planner-day-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const date = pill.getAttribute('data-date');
      if (date) store.setPlannerSelectedDate(date);
    });
  });

  const filterBtns = document.querySelectorAll('#task-filter-group button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      document.querySelectorAll('.task-item').forEach(item => {
        if (filter === 'all') {
          item.style.display = 'flex';
        } else if (filter === 'high') {
          item.style.display = item.getAttribute('data-priority') === 'high' ? 'flex' : 'none';
        } else if (filter === 'pending') {
          item.style.display = !item.classList.contains('completed') ? 'flex' : 'none';
        }
      });
    });
  });

  document.querySelectorAll('.toggle-task-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (id) store.toggleTask(id);
    });
  });

  document.querySelectorAll('.set-hero-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (id) store.setTodayFocus(id);
    });
  });

  document.querySelectorAll('.delete-task-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (id) store.deleteTask(id);
    });
  });
}
