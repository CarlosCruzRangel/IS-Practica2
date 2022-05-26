export default class NotesView {
  constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
            
            <div class="notes__sidebar">
            <h1>Bienvenido a NOTAS v1.0</h1>
            <br>
                <button class="notes__add" type="button">
                <i class="fa-solid fa-plus"></i> Nueva nota</button>
                <div class="notes__list"></div>
            </div>
            <div class="notes__preview">
            <div class="container">
            <div class="options">
              <!-- Text Format -->
              <button id="bold" class="option-button button button format">
                <i class="fa-solid fa-bold"></i>
              </button>
              <button id="italic" class="option-button button format">
                <i class="fa-solid fa-italic"></i>
              </button>
              <button id="underline" class="option-button button format">
                <i class="fa-solid fa-underline"></i>
              </button>
              <button id="strikethrough" class="option-button button format">
                <i class="fa-solid fa-strikethrough"></i>
              </button>
              <button id="superscript" class="option-button button script">
                <i class="fa-solid fa-superscript"></i>
              </button>
              <button id="subscript" class="option-button button script">
                <i class="fa-solid fa-subscript"></i>
              </button>
              <!-- List -->
              <button id="insertOrderedList" class="option-button button">
                <div class="fa-solid fa-list-ol"></div>
              </button>
              <button id="insertUnorderedList" class="option-button button">
                <i class="fa-solid fa-list"></i>
              </button>
              <!-- Undo/Redo -->
              <button id="undo" class="option-button button">
                <i class="fa-solid fa-rotate-left"></i>
              </button>
              <button id="redo" class="option-button button">
                <i class="fa-solid fa-rotate-right"></i>
              </button>
              <!-- Link -->
              <button id="createLink" class="adv-option-button button">
                <i class="fa fa-link"></i>
              </button>
              <button id="unlink" class="option-button button">
                <i class="fa fa-unlink"></i>
              </button>
              <!-- Alignment -->
              <button id="justifyLeft" class="option-button button align">
                <i class="fa-solid fa-align-left"></i>
              </button>
              <button id="justifyCenter" class="option-button button align">
                <i class="fa-solid fa-align-center"></i>
              </button>
              <button id="justifyRight" class="option-button button align">
                <i class="fa-solid fa-align-right"></i>
              </button>
              <button id="justifyFull" class="option-button button align">
                <i class="fa-solid fa-align-justify"></i>
              </button>
              <button id="indent" class="option-button button spacing">
                <i class="fa-solid fa-indent"></i>
              </button>
              <button id="outdent" class="option-button button spacing">
                <i class="fa-solid fa-outdent"></i>
              </button>
              <!-- Headings -->
              <select id="formatBlock" class="adv-option-button">
                <option value="H1">H1</option>
                <option value="H2">H2</option>
                <option value="H3">H3</option>
                <option value="H4">H4</option>
                <option value="H5">H5</option>
                <option value="H6">H6</option>
              </select>
              <!-- Font -->
              <select id="fontName" class="adv-option-button"></select>
              <select id="fontSize" class="adv-option-button"></select>
              <!-- Color -->
              <div class="input-wrapper">
                <input type="color" id="foreColor" class="adv-option-button" />
                <label for="foreColor">Font Color</label>
              </div>
              <div class="input-wrapper">
                <input type="color" id="backColor" class="adv-option-button" />
                <label for="backColor">Highlight Color</label>
              </div>
              </div>
              </div>
              <div id="text-input" contenteditable="true">
                  <input  class="notes__title" type="text" placeholder="Titulo...">
                  <textarea  class="notes__body">Escribir nota...</textarea>
              </div>
              <div id="text-input" contenteditable="true">
              </div>
              </div>
            </div>

        `;
    //<div id="text-input" contenteditable="true"></div>
    const btnAddNote = this.root.querySelector('.notes__add');
    const inpTitle = this.root.querySelector('.notes__title');
    const inpBody = this.root.querySelector('.notes__body');

    btnAddNote.addEventListener('click', () => {
      this.onNoteAdd();
    });

    [inpTitle, inpBody].forEach((inputField) => {
      inputField.addEventListener('blur', () => {
        const updatedTitle = inpTitle.value.trim();
        const updatedBody = inpBody.value.trim();

        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });

    this.updateNotePreviewVisibility(false);
  }

  _createListItemHTML(id, title, body, updated) {
    const MAX_BODY_LENGTH = 60;

    return `
            <div class="notes__list-item" data-note-id="${id}">

            <button class="btn borrar" id="bottom" href="#">
            <i class="fa-solid fa-trash"></i> Borrar</button>


                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? '...' : ''}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}
                </div>
            </div>
        `;
  }

  updateNoteList(notes) {
    const notesListContainer = this.root.querySelector('.notes__list');

    // Lista vacía
    notesListContainer.innerHTML = '';

    for (const note of notes) {
      const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

      notesListContainer.insertAdjacentHTML('beforeend', html);
    }

    // Agregar eventos Seleccionar/eliminar para cada elemento de lista
    notesListContainer.querySelectorAll('.notes__list-item').forEach((noteListItem) => {
      noteListItem.addEventListener('click', () => {
        this.onNoteSelect(noteListItem.dataset.noteId);
      });

      noteListItem.addEventListener('dblclick', () => {
        const doDelete = confirm('Estas seguro que quieres eliminar esta nota?');

        if (doDelete) {
          this.onNoteDelete(noteListItem.dataset.noteId);
        }
      });

      noteListItem.querySelector('.btn').addEventListener('click', () => {
        const doDelete = confirm('Estas seguro que quieres eliminar esta nota?');

        if (doDelete) {
          this.onNoteDelete(noteListItem.dataset.noteId);
        }
      });
    });
  }

  updateActiveNote(note) {
    this.root.querySelector('.notes__title').value = note.title;
    this.root.querySelector('.notes__body').value = note.body;

    this.root.querySelectorAll('.notes__list-item').forEach((noteListItem) => {
      noteListItem.classList.remove('notes__list-item--selected');
    });

    this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add('notes__list-item--selected');
  }

  updateNotePreviewVisibility(visible) {
    this.root.querySelector('.notes__preview').style.visibility = visible ? 'visible' : 'hidden';
  }
}
