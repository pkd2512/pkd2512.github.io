export default (node) => {
  let y = window.scrollY;
  let prevY = window.scrollY;
  let dy = y - prevY;

  const getDirection = () => {
    y = window.scrollY;
    dy = y - prevY;
    prevY = y;

    Math.abs(dy) > 5 && node.classList.toggle('up', dy < 0);
    Math.abs(dy) > 5 && node.classList.toggle('down', dy >= 0);
  };

  window.addEventListener('scroll', getDirection);

  return {
    destroy() {
      window.removeEventListener('scroll', getDirection);
    },
  };
};
