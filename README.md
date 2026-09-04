# CatCut

Khung ứng dụng chỉnh sửa video thật (không phải mockup) — dùng Expo + FFmpeg.

## Cài đặt (trong GitHub Codespaces hoặc máy có Node.js)

```
npm install
npx expo install expo-dev-client
```

## Build bản dev client (bắt buộc — Expo Go thường không chạy được ffmpeg-kit)

```
npx expo install eas-cli
eas build --profile development --platform android
```

Sau khi build xong, tải file APK về điện thoại và cài. Từ lần sau chỉ cần:

```
npx expo start --dev-client
```

## Cấu trúc

- `App.js` — điều hướng giữa 4 màn hình
- `screens/ProjectListScreen.js` — chọn video từ thư viện máy
- `screens/EditorScreen.js` — cắt video (trim) bằng FFmpeg thật
- `screens/WatermarkScreen.js` — chèn logo mèo + chữ tùy chỉnh bằng FFmpeg thật
- `screens/ExportScreen.js` — xuất video theo độ phân giải/tỉ lệ bằng FFmpeg thật
- `lib/ffmpeg.js` — toàn bộ lệnh FFmpeg thật (trim, overlay, scale/pad)

## Lưu ý quan trọng

- `ffmpeg-kit-react-native` gốc đã ngừng phát triển (retired). Nếu cài lỗi, tìm bản fork cộng đồng đang được duy trì trên GitHub và thay vào `package.json`.
- Đây là bản khung — chưa có: lưu dự án tự động, đếm ngược xóa sau 3 giờ, khóa cài đặt đồ họa giả. Có thể thêm sau khi phần lõi FFmpeg này chạy ổn.
- Test kỹ trên thiết bị thật — video xử lý sai định dạng/codec là lỗi thường gặp nhất, không hiện ra khi chỉ đọc code.
