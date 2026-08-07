/* ==========================================================================
   Header Component — Mobile-First Three-Row Architecture
   ========================================================================== */

import { renderIcon } from './Icon.js';
import { weatherMock } from '../data/mockData.js';

export function renderHeader(state, store) {
  const weatherIcon = weatherMock.icon || 'sun';

  return `
    <header class="header-bar">
      <div class="header-stack">

        <!-- ROW 1: Top Utility Bar -->
        <div class="header-utility-row">
          <button id="hamburger-menu-btn" class="btn btn-secondary btn-icon mobile-hamburger-trigger" title="Toggle Navigation Menu">
            ${renderIcon('menu', 20)}
          </button>

          <div class="header-utility-right flex row items-center space-x-3">
            <div class="weather-inline" aria-label="Current weather">
              ${renderIcon(weatherIcon, 16, 'var(--accent-primary)')}
              <span class="weather-inline-text">${weatherMock.temp}, ${weatherMock.condition}</span>
            </div>

            <button id="theme-toggle-btn" class="btn btn-secondary btn-icon" title="Toggle Light/Dark Theme">
              ${renderIcon(state.user.theme === 'dark' ? 'sun' : 'moon', 18)}
            </button>

            <!-- Profile Avatar Placeholder -->
            <button id="profile-avatar-btn" class="btn btn-ghost btn-icon" title="User Profile" style="border: 1px solid var(--border-subtle); border-radius: 50%; overflow: hidden; background: var(--bg-surface-elevated); padding: 0.35rem;">
              ${renderIcon('user', 18, 'var(--text-primary)')}
            </button>
          </div>
        </div>

        <!-- ROW 2: Welcome Greeting -->
        <h1 class="header-greeting-row">Good morning, Guru</h1>

        <!-- ROW 3: Full-Width Search Bar -->
        <button id="search-trigger" class="header-search-pill" title="Search Everything (Ctrl+K)">
          ${renderIcon('search', 16)}
          <span class="header-search-placeholder">Search workspace...</span>
          <span class="kbd-shortcut header-search-kbd">Ctrl K</span>
        </button>

      </div>
    </header>
  `;
}

export function attachHeaderEvents(store) {
  const hamburgerBtn = document.getElementById('hamburger-menu-btn');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => store.setMobileMenuOpen(!store.getState().isMobileMenuOpen));
  }

  const searchBtn = document.getElementById('search-trigger');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => store.setSearchModalOpen(true));
  }

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => store.toggleTheme());
  }

  const profileBtn = document.getElementById('profile-avatar-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => store.setActiveView('profile'));
  }
}
