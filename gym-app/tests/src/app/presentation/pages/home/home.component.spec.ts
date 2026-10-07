import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import HomePage from '../../../../../../src/app/presentation/pages/home/home.component';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let compiled: HTMLElement;

  const text = (selector: string) => compiled.querySelector(selector)?.textContent?.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('title', () => {
    it('should render the default title in a single heading', () => {
      expect(compiled.querySelectorAll('h1').length).toBe(1);
      expect(text('.title__lead')).toBe('Aumente sua');
      expect(text('.title__highlight')).toBe('Força');
      expect(text('.title__main')).toBe('Muscular');
    });

    it('should render the default subtitle and description', () => {
      expect(text('.banner__subtitle')).toBe('Aceite o desafio e transforme seu corpo');
      expect(text('.banner__description')).toBe(
        'Treinos montados por profissionais, acompanhados pelo app e ajustados a cada mês.',
      );
    });

    it('should render the given texts', async () => {
      fixture.componentRef.setInput('chamada', 'Melhore seu');
      fixture.componentRef.setInput('destaque', 'Condicionamento');
      fixture.componentRef.setInput('titulo', 'Físico');
      fixture.componentRef.setInput('subtitulo', 'Comece hoje');
      fixture.componentRef.setInput('texto', 'Planos para todos os níveis.');
      await fixture.whenStable();

      expect(text('.title__lead')).toBe('Melhore seu');
      expect(text('.title__highlight')).toBe('Condicionamento');
      expect(text('.title__main')).toBe('Físico');
      expect(text('.banner__subtitle')).toBe('Comece hoje');
      expect(text('.banner__description')).toBe('Planos para todos os níveis.');
    });
  });

  describe('photo', () => {
    it('should render the default photo with its alt text', () => {
      const image = compiled.querySelector<HTMLImageElement>('.banner__photo img');

      expect(image?.getAttribute('src')).toBe('/banner.webp');
      expect(image?.getAttribute('alt')).toBe(
        'Aluna sorrindo enquanto amarra o tênis antes do treino',
      );
    });

    it('should render the webp source', () => {
      const source = compiled.querySelector('.banner__photo source');

      expect(source?.getAttribute('srcset')).toBe('/banner.webp');
      expect(source?.getAttribute('type')).toBe('image/webp');
    });

    it('should not render the webp source without a webp image', async () => {
      fixture.componentRef.setInput('imagemWebp', '');
      await fixture.whenStable();

      expect(compiled.querySelector('.banner__photo source')).toBeNull();
      expect(compiled.querySelector('.banner__photo img')).not.toBeNull();
    });

    it('should not render the photo without an image', async () => {
      fixture.componentRef.setInput('imagemUrl', '');
      await fixture.whenStable();

      expect(compiled.querySelector('.banner__photo')).toBeNull();
    });
  });

  describe('services', () => {
    const services = () =>
      Array.from(compiled.querySelectorAll('.service')).map((service) => ({
        number: service.querySelector('.service__number')?.textContent?.trim(),
        name: service.querySelector('.service__name')?.textContent?.trim(),
      }));

    it('should render the badge', () => {
      expect(text('.services__badge')).toBe('Aberta 24/7');
    });

    it('should render the default services numbered from 1', () => {
      expect(services()).toEqual([
        { number: '1', name: 'Personal trainer' },
        { number: '2', name: 'Musculação' },
        { number: '3', name: 'Aulas de boxe' },
        { number: '4', name: 'Cardio' },
      ]);
    });

    it('should render the given services', async () => {
      fixture.componentRef.setInput('servicos', ['Natação', 'Pilates']);
      await fixture.whenStable();

      expect(services()).toEqual([
        { number: '1', name: 'Natação' },
        { number: '2', name: 'Pilates' },
      ]);
    });

    it('should render an empty list without services', async () => {
      fixture.componentRef.setInput('servicos', []);
      await fixture.whenStable();

      expect(compiled.querySelector('.services__list')).not.toBeNull();
      expect(services()).toEqual([]);
    });
  });

  describe('sign up button', () => {
    it('should link to the login page', () => {
      const button = compiled.querySelector<HTMLAnchorElement>('a.button');

      expect(button?.textContent).toContain('Matricule-se');
      expect(button?.getAttribute('href')).toBe('/login');
    });
  });
});
