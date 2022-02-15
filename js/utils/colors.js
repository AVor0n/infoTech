import colors from "../../data/colors.js";

export function getNearbyColor(inputHex) {
  const nearbyColors = Object.entries(colors)
    .map(([colorName, hex]) => ({ colorName, diff: getDiffColor(inputHex, hex) }))
    .sort((color1, color2) => color1.diff - color2.diff);

  return nearbyColors[0].colorName;
}

export function getDiffColor(hex1, hex2) {
  const rgb1 = hex2Rgb(hex1);
  const rgb2 = hex2Rgb(hex2);

  return Math.sqrt((rgb1.r - rgb2.r) ** 2 + (rgb1.g - rgb2.g) ** 2 + (rgb1.b - rgb2.b) ** 2);
}

export function hex2Rgb(hex) {
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return {
    r: parseInt(rgb[1], 16),
    g: parseInt(rgb[2], 16),
    b: parseInt(rgb[3], 16),
  };
}

export function colorName2hex(colorName) {
  return colors[colorName];
}

export function hex2ColorName(hex) {
  for (const [colorName, colorHex] of Object.entries(colors)) {
    if (hex === colorHex) return colorName;
  }
}
