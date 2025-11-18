# 202020

A minimal desktop app that helps you follow the 20-20-20 rule for eye health.

## What's the 20-20-20 Rule?

Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.


## Building

Install dependencies:
```bash
npm install
```

Build for macOS:
```bash
npm run build
```

This will create a DMG installer in the `release` folder.

## Usage

1. Click "Start Session" to begin
2. You'll receive a notification every 20 minutes
3. When notified, look at something 20 feet away for 20 seconds
4. Click "Stop Session" to pause the timer

## Run in development mode

Install dependencies:
```bash
npm install
```

Run in development mode:
```bash
npm run dev
```

Note: For development with hot reload, you'll need to run Vite dev server separately:
```bash
npx vite
```
Then in another terminal:
```bash
npm run dev
```
