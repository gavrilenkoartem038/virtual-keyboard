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
}
