import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Access shell's API URL when loaded as federated module
declare global {
  interface Window {
    __API_URL__?: string;
  }
}

export interface ModuleStatus {
  moduleName: string;
  isDeployed: boolean;
  isRunning: boolean;
  serviceDeployed: boolean;
  serviceRunning: boolean;
  podStatus?: string;
  mfePodStatus?: string;
  fieldValues?: Record<string, string>;
  serviceNodePort?: number;
  message?: string;
}

export interface ModuleDefinition {
  name: string;
  displayName: string;
  description?: string;
  fields: ModuleField[];
}

export interface ModuleField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
  options?: string[];
}

export interface DeployRequest {
  fieldValues: Record<string, string>;
}

function getApiUrl(): string {
  // Use shell's API URL if available (federated module context)
  if (window.__API_URL__) {
    return window.__API_URL__;
  }
  // Detect API URL from current host - API runs on port 5000
  return `${window.location.protocol}//${window.location.hostname}:5000`;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly moduleName = 'spotify';
  private readonly apiUrl = `${getApiUrl()}/api/modules`;

  constructor(private http: HttpClient) {}

  getModuleDefinition(): Observable<ModuleDefinition> {
    return this.http.get<ModuleDefinition>(`${this.apiUrl}/${this.moduleName}`);
  }

  getStatus(): Observable<ModuleStatus> {
    return this.http.get<ModuleStatus>(`${this.apiUrl}/${this.moduleName}/status`);
  }

  deploy(fieldValues: Record<string, string>): Observable<ModuleStatus> {
    const request: DeployRequest = { fieldValues };
    return this.http.post<ModuleStatus>(`${this.apiUrl}/${this.moduleName}/configure`, request);
  }

  remove(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.moduleName}`);
  }
}
