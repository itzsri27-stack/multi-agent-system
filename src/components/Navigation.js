/* ==========================================================================
   Navigation Component (Sidebar, Mobile Drawer & Mobile Bar)
   ========================================================================== */

import { renderIcon } from './Icon.js';

export function renderNavigation(state) {
  const currentView = state.activeView;
  const pendingTasksCount = state.tasks.filter(t => !t.completed).length;
  const notesCount = state.notes.length;

  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'planner', label: 'Planner', icon: 'planner', badge: pendingTasksCount > 0 ? pendingTasksCount : null },
    { id: 'notes', label: 'Notes', icon: 'notes', badge: notesCount > 0 ? notesCount : null },
    { id: 'habits', label: 'Habits & Health', icon: 'habits' },
    { id: 'apps', label: 'Apps & Links', icon: 'apps' },
    { id: 'assistant', label: 'Assistant AI', icon: 'assistant' },
    { id: 'profile', label: 'Profile', icon: 'profile' }
  ];

  const sidebarHtml = `
    <aside class="sidebar">
      <div class="sidebar-logo-area">
        <div class="logo-badge">
          ${renderIcon('zap', 22, '#ffffff')}
        </div>
        <span class="logo-title">Lumina</span>
      </div>

      <nav class="sidebar-nav">
        ${navItems.map(item => `
          <button class="nav-item ${currentView === item.id ? 'active' : ''}" data-view="${item.id}">
            ${renderIcon(item.icon, 20)}
            <span>${item.label}</span>
            ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
          </button>
        `).join('')}
      </nav>

      <div style="padding: var(--space-4); margin-top: auto; border-top: 1px solid var(--border-subtle);">
        <div class="glass-card" style="padding: var(--space-3); text-align: center; font-size: var(--text-xs); color: var(--text-muted);">
          Lumina Studio v3.0<br>
          <span style="color: var(--accent-emerald);">● All Systems Connected</span>
        </div>
      </div>
    </aside>
  `;

  // Slide-out Mobile Navigation Drawer
  const mobileDrawerHtml = `
    <div class="mobile-drawer-overlay ${state.isMobileMenuOpen ? 'open' : ''}" id="mobile-drawer-overlay">
      <div class="mobile-drawer-content animate-fade-in">
        <div class="flex-between" style="padding: var(--space-4) var(--space-5); border-bottom: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <div class="logo-badge" style="width: 34px; height: 34px;">
              ${renderIcon('zap', 18, '#ffffff')}
            </div>
            <span class="logo-title" style="font-size: var(--text-lg);">Lumina</span>
          </div>
          <button id="close-mobile-drawer" class="btn btn-ghost btn-icon">${renderIcon('x', 20)}</button>
        </div>

        <nav class="mobile-drawer-nav">
          ${navItems.map(item => `
            <button class="nav-item ${currentView === item.id ? 'active' : ''}" data-view="${item.id}" style="padding: 0.875rem 1rem; font-size: var(--text-base);">
              ${renderIcon(item.icon, 22)}
              <span>${item.label}</span>
              ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
            </button>
          `).join('')}
        </nav>
      </div>
    </div>
  `;

  // Mobile Bottom Navigation Bar (5 core items)
  const mobileNavItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'planner', label: 'Planner', icon: 'planner' },
    { id: 'assistant', label: 'AI Bot', icon: 'assistant', isHero: true },
    { id: 'apps', label: 'Apps', icon: 'apps' },
    { id: 'notes', label: 'Notes', icon: 'notes' }
  ];

  const mobileNavHtml = `
    <nav class="mobile-nav">
      ${mobileNavItems.map(item => {
        return `
          <button class="nav-item ${currentView === item.id ? 'active' : ''}" data-view="${item.id}" style="flex-direction: column; gap: 2px; padding: 0.4rem; font-size: 0.7rem; border-left: none;">
            ${renderIcon(item.icon, 20)}
            <span>${item.label}</span>
          </button>
        `;
      }).join('')}
    </nav>
  `;

  return sidebarHtml + mobileDrawerHtml + mobileNavHtml;
}

export function attachNavEvents(store) {
  document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = btn.getAttribute('data-view');
      if (view) {
        store.setMobileMenuOpen(false);
        store.setActiveView(view);
      }
    });
  });

  const closeDrawerBtn = document.getElementById('close-mobile-drawer');
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => store.setMobileMenuOpen(false));
  }

  const drawerOverlay = document.getElementById('mobile-drawer-overlay');
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) store.setMobileMenuOpen(false);
    });
  }
}
