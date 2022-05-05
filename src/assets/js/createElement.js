export default function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  element.textContent = textContent;
  return element;
}
