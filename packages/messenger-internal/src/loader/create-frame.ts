import { uniqueId } from "./unique-id";

export const createIFrame = async (): Promise<HTMLIFrameElement> => {
  const iframe = document.createElement("iframe");
  iframe.id = `userlike-frame-${uniqueId()}`;
  iframe.title = 'Empty frame';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;

  iframe.style.setProperty('position', 'absolute', 'important');
  iframe.style.setProperty('opacity', '0', 'important');
  iframe.style.setProperty('height', '1px', 'important');
  iframe.style.setProperty('top', '0', 'important');
  iframe.style.setProperty('left', '0', 'important');
  iframe.style.setProperty('border', 'none', 'important');
  iframe.style.setProperty('display', 'block', 'important');
  iframe.style.setProperty('z-index', '-1', 'important');

  return new Promise<HTMLIFrameElement>((resolve) => {
    iframe.addEventListener("load", () => resolve(iframe));
    document.body.appendChild(iframe);
  });
};
