function onColorSchemeChange(onChange: (colorScheme: string) => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  function onColorSchemeChange() {
    const scheme = media.matches ? 'dark' : 'light';
    onChange(scheme);
  }

  onColorSchemeChange();
  media.addEventListener('change', onColorSchemeChange);
}

export default { onColorSchemeChange };
