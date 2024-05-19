export default function Spinner() {
  const body = document.querySelector('body');
  const spinnerLoader = document.createElement('div');
  spinnerLoader.className =
    'loader absolute bottom-[50vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10';
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
