import factory from 'app/controls/factory';

function saveFrame(name: string) {
  const defaultValue = 'save frame'

  return factory.button({
    id: 'saveFrame',
    defaultValue,
    label: 'click to save frame',
    category: 'storage',
    setup(data, c) {
      // TDDO: review better abstraction
      if (data.value && data.value !== 'save frame') {
        const date = new Date();
        const imageName = `${name}_${date.toLocaleDateString()}_${date.toLocaleTimeString()}`;
        c.saveCanvas(c.drawingContext.canvas, imageName, 'png');
        data.value = defaultValue;
      }
    },
  });
}

export default { saveFrame };
