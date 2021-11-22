export default {}

export const copyToClipboard = (textToCopy: string) => {
  if (!textToCopy || typeof textToCopy !== 'string') {
    console.warn('Oops! Failed to copy to clipboard, non-text value found')

    return;
  }
  navigator.clipboard.writeText(textToCopy);
}