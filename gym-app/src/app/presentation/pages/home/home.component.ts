import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.component.scss',
  templateUrl: './home.component.html',
})
export default class HomePage {
  chamada = input('Aumente sua');
  destaque = input('Força');
  titulo = input('Muscular');
  subtitulo = input('Aceite o desafio e transforme seu corpo');
  texto = input(
    'Treinos montados por profissionais, acompanhados pelo app e ajustados a cada mês.',
  );

  linkAcao = input('#unidades');
  selo = input('Aberta 24/7');
  servicos = input<string[]>(['Personal trainer', 'Musculação', 'Aulas de boxe', 'Cardio']);
  imagemUrl = input('/banner.jpg');

  imagemWebp = input('/banner.jpg');
  imagemAlt = input('Aluna sorrindo enquanto amarra o tênis antes do treino');
}
