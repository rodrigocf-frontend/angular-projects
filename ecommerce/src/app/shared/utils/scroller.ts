import Lenis from 'lenis';

let lenis: Lenis | undefined;

// Criado sob demanda (não no carregamento do módulo) para não instanciar o Lenis -
// e disparar seu loop de rAF - em contextos onde ninguém chegou a rolar a página (ex: testes).
const getLenis = () => {
  if (!lenis) {
    lenis = new Lenis({
      autoRaf: true, // roda o próprio loop de animação; sem isso o scrollTo não anima
      duration: 1.6, // deixa o scroll normal (wheel/touch) mais lento também
    });
  }
  return lenis;
};

export const scrollBehaviorTo = (id: string) => {
  const target = document.querySelector(id);
  if (target) {
    getLenis().scrollTo(target as HTMLElement, {
      duration: 2.0, // Duração em segundos (deixa mais lento)
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // curva de aceleração opcional
    });
  }
};

export const scrollToTop = () => {
  getLenis().scrollTo(0, {
    duration: 2.0,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
};
