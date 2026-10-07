import { Component } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';

@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export default class LoginPage {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabasePublishableKey);
  }

  async signInWithGoogle() {
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }
    // console.log(this.form.value);
    await this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  }
}
