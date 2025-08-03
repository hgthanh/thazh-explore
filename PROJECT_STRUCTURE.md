# Cấu trúc Dự án Thazh Explore Browser

```
thazh-explore/
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 android-build.yml          # GitHub Actions CI/CD
├── 📁 android/
│   ├── 📁 app/
│   │   ├── 📁 src/main/
│   │   │   ├── 📁 java/com/thazhexplore/
│   │   │   │   ├── 📄 MainActivity.java
│   │   │   │   └── 📄 MainApplication.java
│   │   │   ├── 📁 res/
│   │   │   │   ├── 📁 drawable/
│   │   │   │   │   └── 📄 splash_screen.xml
│   │   │   │   ├── 📁 mipmap-*/          # App icons
│   │   │   │   ├── 📁 values/
│   │   │   │   │   ├── 📄 colors.xml
│   │   │   │   │   ├── 📄 strings.xml
│   │   │   │   │   └── 📄 styles.xml
│   │   │   │   └── 📁 xml/
│   │   │   │       └── 📄 network_security_config.xml
│   │   │   └── 📄 AndroidManifest.xml
│   │   ├── 📄 build.gradle              # App build config
│   │   └── 📄 proguard-rules.pro        # ProGuard rules
│   ├── 📄 build.gradle                  # Project build config
│   ├── 📄 gradle.properties             # Gradle properties
│   └── 📄 settings.gradle               # Gradle settings
├── 📁 src/
│   ├── 📁 components/                   # UI Components
│   │   ├── 📄 AddressBar.tsx            # Safari-style address bar
│   │   ├── 📄 NavigationBar.tsx         # Bottom navigation
│   │   └── 📄 TabBar.tsx                # Tab management UI
│   ├── 📁 screens/                      # App Screens
│   │   ├── 📄 BrowserScreen.tsx         # Main browser interface
│   │   ├── 📄 BookmarksScreen.tsx       # Bookmarks management
│   │   └── 📄 SettingsScreen.tsx        # App settings
│   ├── 📁 services/                     # Business Logic
│   │   ├── 📄 BookmarkService.ts        # Bookmark operations
│   │   └── 📄 HistoryService.ts         # History operations
│   ├── 📁 types/                        # TypeScript types
│   ├── 📁 utils/                        # Utility functions
│   └── 📁 assets/                       # Static assets
│       ├── 📁 fonts/                    # Custom fonts
│       └── 📁 images/                   # Images
├── 📄 App.tsx                           # Root component
├── 📄 index.js                          # Entry point
├── 📄 app.json                          # App configuration
├── 📄 package.json                      # Dependencies
├── 📄 babel.config.js                   # Babel config
├── 📄 metro.config.js                   # Metro bundler config
├── 📄 react-native.config.js            # RN config
├── 📄 tsconfig.json                     # TypeScript config
├── 📄 .eslintrc.js                      # ESLint config
├── 📄 .prettierrc.js                    # Prettier config
├── 📄 .gitignore                        # Git ignore rules
├── 📄 LICENSE                           # MIT License
├── 📄 README.md                         # Project overview
├── 📄 SETUP.md                          # Setup instructions
└── 📄 PROJECT_STRUCTURE.md              # This file
```

## 📋 Mô tả chi tiết các thành phần

### 🚀 Core App Files
- **`App.tsx`**: Component root của ứng dụng, setup navigation
- **`index.js`**: Entry point, đăng ký component với React Native
- **`app.json`**: Metadata và cấu hình cơ bản của app

### 📱 Components (`src/components/`)
- **`AddressBar.tsx`**: Thanh địa chỉ kiểu Safari với search, SSL indicator, progress bar
- **`NavigationBar.tsx`**: Thanh điều hướng dưới với back/forward/tabs/bookmarks
- **`TabBar.tsx`**: Giao diện quản lý tab với preview và close functionality

### 🖥️ Screens (`src/screens/`)
- **`BrowserScreen.tsx`**: Màn hình chính với WebView, tab management, navigation
- **`BookmarksScreen.tsx`**: Quản lý bookmark với search, edit, delete
- **`SettingsScreen.tsx`**: Cài đặt ứng dụng, privacy, security options

### ⚙️ Services (`src/services/`)
- **`BookmarkService.ts`**: CRUD operations cho bookmark với AsyncStorage
- **`HistoryService.ts`**: Quản lý lịch sử duyệt web, frequent sites

### 🤖 Android Configuration
- **Java Files**: MainActivity, MainApplication cho React Native bridge
- **Resources**: Colors, strings, styles, splash screen, app icons
- **Manifest**: Permissions, intents, app configuration
- **Build Scripts**: Gradle build configuration, ProGuard rules

### 🔧 Development Tools
- **TypeScript**: Type safety với tsconfig.json
- **ESLint**: Code linting với .eslintrc.js
- **Prettier**: Code formatting với .prettierrc.js
- **Metro**: Bundler configuration
- **Babel**: JavaScript transpilation

### 📦 Build & Deploy
- **GitHub Actions**: Automated CI/CD pipeline
- **Gradle**: Android build system
- **ProGuard**: Code obfuscation and optimization

## 🔄 Data Flow

```
User Input → AddressBar → BrowserScreen → WebView
                ↓
        BookmarkService ← → AsyncStorage
                ↓
        HistoryService ← → AsyncStorage
```

## 🎨 UI Architecture

```
BrowserScreen (Main Container)
├── AddressBar (Top)
│   ├── Security Icon
│   ├── URL Input/Display
│   ├── Progress Bar
│   └── Menu Dropdown
├── WebView Container (Center)
│   └── Multiple WebView Instances
├── TabBar (Overlay)
│   ├── Tab Preview Cards
│   └── Add New Tab Button
└── NavigationBar (Bottom)
    ├── Back/Forward Buttons
    ├── Share Button
    ├── Bookmarks Button
    └── Tabs Counter
```

## 📊 State Management

- **Local State**: React hooks (useState, useEffect)
- **Persistent Storage**: AsyncStorage for bookmarks and history
- **WebView State**: URL, title, navigation state per tab
- **App Settings**: User preferences and configuration

## 🔒 Security Features

- **Network Security Config**: Allow HTTP for specific domains
- **SSL Indicators**: Visual feedback for secure/insecure connections
- **Permission Management**: Camera, microphone, location permissions
- **Content Security**: Block pop-ups, manage JavaScript execution

## 📈 Performance Optimizations

- **Tab Management**: Efficient WebView rendering and memory usage
- **Image Optimization**: Vector icons, optimized splash screen
- **Bundle Size**: ProGuard minification for release builds
- **Caching**: AsyncStorage for quick bookmark/history access