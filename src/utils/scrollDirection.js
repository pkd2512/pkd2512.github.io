/**
 * @param {HTMLElement} node
 */
export default (node) => {
  let prevY = window.scrollY;

  const getDirection = () => {
    const y = window.scrollY;
    const dy = y - prevY;
    prevY = y;

    if (Math.abs(dy) > 3) {
      node.classList.toggle('up', dy < 0);
      node.classList.toggle('down', dy >= 0);
    }
  };

  window.addEventListener('scroll', getDirection, { passive: true });

  return {
    destroy() {
      window.removeEventListener('scroll', getDirection);
    },
  };
};
