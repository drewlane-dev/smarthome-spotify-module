# Spotify Module for Smarthome

A smarthome module that enables Spotify Connect on your device.

## Structure

```
config/
├── mfe-manifest.json      # MFE configuration (tile, routing)
├── mfe-deployment.yaml    # Kubernetes deployment for MFE container
├── module-fields.json     # Configuration fields for the module
└── service-template.yaml  # Kubernetes template for spotifyd service
```

## Installation

1. Open your Smarthome UI
2. Click the "+" button in the header
3. Enter this repository URL: `https://github.com/YOUR_USERNAME/spotify-module`
4. Click "Validate" then "Install Module"

## Configuration

After installation, the module will prompt you to configure:

- **Device Name**: The name that appears in your Spotify app
- **Audio Quality**: Bitrate (96, 160, or 320 kbps)

## Requirements

- Smarthome system with the management API running
- Kubernetes cluster with audio device access
- Spotify Premium account (for Spotify Connect)
