# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a uni-app cross-platform mobile application called "时代呼应" (HuYing Board), built with Vue 3. It supports multiple platforms including H5, WeChat Mini Program, App (iOS/Android), and other mini programs.

## Development Commands

This project is developed using HBuilderX IDE. There are no npm scripts for build/test. Development workflow:

1. Open the project in HBuilderX
2. Run to browser/simulator/device using HBuilderX's built-in tools
3. Build for production via HBuilderX's "发行" (Distribute) menu

```bash
# Install dependencies (if needed)
npm install

# Run on H5 (requires HBuilderX)
# Use HBuilderX: Run -> Run to Browser

# Build for production (requires HBuilderX)
# Use HBuilderX: Distribute -> H5/Mini Program/App
```

## Architecture

### Directory Structure

- `pages/` - Page components organized by feature modules
  - `note/` - Task/schedule management (今日事)
  - `weiguang/` - Social browsing feature (微逛)
  - `order/` - Subscription management (订阅)
  - `publish/` - Content publishing (发布)
  - `prefer/` - User profile and settings (我的)
  - `kefu/` - Customer service (客服)
- `components/` - Reusable Vue components
- `common/` - Shared utilities and styles
  - `js/utils/` - Utility functions (request, common helpers, constants)
  - `js/sdk/` - Third-party SDK integrations (qrcode, lzstring)
  - `js/data/` - Static data (cities, palettes)
- `uni_modules/` - uni-app plugins (FirstUI, uni-ui components)
- `static/` - Static assets (images, fonts, icons)

### Key Files

- `pages.json` - Page routing and navigation bar configuration
- `manifest.json` - Application configuration (app ID, version, platform settings)
- `App.vue` - Application entry component
- `main.js` - Application bootstrap (supports Vue 2 and Vue 3)

### Tab Bar Navigation

The app has 5 main tabs defined in `pages.json`:
1. 今日事 (Task Management)
2. 微逛 (Social Browse)
3. 订阅 (Subscription)
4. 发布 (Publish)
5. 我的 (Profile)

### API Layer

API requests are handled in `common/js/utils/request.js`:

- Two API endpoints:
  - `/cpi/` - Main API (uses `status_code: 200`)
  - `/bpi/` - System API (uses `status: 200`)
  - `/wpi/` - Digital human API
- Automatic token management with auto-retry on session expiry
- All requests include `app-name: 'huying'` header
- Token is retrieved from storage and added to requests via `queryWithToken()`

### Component Libraries

- **FirstUI** (`firstui-uni`, `firstui-unix`) - Primary UI component library
- **uni-ui** - Official uni-app UI components (in `uni_modules/`)

### Utility Functions (`common/js/utils/`)

- `request.js` - HTTP request wrapper with token handling
- `common.js` - Date formatting, GUID generation, clipboard, validation
- `constant.js` - App constants (file size limits, etc.)
- `page.js` - WeChat JS-SDK initialization for H5

### Platform-Specific Code

The codebase uses uni-app conditional compilation:
- `// #ifdef H5` - H5-specific code
- `// #ifdef APP-PLUS` - Native app code
- `// #ifndef APP-PLUS-NVUE` - Non-nvue code
- `.nvue` files - Native rendering for better performance

### Authentication Flow

1. User credentials stored in `credential` (localStorage)
2. Token stored in `token` (localStorage)
3. On 401/403, system auto-retries login with stored credentials
4. If auth fails, redirects to signin page

## File Naming Conventions

- `.vue` files - Standard Vue components
- `.nvue` files - Native-rendering components (better performance for complex lists)

## Notes

- The API host is currently empty (`host = ''`), meaning relative URLs are used
- H5 mode uses history router mode
- WeChat mini program requires `urlCheck: false` in development
