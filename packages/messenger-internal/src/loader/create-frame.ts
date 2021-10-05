import { uniqueId } from "./unique-id";

export const createIFrame = async (): Promise<HTMLIFrameElement> => {
  const iframe = document.createElement("iframe");
  iframe.id = `userlike-frame-${uniqueId()}`;
  iframe.title = 'Empty frame';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;
  iframe.setAttribute(
    "style",
    `
    position: absolute !important;
    opacity: 0 !important;
    height : 1px !important;
    top : 0 !important;
    left : 0 !important;
    border : none !important;
    display : block !important;
    z-index : -1 !important;
  `
  );

  return new Promise<HTMLIFrameElement>((resolve) => {
    iframe.addEventListener("load", () => resolve(iframe));
    document.body.appendChild(iframe);
  });
};
