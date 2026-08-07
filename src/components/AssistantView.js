/* ==========================================================================
   Assistant View Component (Action Shortcuts & AI Conversational Chat)
   ========================================================================== */

import { renderIcon } from './Icon.js';
import { mockAssistantPrompts } from '../data/mockData.js';

export function renderAssistantView(state) {
  const { assistantMessages } = state;

  return `
    <div class="animate-fade-in px-4 pb-24 flex flex-col gap-6" style="background-color: var(--bg-base); min-height: 100vh;">
      <div class="view-header mb-0">
        <h1 style="font-family: var(--font-heading); font-size: var(--text-3xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0;">Lumina AI</h1>
      </div>

      <!-- AI Conversational Chat Container -->
      <div class="glass-card chat-container p-5 flex flex-col border-subtle-border" style="background-color: var(--bg-surface); height: 600px;">
        
        <!-- Centralized Minimalist Header -->
        <div class="flex flex-col items-center justify-center text-center mt-2 mb-4">
          <div style="width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; border: 1px solid var(--border-subtle);">
            ${renderIcon('sparkles', 24, '#0D9488', '', 1)}
          </div>
          <h2 style="font-size: var(--text-lg); font-weight: 500; color: var(--text-primary);">How can I help you today?</h2>
        </div>

        <!-- Messages Area -->
        <div class="chat-messages" id="chat-messages-area" style="flex: 1; overflow-y: auto; padding: 0 var(--space-2);">
          ${assistantMessages.map(msg => `
            <div class="chat-bubble ${msg.sender}">
              <div>${msg.text.replace(/\n/g, '<br>')}</div>
              <div style="font-size: 10px; color: ${msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)'}; text-align: right; margin-top: 4px;">${msg.time}</div>
            </div>
          `).join('')}
        </div>

        <!-- Chat Input Field -->
        <form id="assistant-chat-form" style="margin-top: 1rem; display: flex; gap: var(--space-2);">
          <input 
            type="text" 
            id="chat-input" 
            class="input-field" 
            placeholder="Message Lumina..." 
            style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-full); padding: 0.75rem 1.25rem;"
            required 
          />
          <button type="submit" class="btn btn-primary btn-icon bg-deep-teal" style="width: 44px; height: 44px; padding: 0; flex-shrink: 0; border-radius: var(--radius-full);">
            ${renderIcon('zap', 18, '#ffffff')}
          </button>
        </form>
      </div>

      <!-- Suggested Actions -->
      <div>
        <h3 class="text-silver text-xs uppercase mb-3" style="font-weight: bold; letter-spacing: 0.05em;">Suggested Actions</h3>
        <div class="flex overflow-x-auto space-x-3 pb-4 no-scrollbar">
          ${mockAssistantPrompts.map(p => `
            <button class="btn btn-secondary rounded-md assistant-action-card flex row items-center space-x-2" data-prompt="${p.prompt}" style="flex-shrink: 0; background-color: var(--bg-surface); border: 1px solid var(--border-subtle); white-space: nowrap;">
              ${renderIcon('zap', 14, 'var(--text-secondary)', '', 1.5)}
              <span class="text-silver" style="font-size: var(--text-sm); font-weight: 500;">${p.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function attachAssistantEvents(store) {
  const form = document.getElementById('assistant-chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatArea = document.getElementById('chat-messages-area');

  if (chatArea) {
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value;
      if (text) {
        store.sendAssistantMessage(text);
        chatInput.value = '';
      }
    });
  }

  document.querySelectorAll('.assistant-action-card').forEach(card => {
    card.addEventListener('click', () => {
      const promptText = card.getAttribute('data-prompt');
      if (promptText) {
        store.sendAssistantMessage(promptText);
      }
    });
  });
}
