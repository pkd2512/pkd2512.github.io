/**
 * @param {{title: string}} current - metadata for the page
 * @param {{title: string}[]} projects - metadata of all projects
 * @returns {{prev: {title: string}, next: {title: string}} | undefined}
 */

export default (current, projects) => {
  let index = projects.findIndex((d) => d.title === current.title);

  if (index === -1) return;

  let prevEl = projects[index - 1];
  let nextEl = projects[index + 1];

  if (index === 0) {
    prevEl = projects[projects.length - 1];
  }

  if (index === projects.length - 1) {
    nextEl = projects[0];
  }

  return {
    prev: prevEl,
    next: nextEl,
  };
};
