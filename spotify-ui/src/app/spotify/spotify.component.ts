import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpotifyService, ModuleStatus, ModuleDefinition, ModuleField } from '../services/spotify.service';

@Component({
  selector: 'app-spotify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './spotify.component.html',
  styleUrl: './spotify.component.scss'
})
export class SpotifyComponent implements OnInit {
  moduleDefinition: ModuleDefinition | null = null;
  moduleStatus: ModuleStatus | null = null;
  fieldValues: Record<string, string> = {};
  loading = false;
  error = '';

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.loadModuleInfo();
  }

  loadModuleInfo(): void {
    this.loading = true;

    // Load module definition and status in parallel
    this.spotifyService.getModuleDefinition().subscribe({
      next: (definition) => {
        this.moduleDefinition = definition;

        // Initialize field values with defaults
        for (const field of definition.fields) {
          this.fieldValues[field.name] = field.defaultValue || '';
        }

        // Then load status
        this.loadStatus();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to load module definition';
      }
    });
  }

  loadStatus(): void {
    this.spotifyService.getStatus().subscribe({
      next: (status) => {
        this.moduleStatus = status;
        this.loading = false;

        // If deployed, use the deployed field values
        if (status.isDeployed && status.fieldValues) {
          this.fieldValues = { ...this.fieldValues, ...status.fieldValues };
        }
      },
      error: () => {
        this.moduleStatus = null;
        this.loading = false;
      }
    });
  }

  deploy(): void {
    this.loading = true;
    this.error = '';

    this.spotifyService.deploy(this.fieldValues).subscribe({
      next: (status) => {
        this.moduleStatus = status;
        this.loading = false;
        if (status.message && !status.isDeployed) {
          this.error = status.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to deploy module';
      }
    });
  }

  remove(): void {
    this.loading = true;
    this.error = '';

    this.spotifyService.remove().subscribe({
      next: () => {
        this.moduleStatus = {
          moduleName: 'spotify',
          isDeployed: false,
          isRunning: false,
          serviceDeployed: false,
          serviceRunning: false
        };
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to remove module';
      }
    });
  }
}
