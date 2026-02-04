# Smarthome Spotify Module

Spotify Connect module for the smarthome system. Enables Spotify playback on your smarthome device using Spotifyd.

## Structure

```
smarthome-spotify-module/
├── config/
│   ├── mfe-manifest.json      # MFE configuration for shell
│   ├── module-fields.json     # Configuration form fields
│   ├── mfe-deployment.yaml    # K8s deployment for UI
│   └── service-template.yaml  # K8s deployment for Spotifyd
└── spotify-ui/                # Angular MFE application
    ├── src/
    ├── Dockerfile
    └── package.json
```

## Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| deviceName | text | Name shown in Spotify app |
| bitrate | select | Audio quality (96/160/320 kbps) |

## Development

### Prerequisites
- Node.js 20+
- smarthome-management-api running on port 5000

### Run locally
```bash
cd spotify-ui
npm install
npm start  # Runs on localhost:4201
```

## Deployment

The module is deployed via the smarthome-management-api:

1. Install the module from the shell UI
2. Configure device name and bitrate
3. The API deploys both the MFE and Spotifyd service to K8s

### Manual Docker build
```bash
cd spotify-ui
docker build -t spotify-mfe:latest .
```

## Architecture

- **spotify-ui**: Angular 19 MFE that displays playback status
- **Spotifyd**: Spotify Connect daemon running in K8s with host network access
- **Audio**: Uses ALSA with dmix for audio buffering (requires `/etc/asound.conf` on host)

## Requirements

- Smarthome system with the management API running
- Kubernetes cluster with audio device access
- Spotify Premium account (for Spotify Connect)

## Related Repositories

- [smarthome-shell-ui](https://github.com/drewlane-dev/smarthome-shell-ui) - Shell application
- [smarthome-management-api](https://github.com/drewlane-dev/smarthome-management-api) - Backend API
