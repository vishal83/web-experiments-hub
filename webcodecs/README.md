# 🎬 WebCodecs API Test Suite

A comprehensive testing platform for WebCodecs API support across different browsers and devices. Test video and audio codec encoding/decoding capabilities in real-time.

## 🎯 Overview

This experiment provides a complete testing environment for the WebCodecs API, allowing developers to:
- **Validate codec support** across different browsers
- **Test real-time encoding** from camera and microphone sources
- **Measure performance metrics** for encoding operations
- **Verify encode→decode pipelines** with roundtrip testing

## 📋 Supported Codecs

### Video Codecs
- **H.264 (AVC)** - Baseline and High profiles (`avc1.42E01E`, `avc1.64001E`)
- **H.265 (HEVC)** - High Efficiency Video Coding (`hev1.1.6.L93.B0`)
- **VP8** - Google's open video codec (`vp8`)
- **VP9** - VP8 successor (`vp09.00.10.08`)
- **AV1** - Next-generation open codec (`av01.0.04M.08`)

### Audio Codecs  
- **AAC** - Advanced Audio Coding (`mp4a.40.2`, `mp4a.40.5`)
- **Opus** - Modern low-latency codec (`opus`)
- **MP3** - Legacy MPEG audio (`mp3`)
- **FLAC** - Lossless audio compression (`flac`)
- **PCM** - Uncompressed audio (`pcm-s16`)

## 🧪 Available Tests

### 1. Codec Support Detection
- Tests `VideoEncoder.isConfigSupported()` and `VideoDecoder.isConfigSupported()`
- Tests `AudioEncoder.isConfigSupported()` and `AudioDecoder.isConfigSupported()`  
- Displays detailed support matrix for each codec with encoder/decoder status

### 2. Roundtrip Testing
- **Video Roundtrip**: Encode test patterns → Decode → Validate frames
- **Audio Roundtrip**: Encode sine wave audio → Decode → Verify sample data
- Complete pipeline validation with performance metrics

### 3. Live Encoding Tests
- **Video Encoding**: Real-time camera stream encoding with performance stats
- **Audio Encoding**: Live microphone stream encoding with bitrate monitoring
- **Performance Metrics**: FPS, bitrate, chunk sizes, encoding efficiency

### 4. Camera/Microphone Integration
- **MediaStreamTrackProcessor**: Modern streaming approach (Chrome 94+)
- **Canvas Fallback**: Web Audio API fallback for broader compatibility
- **Live Statistics**: Real-time encoding performance and data rates

## 📊 Understanding Results

### Support Status Indicators
- **✅ Supported**: Codec fully supports both encoding and decoding
- **❌ Not Supported**: Codec not available or configuration failed
- **🔶 Testing**: Currently running codec capability tests

### Performance Metrics
- **Encoding FPS**: Frames encoded per second
- **Bitrate**: Data rate in kilobits per second  
- **Chunk Size**: Size of encoded data chunks in bytes
- **Frame Count**: Total number of successfully encoded frames
- **Total Data**: Cumulative encoded data size

### Error Classification
The test suite provides detailed error analysis:
- **Hardware/Driver Issues**: GPU or system driver problems
- **Codec Not Supported**: Browser lacks codec implementation
- **Configuration Errors**: Invalid bitrate, resolution, or codec parameters
- **Resource Limitations**: Memory or processing quota exceeded
- **Permission Errors**: Camera/microphone access denied
- **API Availability**: WebCodecs API not supported in browser

## 🌐 Browser Compatibility

| Browser | Version | Support Level | Notes |
|---------|---------|---------------|-------|
| **Chrome** | 94+ | ✅ Full | Complete WebCodecs implementation |
| **Edge** | 94+ | ✅ Full | Based on Chromium engine |
| **Firefox** | 100+ | ⚠️ Limited | Basic codecs only, experimental |
| **Safari** | 16+ | ⚠️ Partial | Some codecs missing |
| **Mobile Chrome** | 94+ | ✅ Full | Requires HTTPS for camera access |
| **Mobile Safari** | 16+ | ⚠️ Limited | HTTPS required, partial support |

### Known Limitations
- **Firefox**: Limited WebCodecs support, may not support hardware codecs
- **Safari**: Partial implementation, HEVC and some codecs unavailable
- **Mobile Browsers**: Camera/microphone access requires HTTPS context
- **Older Browsers**: WebCodecs API unavailable (pre-2022 versions)

## 🔧 Technical Implementation

### Key Features
- **MediaStreamTrackProcessor**: Direct video frame processing (Chrome 94+)
- **Web Audio API**: Audio stream processing with ScriptProcessor fallback
- **Hardware Detection**: Automatic hardware vs software encoding detection
- **Error Handling**: Comprehensive error classification and user feedback
- **Resource Management**: Proper cleanup of encoders, decoders, and streams

### Performance Optimizations
- **Frame Rate Control**: Configurable encoding frame rates (default: 30fps)
- **Bitrate Management**: Dynamic bitrate adjustment based on codec capabilities
- **Memory Management**: Proper VideoFrame and AudioData lifecycle management
- **Async Processing**: Non-blocking encoding with async/await patterns

## 🚀 Usage Instructions

### 1. Basic Testing
1. Open the WebCodecs test suite
2. Click "Test Video Codecs" to check codec support
3. Click "Test Audio Codecs" for audio codec validation
4. Review the support matrix results

### 2. Live Encoding Tests  
1. Run codec detection first to identify supported codecs
2. Click "Test Video Encoding" for synthetic pattern encoding
3. Click "Test Audio Encoding" for generated audio encoding
4. Monitor real-time performance metrics

### 3. Camera/Microphone Testing
1. Ensure codec tests show supported codecs
2. Click "Test Camera → WebCodecs" (grant camera permission)
3. Click "Test Microphone → WebCodecs" (grant microphone permission)  
4. Watch live encoding statistics and performance data

### 4. Roundtrip Validation
1. Complete codec detection tests first
2. Click "Test Video Roundtrip" for encode→decode testing
3. Click "Test Audio Roundtrip" for audio pipeline validation
4. Verify successful roundtrip completion

## 🔍 Troubleshooting

### Common Issues

**"WebCodecs not supported"**
- Update to Chrome 94+, Edge 94+, or latest Firefox/Safari
- WebCodecs is a recent API with limited browser support

**Camera/Microphone access denied**
- Grant permissions when browser prompts
- Use HTTPS for remote device testing (`npx ngrok http 8000`)
- Check browser security settings and site permissions

**Codec tests failing**
- Update graphics drivers (affects hardware encoding)
- Try different codec configurations or bitrates
- Some codecs require specific browser flags or settings

**Network testing issues**
- Ensure firewall allows connections on server port
- Use correct IP address shown in server console output
- Some corporate networks may block custom ports

## 📱 Mobile Testing

For comprehensive mobile device testing:

1. **Start server**: `node server.js` on your development machine
2. **Connect devices**: Ensure mobile device on same network
3. **Use HTTPS**: `npx ngrok http 8000` for secure context
4. **Access hub**: Navigate to ngrok HTTPS URL on mobile device
5. **Grant permissions**: Allow camera/microphone access when prompted
6. **Test codecs**: Mobile browsers may have different codec support

## 🛠️ Extending the Test Suite

### Adding New Codecs
Edit `webcodecs-test.js` to add codec configurations:

```javascript
// Add to videoCodecs array
{ name: 'New Video Codec', codec: 'codec-string', container: 'format' }

// Add to audioCodecs array  
{ name: 'New Audio Codec', codec: 'codec-string', container: 'format' }
```

### Customizing Tests
- **Frame rates**: Modify `framerate` in encoder configurations
- **Bitrates**: Adjust `bitrate` values for different quality tests
- **Test patterns**: Customize `drawTestPattern()` for different visuals
- **Audio generation**: Modify sine wave generation for different test tones

---

**🔗 Back to Hub**: [← Return to Web Experiments Hub](../index.html)

**📚 More Info**: Visit the [main repository](https://github.com/vishal83/web-experiments-hub) for additional experiments and documentation.
