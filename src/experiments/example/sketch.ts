import p5 from 'p5';

function sketch(c: p5) {
  const FRAMERATE = 24;

  c.setup = function setup() {
    c.frameRate(FRAMERATE);
    c.createCanvas(c.windowWidth, c.windowHeight);
    c.background(0);
    c.fill(255);
    c.colorMode(c.HSB);
  };

  c.draw = function draw() {
    // magic!
  };
}

export { sketch };
