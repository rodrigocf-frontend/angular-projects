import { Component, input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabasePublishableKey);
  }

  ngOnInit(): void {
    this.supabase.auth
      .getSession()
      .then((e) => console.log(e))
      .catch((e) => {
        console.error(e);
      });
  }
}
