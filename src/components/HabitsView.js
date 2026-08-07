/* ==========================================================================
   Habits & Health View (Water Tracker, Habit Checklist, Expense Tracker)
   ========================================================================== */

import { renderIcon } from './Icon.js';

export function renderHabitsView(state) {
  const { user, habits, expenses } = state;

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const waterPercent = Math.min(100, Math.round((user.waterCurrentGlasses / user.waterGoalGlasses) * 100));

  // Group expenses by category for a compact bar breakdown
  const byCategory = {};
  expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });
  const categoryBars = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCategoryAmount = Math.max(1, ...categoryBars.map(c => c[1]));
  const categoryColors = ['var(--accent-primary)', 'var(--accent-cyan)', 'var(--accent-amber)', 'var(--accent-rose)', 'var(--accent-emerald)'];

  return `
    <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: var(--space-6);">
      <div class="view-header">
        <h1>Wellness</h1>
        <p>Habits, hydration, and spending — at a glance.</p>
      </div>

      <!-- Top Row: Animated Water Tracker & Daily Habits -->
      <div class="grid-responsive">
        
        <!-- Water Intake Tracker Card -->
        <div class="glass-card" style="padding: var(--space-5); position: relative; overflow: hidden;">
          <div class="flex-between" style="margin-bottom: var(--space-4);">
            <div style="display: flex; align-items: center; gap: var(--space-2); font-weight: var(--font-weight-semibold); color: var(--text-primary);">
              ${renderIcon('droplet', 20, 'var(--accent-cyan)')}
              <span>Hydration Tracker</span>
            </div>
            <span class="badge badge-indigo">${waterPercent}% Goal</span>
          </div>

          <div style="display: flex; align-items: center; gap: var(--space-5); margin: var(--space-3) 0;">
            <!-- Water Glass Visualizer -->
            <div style="position: relative; width: 64px; height: 100px; border: 3px solid var(--accent-cyan); border-radius: 6px 6px 16px 16px; overflow: hidden; background: rgba(6, 182, 212, 0.1); flex-shrink: 0;">
              <div style="position: absolute; bottom: 0; width: 100%; height: ${waterPercent}%; background: var(--grad-water); transition: height 500ms cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
            </div>

            <div style="flex: 1; min-width: 0;">
              <div style="font-family: var(--font-heading); font-size: var(--text-2xl); font-weight: bold; color: var(--text-primary);">
                ${user.waterCurrentGlasses} <span style="font-size: var(--text-sm); font-weight: normal; color: var(--text-secondary);">/ ${user.waterGoalGlasses} glasses</span>
              </div>
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px;">
                ${waterPercent >= 100 ? '🎉 Goal achieved!' : `${user.waterGoalGlasses - user.waterCurrentGlasses} more needed`}
              </div>

              <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3);">
                <button id="water-plus-btn" class="btn btn-primary btn-sm" style="flex: 1;">
                  ${renderIcon('plus', 16)} Add
                </button>
                <button id="water-minus-btn" class="btn btn-secondary btn-sm">
                  - Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Habits Checklist Card -->
        <div class="glass-card" style="padding: var(--space-5);">
          <div class="flex-between" style="margin-bottom: var(--space-4);">
            <div style="display: flex; align-items: center; gap: var(--space-2); font-weight: var(--font-weight-semibold); color: var(--text-primary);">
              ${renderIcon('habits', 20, 'var(--accent-amber)')}
              <span>Routine & Habits</span>
            </div>
            <span class="badge badge-amber">Streaks</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${habits.map(h => `
              <div class="flex-between gap-2" style="padding: var(--space-3) var(--space-4); background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: var(--space-3); min-width: 0;">
                  <div class="task-checkbox toggle-habit-btn" data-id="${h.id}">
                    ${h.completedToday ? renderIcon('check', 14) : ''}
                  </div>
                  <div style="min-width: 0;">
                    <div style="font-size: var(--text-sm); font-weight: var(--font-weight-medium); ${h.completedToday ? 'text-decoration: line-through; color: var(--text-muted);' : 'color: var(--text-primary);'} truncate">${h.name}</div>
                    <div style="font-size: var(--text-xs); color: var(--text-muted);">${h.category}</div>
                  </div>
                </div>

                <span class="badge badge-amber" style="flex-shrink: 0;">${h.streak} 🔥</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Expense / Budget Mini Tracker Section -->
      <div class="glass-card" style="padding: var(--space-5);">
        <div class="flex-between flex-wrap gap-2" style="margin-bottom: var(--space-4);">
          <div style="display: flex; align-items: center; gap: var(--space-2); font-weight: var(--font-weight-semibold); color: var(--text-primary);">
            ${renderIcon('dollar', 20, 'var(--accent-emerald)')}
            <span>Expense Tracker</span>
          </div>
          <div style="font-size: var(--text-sm); font-weight: bold; color: var(--text-primary);">
            Logged: <span style="color: var(--accent-emerald);">$${totalSpent.toFixed(2)}</span>
          </div>
        </div>

        <div class="grid-responsive">
          <!-- Quick Log Expense Form -->
          <form id="add-expense-form" style="display: flex; flex-direction: column; gap: var(--space-3); background: var(--bg-surface-elevated); padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: var(--text-sm); font-weight: bold;">Log Quick Expense</div>

            <input type="text" id="exp-title-input" class="input-field" placeholder="Expense item (e.g. Coffee)" required />

            <div class="grid-2-col-mobile">
              <input type="number" step="0.01" id="exp-amount-input" class="input-field" placeholder="Amount ($)" required />
              <select id="exp-cat-input" class="input-field">
                <option value="Groceries">Groceries</option>
                <option value="Dining">Dining</option>
                <option value="Software">Software</option>
                <option value="Health">Health</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary btn-mobile-full" style="margin-top: 4px;">Log Expense</button>
          </form>

          <!-- Expense List -->
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${categoryBars.length ? `
            <div style="display: flex; flex-direction: column; gap: var(--space-2);">
              ${categoryBars.map(([cat, amt], i) => `
                <div style="display: flex; align-items: center; gap: var(--space-3);">
                  <span style="font-size: var(--text-xs); color: var(--text-secondary); width: 72px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${cat}</span>
                  <div style="flex: 1; height: 8px; background: var(--bg-surface-elevated); border-radius: var(--radius-full); overflow: hidden;">
                    <div style="height: 100%; width: ${Math.max(6, Math.round((amt / maxCategoryAmount) * 100))}%; background: ${categoryColors[i % categoryColors.length]}; border-radius: var(--radius-full);"></div>
                  </div>
                  <span style="font-size: var(--text-xs); color: var(--text-muted); width: 48px; flex-shrink: 0; text-align: right;">$${amt.toFixed(0)}</span>
                </div>
              `).join('')}
            </div>
            ` : ''}
            <div style="max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: var(--space-2);">
            ${expenses.map(exp => `
              <div class="flex-between gap-2" style="padding: var(--space-3); background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                <div>
                  <div style="font-size: var(--text-sm); font-weight: var(--font-weight-medium); color: var(--text-primary);">${exp.title}</div>
                  <div style="font-size: var(--text-xs); color: var(--text-muted);">${exp.date} • ${exp.category}</div>
                </div>
                <span style="font-weight: bold; color: var(--accent-rose); font-size: var(--text-sm); flex-shrink: 0;">-$${exp.amount.toFixed(2)}</span>
              </div>
            `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachHabitsEvents(store) {
  const plusBtn = document.getElementById('water-plus-btn');
  const minusBtn = document.getElementById('water-minus-btn');

  if (plusBtn) plusBtn.addEventListener('click', () => store.incrementWater());
  if (minusBtn) minusBtn.addEventListener('click', () => store.decrementWater());

  document.querySelectorAll('.toggle-habit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (id) store.toggleHabit(id);
    });
  });

  const expForm = document.getElementById('add-expense-form');
  if (expForm) {
    expForm.addEventListener('submit', (e) => {
      e.preventDefault();
      store.addExpense({
        title: document.getElementById('exp-title-input').value,
        amount: document.getElementById('exp-amount-input').value,
        category: document.getElementById('exp-cat-input').value
      });
      expForm.reset();
    });
  }
}
