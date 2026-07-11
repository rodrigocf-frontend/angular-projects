import { Component, input } from '@angular/core';
import { Icon, IconKey } from '../ui/icon/icon';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [Icon],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
})
export class ComingSoon {
  title = input<string>('Em breve');
  icon = input<IconKey>('calendar');
}
