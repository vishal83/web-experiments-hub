# 🧪 Web Experiments Hub

A collection of modern web technology experiments and testing suites, featuring cutting-edge APIs and real-world implementations across different browsers and devices.

## 🎬 Featured: WebCodecs Test Suite

A comprehensive testing suite for WebCodecs API support across different browsers and devices. Test video and audio codec encoding/decoding capabilities in real-time.

## 🚀 Features

- **Comprehensive Codec Testing**: Test support for H.264, H.265, VP8, VP9, AV1, AAC, Opus, MP3, FLAC, and more
- **Real-time Encoding Tests**: Live video and audio encoding with performance metrics
- **Cross-device Testing**: Serve over network to test multiple devices simultaneously  
- **Browser Compatibility**: Works across Chrome, Firefox, Safari, and Edge
- **Mobile Support**: Test codec support on iOS and Android devices
- **Live Camera/Microphone Integration**: Test encoding from real media sources

## 📋 Supported Codecs

### Video Codecs
- **H.264 (AVC)** - Baseline and High profiles
- **H.265 (HEVC)** - High Efficiency Video Coding
- **VP8** - Google's open video codec
- **VP9** - Successor to VP8
- **AV1** - Next-generation open codec

### Audio Codecs  
- **AAC** - Advanced Audio Coding (standard and HE)
- **Opus** - Modern low-latency codec
- **MP3** - Legacy MPEG audio
- **FLAC** - Lossless audio compression
- **PCM** - Uncompressed audio

## 🏠 Hub Structure

- **`index.html`** - Main landing page with experiment directory
- **`webcodecs-test.html`** - WebCodecs API testing suite
- **Future experiments** - More cutting-edge web API tests coming soon

## 🖥️ Quick Start

### Option 1: Node.js Server (Recommended)

```bash
# Start the server
npm start
# or
node server.js
```

### Option 2: Python Server

```bash
# Start the Python server  
python3 server.py
```

### Option 3: Custom Port

```bash
# Node.js with custom port
PORT=8080 npm start

# Python with custom port
PORT=8080 python3 server.py
```

## 🌐 Access the Tests

After starting the server:

- **Local**: http://localhost:8000
- **Network**: Check console output for your device's IP address
- **Mobile**: Use the network IP to test on phones/tablets

## 🧪 Available Tests

### 1. Codec Support Detection
- Tests `VideoEncoder.isConfigSupported()` and `VideoDecoder.isConfigSupported()`
- Tests `AudioEncoder.isConfigSupported()` and `AudioDecoder.isConfigSupported()`  
- Displays detailed support matrix for each codec

### 2. Live Encoding Tests
- **Video Encoding**: Generates test patterns and encodes them in real-time
- **Audio Encoding**: Creates sine wave audio and encodes to various formats
- Performance metrics and chunk size reporting

### 3. Camera/Microphone Tests  
- **Camera → WebCodecs**: Capture video from camera and prepare for encoding
- **Microphone → WebCodecs**: Capture audio from microphone for real-time processing
- Requires HTTPS for remote device access

## 🔧 Configuration

### Environment Variables

```bash
PORT=8000        # Server port (default: 8000)
HOST=0.0.0.0     # Server host (default: 0.0.0.0)
```

### HTTPS Setup (for remote device testing)

For full WebCodecs functionality on remote devices, serve over HTTPS:

```bash
# Using a reverse proxy like ngrok
npx ngrok http 8000

# Or use a self-signed certificate with Node.js
# (requires additional HTTPS server setup)
```

## 📊 Understanding Results

### Support Status
- **✅ Supported**: Codec is fully supported for encoding and decoding
- **❌ Not Supported**: Codec is not supported or failed configuration test
- **🔶 Testing**: Currently running codec capability tests

### Live Test Results
- **Chunk Size**: Size of encoded data chunks in bytes
- **Frame Count**: Number of successfully encoded video frames
- **Encoding Stats**: Real-time performance metrics during encoding

## 🌍 Cross-Browser Testing

### Recommended Testing Matrix

| Browser | Platform | Expected Support |
|---------|----------|------------------|
| Chrome 94+ | Desktop/Mobile | Full WebCodecs support |
| Firefox 100+ | Desktop/Mobile | Limited WebCodecs support |
| Safari 16+ | macOS/iOS | Partial WebCodecs support |
| Edge 94+ | Desktop | Full WebCodecs support |

### Known Limitations

- **Firefox**: Limited WebCodecs support, may not support all codecs
- **Safari**: Partial implementation, some codecs may not be available
- **Mobile Safari**: Requires HTTPS for getUserMedia() access
- **Older Browsers**: WebCodecs API not available (pre-2022 versions)

## 🔍 Troubleshooting

### Common Issues

1. **"WebCodecs not supported"**
   - Update to a modern browser (Chrome 94+, Edge 94+)
   - WebCodecs is not yet widely supported

2. **Camera/Microphone access denied**
   - Grant permissions when prompted
   - Use HTTPS for remote device access
   - Check browser security settings

3. **Codec tests failing**
   - Some codecs may require specific browser flags
   - Check browser's codec support documentation
   - Update graphics drivers (affects hardware encoding)

4. **Network access issues**
   - Ensure firewall allows connections on the chosen port
   - Use the correct IP address (check console output)
   - Some networks may block custom ports

## 📱 Mobile Testing

For comprehensive mobile testing:

1. Start the server on your development machine
2. Connect mobile device to same network  
3. Access via the network IP address shown in console
4. Grant camera/microphone permissions when prompted
5. Use HTTPS for full functionality (via ngrok or similar)

## 🔧 Development

### File Structure
```
webroot/
├── index.html          # Main experiments hub landing page
├── webcodecs-test.html # WebCodecs API testing interface
├── styles.css          # UI styling (shared across experiments)
├── webcodecs-test.js   # WebCodecs test logic and integration
├── server.js           # Node.js HTTP server
├── server.py           # Python HTTP server
├── package.json        # Node.js dependencies
└── README.md           # This documentation
```

### Extending Tests

To add new codec tests:

1. Add codec configuration to `videoCodecs` or `audioCodecs` arrays in `webcodecs-test.js`
2. Specify the correct codec string and container format
3. Test will automatically be included in the test suite

## 📄 License

MIT License - Feel free to use and modify for your testing needs.

## 🤝 Contributing

This is a testing utility. Feel free to extend it with additional codecs, test patterns, or browser compatibility checks based on your testing requirements.

---

**Happy Testing! 🎬🎵**

Test your WebCodecs implementation across different browsers and devices to ensure broad compatibility.
