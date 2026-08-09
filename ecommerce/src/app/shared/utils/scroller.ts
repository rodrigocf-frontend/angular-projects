import Lenis from 'lenis';

const lenis = new Lenis({
  autoRaf: true, // roda o próprio loop de animação; sem isso o scrollTo não anima
  duration: 1.6, // deixa o scroll normal (wheel/touch) mais lento também
});

export const scrollBehaviorTo = (id: string) => {
  const target = document.querySelector(id);
  if (target) {
    lenis.scrollTo(target as HTMLElement, {
      duration: 2.0, // Duração em segundos (deixa mais lento)
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // curva de aceleração opcional
    });
  }
};

export const scrollToTop = () => {
  lenis.scrollTo(0, {
    duration: 2.0,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
};
