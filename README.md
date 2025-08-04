# Thazh Explore Browser

Một trình duyệt web hiện đại được xây dựng bằng React Native với giao diện giống Safari và các tính năng duyệt web cơ bản.

 > - [📥 Download Relaese](https://github.com/hgthanh/thazh-explore/releases)

## ✨ Tính năng

- 🌐 **Duyệt web đầy đủ** - Sử dụng WebView để render các trang web
- 📱 **Giao diện giống Safari** - Thiết kế hiện đại, thân thiện với người dùng
- 🔖 **Quản lý Bookmarks** - Lưu và quản lý các trang web yêu thích
- 📑 **Quản lý Tab** - Mở nhiều trang web cùng lúc
- 💻 **Chế độ Desktop** - Chuyển đổi giữa giao diện mobile và desktop
- 🔍 **Tìm kiếm mặc định** - Sử dụng http://thazhsearch.wuaze.com
- 📱 **Responsive Design** - Tối ưu cho mọi kích thước màn hình
- 🔒 **Bảo mật** - Hiển thị trạng thái SSL và bảo mật trang web

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống

- Node.js 16+
- React Native CLI
- Android Studio (cho Android)
- Xcode (cho iOS)

### Cài đặt dependencies

```bash
# Clone repository
git clone https://github.com/hgthanh/thazh-explore.git
cd thazh-explore

# Cài đặt dependencies
npm install

# Cài đặt dependencies cho iOS (chỉ trên macOS)
cd ios && pod install && cd ..
```

### Chạy ứng dụng

```bash
# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios

# Khởi động Metro bundler
npm start
```

## 🏗️ Build APK

### Build thủ công

```bash
# Build APK release
cd android
./gradlew assembleRelease

# APK sẽ được tạo tại:
# android/app/build/outputs/apk/release/app-release.apk
```

### Build với GitHub Actions

1. **Fork repository này về GitHub của bạn**

2. **Tạo secrets trong GitHub repository:**
   - Vào `Settings` → `Secrets and variables` → `Actions`
   - Thêm các secrets sau:
     ```
     SIGNING_KEY: [Base64 encoded keystore file]
     ALIAS: release
     KEY_STORE_PASSWORD: your_keystore_password
     KEY_PASSWORD: your_key_password
     ```

3. **Tạo keystore cho signing:**
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore \
   -alias release -keyalg RSA -keysize 2048 -validity 10000 \
   -storepass your_password -keypass your_password \
   -dname "CN=Your Name, OU=Your Organization, O=Your Company, L=Your City, S=Your State, C=Your Country"
   
   # Convert keystore to base64
   base64 release.keystore > release.keystore.base64
   ```

4. **Push code để trigger build:**
   ```bash
   git push origin main
   ```

5. **Tải APK:**
   - Vào tab `Actions` trong GitHub repository
   - Chọn workflow run mới nhất
   - Tải file APK từ `Artifacts` section
   - Hoặc tải từ `Releases` nếu build từ main branch

## 📱 Cấu trúc dự án

```
thazh-explore/
├── src/
│   ├── components/          # Các component UI
│   │   ├── AddressBar.tsx   # Thanh địa chỉ
│   │   ├── NavigationBar.tsx # Thanh điều hướng
│   │   └── TabBar.tsx       # Quản lý tab
│   ├── screens/             # Các màn hình chính
│   │   ├── BrowserScreen.tsx # Màn hình duyệt web
│   │   ├── BookmarksScreen.tsx # Màn hình bookmarks
│   │   └── SettingsScreen.tsx # Màn hình cài đặt
│   └── services/            # Các service
│       ├── BookmarkService.ts # Quản lý bookmark
│       └── HistoryService.ts  # Quản lý lịch sử
├── android/                 # Cấu hình Android
├── .github/workflows/       # GitHub Actions
└── package.json
```

> Chi tiết: [tại đây!](PROJECT_STRUCTURE.md)

## 🔧 Tùy chỉnh

### Thay đổi search engine mặc định

Mở `src/screens/BrowserScreen.tsx` và sửa:

```typescript
const DEFAULT_SEARCH_ENGINE = 'https://your-search-engine.com';
```

### Thay đổi tên ứng dụng

1. **Android:** Sửa `android/app/src/main/res/values/strings.xml`
2. **iOS:** Sửa `ios/ThazhExplore/Info.plist`

### Thay đổi icon

1. Thay thế các file icon trong `android/app/src/main/res/mipmap-*/`
2. Thay thế `ios/ThazhExplore/Images.xcassets/AppIcon.appiconset/`

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🔗 Links

- **Default Search Engine:** http://thazhsearch.wuaze.com
- **GitHub Repository:** https://github.com/yourusername/thazh-explore
- **Issues:** https://github.com/yourusername/thazh-explore/issues

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên GitHub repository.

---

Made with ❤️ using React Native