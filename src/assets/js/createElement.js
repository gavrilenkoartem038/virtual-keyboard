export default function createElement(tagName, className, textContent, dataset) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  if (textContent)element.textContent = textContent;
  if (dataset) element.dataset.code = dataset;
  return element;
}
