# Tameeni - Car Insurance Comparison Platform

## Overview
Tameeni (تأميني) is a Next.js-based car insurance comparison platform for Saudi Arabia. The application allows users to compare car insurance quotes, verify their identity through Nafaz, and complete payments through an integrated system.

## Tech Stack
- **Framework**: Next.js 13.5.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom RTL configuration
- **UI Components**: Radix UI, Lucide React icons, Framer Motion
- **Backend**: Firebase (Firestore, Realtime Database)
- **Live Chat**: Crisp integration via @livechat/widget-react
- **Language**: Arabic (Right-to-Left layout)

## Project Structure
```
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                 # Utilities and Firebase configuration
├── public/              # Static assets
├── styles/              # Global styles and Tailwind config
└── next.config.js       # Next.js configuration
```

## Key Features
- **Insurance Quotes**: Compare car insurance quotes from multiple providers
- **Phone Verification**: Nafaz integration for identity verification
- **Payment Tracking**: Track and manage payments through Firebase
- **Visitor Analytics**: Track visitor data and interactions
- **Live Chat**: Integrated customer support via Crisp
- **Arabic Language**: Full RTL (Right-to-Left) support

## Development

### Running Locally
```bash
npm install
npm run dev
```
The application will run on http://0.0.0.0:5000

### Building for Production
```bash
npm run build
npm start
```

## Firebase Configuration
Firebase is configured in `lib/firebase.ts` with the following services:
- **Firestore**: Database for structured data
- **Realtime Database**: Real-time data synchronization
- **Collections**: `visitors`, `payments`, and other tracking data

## Environment Setup
This project runs on Replit with the following configuration:
- **Port**: 5000 (required for Replit webview)
- **Host**: 0.0.0.0 (allows external access)
- **Workflow**: "Next.js App" - runs `npm run dev`

## Important Notes
- This is a **frontend-only application** - Firebase provides the backend
- The app is configured for the Saudi Arabian market
- All content is in Arabic with RTL layout
- Firebase configuration uses public API keys (standard for client-side apps)

## Recent Changes
- **2024-12-06**: Imported to Replit, configured for dev server with port 5000 and host 0.0.0.0
- Removed static export configuration to enable dev server mode
- Set up workflow for continuous development

## User Preferences
No specific user preferences documented yet.
