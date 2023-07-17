export default (node) => {
  let y = window.scrollY;
  let prevY = window.scrollY;
  let dy = y - prevY;

  window.addEventListener('scroll', () => {
    y = window.scrollY;
    dy = y - prevY;
    prevY = y;
    node.classList.toggle('up', dy < 0);
    node.classList.toggle('down', dy >= 0);
  });

  return {
    destroy() {
      window.removeEventListener('scroll');
    },
  };
};
