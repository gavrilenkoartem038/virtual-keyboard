import keyboardData from './keyboardData';
import createElement from './createElement';
import Key from './Key';

export default class Keyboard {
  constructor() {
    this.lang = localStorage.getItem('currentLang') || 'en';
    this.keyboardObject = [];
    this.specChars = {
      Enter: '\n',
      Space: ' ',
      Tab: '\t',
    };
    this.arrowKeys = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    this.currentLang = this.lang;
    this.isCaps = false;
    this.isShiftPressed = false;
    this.isControlLeftPressed = false;
    this.isAltLeftPressed = false;
  }

  createPage() {
    this.title = createElement('h1', 'title', 'RSS Virtual keyboard');
    this.textarea = createElement('textarea', 'textarea');
    const keyboard = this.createKeyboard();
    document.body.append(this.title, this.textarea, keyboard);
    keyboard.addEventListener('mousedown', this.handleEvent);
    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
  }

  createKeyboard() {
    const keyboard = createElement('div', 'keyboard');
    keyboardData[this.lang].forEach((row) => {
      const rowElement = createElement('div', 'row');
      keyboard.append(rowElement);
      row.forEach((key) => {
        this.keyEl = new Key(this.lang, key.code);
        this.keyboardObject.push(this.keyEl);
        const keyButton = this.keyEl.createKeyButton;
        rowElement.append(keyButton);
      });
    });
    return keyboard;
  }

  handleEvent = (e) => {
    e.preventDefault();
    if ((!e.target.classList.contains('key') && !e.code) || e.repeat) return;
    let key;
    try {
      key = (e.target.classList.contains('key')) ? e.target : this.keyboardObject.find((el) => el.code === e.code).createKeyButton;
    } catch (err) {
      return;
    }

    const keyCode = key.dataset.code;

    key.addEventListener('mouseleave', this.handleEvent);
    key.addEventListener('mouseup', this.handleEvent);

    const rewriteKeyboard = () => {
      const noCapsKeys = (this.isShiftPressed) ? 'shift' : 'small';
      const capsKeys = ((this.isCaps && !this.isShiftPressed) || (!this.isCaps && this.isShiftPressed)) ? 'shift' : 'small';
      this.keyboardObject.forEach((keyButton) => {
        const kButton = keyButton;
        if (keyButton.type === 'noCaps') {
          kButton.createKeyButton.textContent = keyButton[noCapsKeys];
        } else {
          kButton.createKeyButton.textContent = keyButton[capsKeys];
        }
      });
    };

    const switchLang = () => {
      this.lang = this.lang === 'en' ? 'ru' : 'en';
      localStorage.setItem('currentLang', this.lang);
      keyboardData[this.lang].forEach((row) => row.forEach((el) => {
        for (let i = 0; i < this.keyboardObject.length; i += 1) {
          if (this.keyboardObject[i].code === el.code) {
            this.keyboardObject[i].small = el.small;
            this.keyboardObject[i].shift = el.shift;
            this.keyboardObject[i].type = el.type;
          }
        }
      }));
      rewriteKeyboard();
    };

    const shiftCapsKeyboard = (keycode) => {
      const code = (keycode === 'CapsLock') ? 'isCaps' : 'isShiftPressed';
      this[code] = (!this[code]);
      rewriteKeyboard();
    };

    const deactivateKey = () => {
      if (keyCode !== 'CapsLock'
          || (keyCode === 'CapsLock' && !this.isCaps)) key.classList.remove('active');

      if (['ShiftLeft', 'ShiftRight'].includes(keyCode)) {
        shiftCapsKeyboard();
      }
      if (['ControlLeft', 'AltLeft'].includes(keyCode)) {
        this[`is${keyCode}Pressed`] = false;
      }
      key.removeEventListener('mouseleave', this.handleEvent);
      key.removeEventListener('mouseup', this.handleEvent);
      this.textarea.focus();
    };

    const insertChar = (char) => this.textarea.setRangeText(char, this.textarea.selectionStart, this.textarea.selectionEnd, 'end');

    const deleteChar = (delKeyCode) => {
      const cursorPosition = this.textarea.selectionStart;
      const { selectionStart, selectionEnd } = this.textarea;
      const output = this.textarea.value;
      const setCursorPosition = (shift = 0) => {
        ['Start', 'End'].forEach((el) => {
          this.textarea[`selection${el}`] = cursorPosition - shift;
        });
      };

      if (selectionStart !== selectionEnd) {
        this.textarea.value = output.slice(0, selectionStart)
            + output.slice(selectionEnd, output.length);
        setCursorPosition();
      } else if (delKeyCode === 'Backspace' && selectionStart !== 0) {
        this.textarea.value = output.slice(0, selectionStart - 1)
            + output.slice(selectionEnd, output.length);
        setCursorPosition(1);
      } else if (delKeyCode === 'Delete' && selectionEnd !== output.length) {
        this.textarea.value = output.slice(0, selectionStart)
            + output.slice(selectionEnd + 1, output.length);
        setCursorPosition();
      }
    };

    if (['mousedown', 'keydown'].includes(e.type)) {
      key.classList.add('active');
      this.textarea.focus();

      if (!key.classList.contains('functional')
          || this.arrowKeys.includes(keyCode)) {
        insertChar(key.textContent);
      } else if (this.specChars[keyCode]) {
        insertChar(this.specChars[keyCode]);
      } else if (['Backspace', 'Delete'].includes(keyCode)) {
        deleteChar(keyCode);
      } else if (['ShiftLeft', 'ShiftRight', 'CapsLock'].includes(keyCode)) {
        shiftCapsKeyboard(keyCode);
      } else if (['ControlLeft', 'AltLeft'].includes(keyCode)) {
        this[`is${keyCode}Pressed`] = true;
        if (this.isControlLeftPressed && this.isAltLeftPressed) switchLang();
      }
    } else if (['mouseup', 'mouseleave', 'keyup'].includes(e.type)) {
      deactivateKey();
    }
  };
}
