import colors from "../../data/colors.js";

/**
 * Возвращает название наиболее похожего цвета из палитры предопределенных html цветов
 * @param {string} inputHex - hex-код исходного цвета
 * @returns {string} - название наиболее похожего цвета.
 */
export function getNearbyColor(inputHex) {
  const nearbyColors = Object.entries(colors)
    .map(([colorName, hex]) => ({ colorName, diff: getDiffColor(inputHex, hex) }))
    .sort((color1, color2) => color1.diff - color2.diff);

  return nearbyColors[0].colorName;
}

/**
 * Возвращает степень отличия цветов друг от друга
 * @param {string} hex1 - hex-код первого цвета
 * @param {string} hex2 - hex-код второго цвета
 * @returns {number} число от 0 до 442, характеризующее степень отличия цветов
 */
export function getDiffColor(hex1, hex2) {
  const rgb1 = hex2Rgb(hex1);
  const rgb2 = hex2Rgb(hex2);

  return Math.sqrt((rgb1.r - rgb2.r) ** 2 + (rgb1.g - rgb2.g) ** 2 + (rgb1.b - rgb2.b) ** 2);
}

/**
 * Конвертирует hex-представление цвета в rgb
 * @param {string} hex - hex-код цвета
 */
export function hex2Rgb(hex) {
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return {
    r: parseInt(rgb[1], 16),
    g: parseInt(rgb[2], 16),
    b: parseInt(rgb[3], 16),
  };
}

/**
 * Возвращает hex-значение цвета по его названию
 * Работает только для предопределенных html цветов
 * @param {string} colorName - название цвета
 */
export function colorName2hex(colorName) {
  return colors[colorName];
}

/**
 * Возвращает название цвета по его hex-значению
 * Работает только для предопределенных html-цветов
 * @param {hex} - hex-код цвета для получения его названия
 */
export function hex2ColorName(hex) {
  for (const [colorName, colorHex] of Object.entries(colors)) {
    if (hex === colorHex) return colorName;
  }
}

/**
 * Возвращает контрастный цвет для указанного цвета в формате hex
 * @param {string} hex - hex-значение исходного цвета
 * @returns {string} - hex-значение контрастного цвета
 */
export function getContrast(hex) {
  const { r, g, b } = hex2Rgb(hex);

  //перевод из rgb в цветовую модель yiq
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? "#000000" : "#FFFFFF";
}
