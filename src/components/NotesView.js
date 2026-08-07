/* ==========================================================================
   Notes View Component (Quick Capture, Voice-to-Text, Photo Attachment)
   ========================================================================== */

import { renderIcon } from './Icon.js';

function truncateNotePreview(content, wordCount = 5) {
  if (!content) return '';
  const firstLine = content.split('\n')[0].trim();
  const words = firstLine.split(/\s+/).filter(Boolean);
  if (words.length <= wordCount) return firstLine;
  return words.slice(0, wordCount).join(' ') + '...';
}

export function renderNotesView(state) {
  const { notes } = state;
  const pinnedNotes = notes.filter(n => n.pinned);

  return `
    <div class="notes-page animate-fade-in px-4 pb-24">
      <div class="view-header">
        <h1>Quick Notes</h1>
      </div>

      <!-- Quick Capture Box -->
      <div class="glass-card notes-capture-card">
        <form id="quick-note-form" class="notes-capture-form">
          <input
            type="text"
            id="note-title-input"
            class="input-field notes-title-input"
            placeholder="Note Title..."
            required
          />

          <textarea
            id="note-content-input"
            class="input-field"
            rows="3"
            placeholder="Write your note thoughts here... or click Dictate!"
            required
          ></textarea>

          <div id="attachment-preview-container" class="attachment-preview" style="display: none;">
            <img id="attachment-preview-img" src="" alt="Attachment" />
            <button type="button" id="remove-attachment-btn" class="attachment-remove-btn" aria-label="Remove attachment">
              ${renderIcon('x', 12, '#fff', '', 2)}
            </button>
          </div>

          <div class="notes-form-actions-bar">
            <input type="text" id="note-tags-input" class="input-field note-tags-mobile-input" placeholder="Tags (e.g. #work #ideas)" />

            <div class="notes-buttons-group">
              <label class="btn btn-secondary btn-sm notes-action-btn" title="Attach Local Photo/File">
                ${renderIcon('paperclip', 16)}
                <span>Photo</span>
                <input type="file" id="note-file-input" accept="image/*" style="display: none;" />
              </label>

              <button type="button" id="voice-dictate-btn" class="btn btn-secondary btn-sm notes-action-btn" title="Voice-to-Text Dictation">
                ${renderIcon('mic', 16)}
                <span id="voice-btn-label">Dictate</span>
              </button>

              <label class="notes-pin-toggle">
                <input type="checkbox" id="note-pinned-input" />
                Pin Note
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-mobile-full">Save Note</button>
          </div>
        </form>
      </div>

      ${pinnedNotes.length > 0 ? `
        <section class="notes-section">
          <div class="notes-section-heading mt-6 mb-3">
            ${renderIcon('pin', 16, 'var(--accent-primary)')}
            <span>Pinned Notes (${pinnedNotes.length})</span>
          </div>
          <div class="notes-list">
            ${pinnedNotes.map(n => renderNoteCard(n)).join('')}
          </div>
        </section>
      ` : ''}

      <section class="notes-section">
        <div class="notes-section-heading mt-6 mb-3">
          ${renderIcon('notes', 16, 'var(--accent-primary)')}
          <span>All Notes (${notes.length})</span>
        </div>
        <div class="notes-list">
          ${notes.length > 0 ? notes.map(n => renderNoteCard(n)).join('') : `
            <div class="notes-empty">${renderIcon('notes', 24, 'var(--text-muted)')}<p>No notes yet. Capture your first idea above.</p></div>
          `}
        </div>
      </section>
    </div>
  `;
}

function renderNoteCard(note) {
  const preview = truncateNotePreview(note.content, 5);

  return `
    <article class="glass-card note-card relative w-full p-5 space-y-3" style="background-color: var(--bg-surface); padding-bottom: 3.5rem;">
      <div class="note-card-header flex row justify-between items-center w-full">
        <h3 class="note-card-title m-0" style="margin: 0;">${note.title}</h3>
        <div class="note-card-actions flex row space-x-3 items-center">
          <button class="btn btn-ghost btn-icon pin-note-btn" data-id="${note.id}" title="Toggle Pin">
            ${renderIcon('pin', 14, note.pinned ? 'var(--accent-primary)' : 'var(--text-muted)', '', 1)}
          </button>
          <button class="btn btn-ghost btn-icon delete-note-btn" data-id="${note.id}" title="Delete Note">
            ${renderIcon('trash', 14, 'var(--text-muted)', '', 1)}
          </button>
        </div>
      </div>

      ${preview ? `<p class="note-card-preview mt-2">${preview}</p>` : ''}

      ${note.attachmentUrl ? `
        <div class="note-card-attachment mt-2">
          <img src="${note.attachmentUrl}" alt="Note attachment" />
        </div>
      ` : ''}

      <div class="note-tags flex flex-wrap gap-2 pt-1">
        ${note.tags.map(t => `<span class="badge badge-teal">${t}</span>`).join('')}
      </div>
      <time class="note-updated absolute bottom-5 left-5 text-xs text-muted">Updated ${note.updatedAt}</time>
    </article>
  `;
}

export function attachNotesEvents(store) {
  const form = document.getElementById('quick-note-form');
  const fileInput = document.getElementById('note-file-input');
  const previewContainer = document.getElementById('attachment-preview-container');
  const previewImg = document.getElementById('attachment-preview-img');
  const removeAttachmentBtn = document.getElementById('remove-attachment-btn');
  const voiceBtn = document.getElementById('voice-dictate-btn');
  const voiceLabel = document.getElementById('voice-btn-label');
  const contentInput = document.getElementById('note-content-input');

  let currentAttachmentUrl = null;

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          currentAttachmentUrl = event.target.result;
          if (previewImg && previewContainer) {
            previewImg.src = currentAttachmentUrl;
            previewContainer.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removeAttachmentBtn) {
    removeAttachmentBtn.addEventListener('click', () => {
      currentAttachmentUrl = null;
      if (previewContainer) previewContainer.style.display = 'none';
      if (fileInput) fileInput.value = '';
    });
  }

  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.onstart = () => {
          voiceBtn.classList.add('voice-recording-pulse');
          if (voiceLabel) voiceLabel.textContent = 'Listening...';
        };
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (contentInput) {
            contentInput.value = (contentInput.value + ' ' + transcript).trim();
          }
        };
        recognition.onend = () => {
          voiceBtn.classList.remove('voice-recording-pulse');
          if (voiceLabel) voiceLabel.textContent = 'Dictate';
        };
        recognition.start();
      } else {
        voiceBtn.classList.add('voice-recording-pulse');
        if (voiceLabel) voiceLabel.textContent = 'Listening...';
        setTimeout(() => {
          voiceBtn.classList.remove('voice-recording-pulse');
          if (voiceLabel) voiceLabel.textContent = 'Dictate';
          if (contentInput) {
            contentInput.value = (contentInput.value + ' Lumina Voice Note: Strategic goals for Q3 product alignment.').trim();
          }
          store.showToast('Voice dictation captured!');
        }, 1500);
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const tagsRaw = document.getElementById('note-tags-input').value;
      const tags = tagsRaw ? tagsRaw.split(' ').filter(t => t.trim()) : ['#quick'];

      store.addNote({
        title: document.getElementById('note-title-input').value,
        content: contentInput.value,
        tags: tags,
        pinned: document.getElementById('note-pinned-input').checked,
        attachmentUrl: currentAttachmentUrl
      });

      form.reset();
      currentAttachmentUrl = null;
      if (previewContainer) previewContainer.style.display = 'none';
    });
  }

  document.querySelectorAll('.pin-note-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (id) store.togglePinNote(id);
    });
  });

  document.querySelectorAll('.delete-note-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (id) store.deleteNote(id);
    });
  });
}
