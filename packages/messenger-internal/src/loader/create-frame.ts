import { uniqueId } from "./unique-id";

export const createIFrame = async (): Promise<HTMLIFrameElement> => {
  const iframe = document.createElement("iframe");
  iframe.id = `userlike-frame-${uniqueId()}`;
  iframe.title = 'Empty frame';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;
  iframe.style.position = 'absolute !important';
  iframe.style.opacity = '0 !important';
  iframe.style.height = '1px !important';
  iframe.style.top = '0 !important';
  iframe.style.left = '0 !important';
  iframe.style.border = 'none !important';
  iframe.style.display = 'block !important';
  iframe.style.zIndex = '-1 !important';

  return new Promise<HTMLIFrameElement>((resolve) => {
    iframe.addEventListener("load", () => resolve(iframe));
    document.body.appendChild(iframe);
  });
};
