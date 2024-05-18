function importImages(r) {
  let images = {};
  r.keys().map((item) => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
}

// Import all images from the 'assets' directory
const dayImages = importImages(
  require.context('./assets/weather/day', false, /\.(png|jpe?g|svg)$/)
);
const nightImages = importImages(
  require.context('./assets/weather/day', false, /\.(png|jpe?g|svg)$/)
);

export { dayImages, nightImages };
