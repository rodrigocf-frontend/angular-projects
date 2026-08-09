// The 'lenis' package instantiates a real Lenis instance at module load time
// (with autoRaf: true), which drives a continuous requestAnimationFrame loop.
// That is not safe/deterministic in jsdom, so the package is mocked here,
// before any other import, to keep this spec fast and hermetic.
const scrollToMock = vi.fn();

vi.mock('lenis', () => ({
  default: vi.fn(function (this: any) {
    this.scrollTo = scrollToMock;
    this.raf = vi.fn();
    this.destroy = vi.fn();
  }),
}));

import Lenis from 'lenis';
import { scrollToTop } from './scroller';

describe('scroller', () => {
  beforeEach(() => {
    scrollToMock.mockClear();
    document.body.innerHTML = '';
  });

  // Must run before any other test in this file: Lenis is created lazily (on first use, not on
  // module import) and memoized as a module-level singleton, so this only holds true first.
  it('lazily constructs a single Lenis instance the first time a scroll helper is used', () => {
    expect(Lenis).not.toHaveBeenCalled();

    scrollToTop();

    expect(Lenis).toHaveBeenCalledWith({ autoRaf: true, duration: 1.6 });
    expect(Lenis).toHaveBeenCalledTimes(1);

    scrollToTop();

    expect(Lenis).toHaveBeenCalledTimes(1);
  });

  describe('scrollToTop', () => {
    it('calls scrollTo with 0 as the target', () => {
      scrollToTop();

      expect(scrollToMock).toHaveBeenCalledTimes(1);
      const [target, options] = scrollToMock.mock.calls[0];
      expect(target).toBe(0);
      expect(options.duration).toBe(2.0);
      expect(typeof options.easing).toBe('function');
    });
  });
});
