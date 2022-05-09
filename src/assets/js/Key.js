import createElement from './createElement';
import keyboadrdData from './keyboardData';

const functionalKeys = ['MetaLeft', 'AltLeft', 'AltRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'Backspace', 'CapsLock', 'ControlLeft', 'ControlRight', 'Delete', 'Enter', 'ShiftLeft', 'ShiftRight', 'Tab', 'Lang', 'Space'];

export default class Key {
  constructor(lang, code) {
    const element = keyboadrdData[lang].flat().find((el) => el.code === code);
    this.small = element.small;
    this.shift = element.shift;
    this.type = element.type;
    this.code = code;

    this.createKeyButton = createElement('div', 'key', this.small, this.code);
    if (functionalKeys.includes(this.code)) {
      this.createKeyButton.classList.add('functional');
    }
  }
}
