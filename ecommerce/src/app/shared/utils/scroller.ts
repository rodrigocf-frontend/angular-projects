export const scrollBehaviorTo = (id: string) => {
  const targetElement = document.querySelector(id);

  targetElement?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};
