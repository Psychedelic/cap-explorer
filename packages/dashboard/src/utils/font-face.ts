/* eslint-disable import/prefer-default-export */

export const getFontSrc = (font: string, fallbackFont: string) => `local("Inter"), url(${font}) format("woff2"), url(${fallbackFont}) format("woff")`;

interface AddFontFaceProps {
  fontFamily: string,
  fontSrc: string,
  fontWeight: string,
  fontStyle: string,
  fontDisplay: string,
}

export const addFontFace = ({
  fontFamily,
  fontSrc,
  fontWeight,
  fontStyle,
  fontDisplay,
}: AddFontFaceProps) => {
  if (FontFace) {
    (async () => {
      const fontFaceInstance = new FontFace(fontFamily, fontSrc);
      const loadedFace = await fontFaceInstance.load();

      if (loadedFace) {
        (document as any).fonts.add(loadedFace);
        document.body.style.fontFamily = fontFamily;
      } else {
        // eslint-disable-next-line no-console
        console.error(`Failed to load the font-face ${fontSrc}`);
      }
    })();
  } else {
    const targetId = `custom-font-${fontFamily.toLowerCase()}`;

    if (!document.getElementById(targetId)) {
      const style = document.createElement('style');
      style.id = targetId;
      style.innerHTML = `
        font-family: ${fontFamily};
        src: ${fontSrc};
        font-weight: ${fontWeight};
        font-style: ${fontStyle};
        font-display: ${fontDisplay};
      `;
      document.head.appendChild(style);
    } else {
      // eslint-disable-next-line no-console
      console.error(`Prevent font-face ${fontSrc} injection on repaint`);
    }
  }
};
