export const isUnsupported = (): boolean => {
  const { userAgent: ua } = navigator;
  return ua.indexOf('MSIE') > 0 || ua.indexOf('Trident') > 0;
};
