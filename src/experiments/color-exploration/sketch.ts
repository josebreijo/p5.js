import p5 from 'p5';

export function sketch(c: p5) {
  const FRAMERATE = 60;

  let hue = 0;
  let saturation = 100;
  let lightness = 50;

  c.setup = function setup() {
    c.frameRate(FRAMERATE);
    c.createCanvas(c.windowWidth, c.windowHeight);
    c.colorMode(c.HSB);
    c.fill(255);
    c.textSize(26);
    c.textFont('Iosevka Fixed');
  };

  c.draw = function draw() {
    const mouseDeltaX = c.map(c.mouseX, 0, c.windowWidth, 0, 101);
    const mouseDeltaY = c.map(c.mouseY, 0, c.windowHeight, 0, 101);

    hue = (hue + 0.25) % 360;
    saturation = c.int(mouseDeltaX);
    lightness = c.int(mouseDeltaY);

    c.fill(lightness > 60 ? 0 : 255);
    c.background(hue, saturation, lightness);

    const currentColor = `
      hue: ${c.int(hue)}
      saturation: ${saturation}
      lightness: ${lightness}`;

    c.text(currentColor, 20, 50);
  };

  c.mousePressed = function () {
    const toggleAnimation = c.isLooping() ? c.noLoop : c.loop;
    toggleAnimation.call(c);

    if (!c.isLooping()) {
      const hslColor = `hsl(${c.int(hue)}deg ${saturation}% ${lightness}%)`;
      window.navigator.clipboard.writeText(hslColor);
    }
  };
}
