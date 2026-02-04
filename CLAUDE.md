# Smarthome Spotify Module

## Overview
Spotify Connect module for the smarthome system. Contains both the Angular MFE UI and Kubernetes deployment configurations for Spotifyd.

## Module Structure

### /config
Configuration files read by smarthome-management-api during installation:

- **mfe-manifest.json**: Defines how the MFE integrates with the shell (tile icon, color, exposed component)
- **module-fields.json**: Form fields for user configuration (device name, bitrate)
- **mfe-deployment.yaml**: K8s Deployment + Service for the Angular MFE container
- **service-template.yaml**: K8s ConfigMap + Deployment for Spotifyd (uses template placeholders like `{{deviceName}}`)

### /spotify-ui
Angular 19 micro-frontend application:

- **Framework**: Angular 19 standalone components
- **Federation**: @angular-architects/native-federation
- **Port**: 4201 (dev)
- **Exposed component**: `SpotifyComponent` via `./Component`

## Key Files

```
spotify-ui/
├── federation.config.js           # Exposes SpotifyComponent
├── src/
│   ├── app/
│   │   ├── spotify/
│   │   │   └── spotify.component.ts  # Main UI component
│   │   └── services/
│   │       └── spotify.service.ts    # API integration
│   └── bootstrap.ts
└── Dockerfile                     # Multi-stage nginx build
```

## Runtime Dependencies

The MFE communicates with **smarthome-management-api** for:
- Module status checks
- Service deployment/removal
- Configuration updates

## API URL Detection

```typescript
function getApiUrl(): string {
  if (window.__API_URL__) {
    return window.__API_URL__;  // Injected by shell
  }
  return `${window.location.protocol}//${window.location.hostname}:5000`;
}
```

## Development

```bash
cd spotify-ui
npm install
npm start  # http://localhost:4201
```

For standalone testing, the MFE can run independently but requires the management API.

## Spotifyd Configuration

The service-template.yaml deploys Spotifyd with:
- **hostNetwork: true**: Required for mDNS discovery
- **privileged: true**: Required for audio device access
- **/dev/snd mount**: ALSA audio access
- **/etc/asound.conf mount**: Host's dmix configuration

Template placeholders replaced at deploy time:
- `{{deviceName}}` - Spotify Connect device name
- `{{bitrate}}` - Audio bitrate (96/160/320)

## Docker Build

```bash
cd spotify-ui
docker build -t spotify-mfe:latest .

# For ARM64 (Raspberry Pi)
docker buildx build --platform linux/arm64 -t spotify-mfe:latest .
```

## GitHub Actions

The workflow:
1. Builds multi-arch Docker image (amd64 + arm64)
2. Pushes to GHCR on main/master branch
3. Creates release on version tags (v*)
