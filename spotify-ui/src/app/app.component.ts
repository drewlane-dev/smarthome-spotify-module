import { Component } from '@angular/core';
import { SpotifyComponent } from './spotify/spotify.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SpotifyComponent],
  template: '<app-spotify></app-spotify>',
  styles: [':host { display: block; height: 100%; }']
})
export class AppComponent {}
