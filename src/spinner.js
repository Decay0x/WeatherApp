export default function Spinner() {
  const body = document.querySelector('body');
  const spinnerLoader = document.createElement('div');
  spinnerLoader.className =
    'loader absolute -top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10';
  const spinner = {
    show: () => {
      body.appendChild(spinnerLoader);
    },
    hide: () => {
      body.removeChild(spinnerLoader);
    },
  };
  return spinner;
}
