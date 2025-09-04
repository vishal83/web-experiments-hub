# 🧪 Web Experiments Hub

A professional platform for testing modern web technologies and APIs across different browsers and devices. This hub provides a centralized location for experimenting with cutting-edge web standards and documenting browser compatibility.

## 🌐 **Live Demo**

**🚀 Try it now:** [https://vishal83.github.io/web-experiments-hub/](https://vishal83.github.io/web-experiments-hub/)

No installation required! Access the complete Web Experiments Hub directly from your browser with HTTPS support for all advanced web APIs.

## 🎯 Purpose

This repository serves as a **testing laboratory** for modern web APIs, allowing developers to:
- **Validate browser support** for new web technologies
- **Test cross-platform compatibility** across devices  
- **Document real-world performance** of web APIs
- **Showcase implementation examples** for emerging standards
- **Provide ready-to-use testing tools** for the web development community

## 🏗️ Hub Architecture

The hub uses a **modular experiment structure** where each web technology gets its own dedicated folder with complete testing suites:

```
📁 Web Experiments Hub
├── 🏠 Landing Page (index.html)
├── 🎬 webcodecs/ - WebCodecs API Testing
├── 🧠 sharedarraybuffer/ - SharedArrayBuffer API Testing
├── 🌐 webrtc/ - WebRTC Testing (planned)
├── 🎮 webgpu/ - WebGPU Testing (planned)
├── 📡 web-serial/ - Web Serial API Testing (planned)
└── 🔊 web-audio/ - Web Audio API Testing (planned)
```

## ⚡ Hub Features

- 🧪 **Modular Experiments**: Each web API gets its own dedicated testing environment
- 🌐 **Cross-Browser Testing**: Comprehensive compatibility testing across all major browsers
- 📱 **Multi-Device Support**: Test on desktop, mobile, and tablet devices over network
- 🎨 **Professional UI**: Clean, corporate-ready interface with consistent design
- 📊 **Real-Time Metrics**: Live performance monitoring and statistics
- 🔒 **Secure Serving**: HTTPS support for advanced API features
- 📚 **Complete Documentation**: Detailed setup and usage instructions
- 🚀 **Easy Deployment**: Multiple server options (Node.js, Python)

## 🎬 Current Experiments

### WebCodecs API Testing Suite ✅ **Production Ready**

The **flagship experiment** - a comprehensive WebCodecs API testing platform.

**🎯 What it Tests:**
- **Video Codecs**: H.264, H.265, VP8, VP9, AV1 support detection
- **Audio Codecs**: AAC, Opus, MP3, FLAC, PCM compatibility testing  
- **Live Encoding**: Real-time camera and microphone encoding
- **Performance**: Encoding speed, bitrate, and efficiency metrics
- **Roundtrip Testing**: Complete encode → decode → validate pipelines

**🌟 Key Features:**
- Real-time camera/microphone encoding with live stats
- Cross-browser codec support matrix
- Hardware vs software encoding detection
- Professional error classification and debugging
- Mobile device testing over HTTPS

**📍 Access:** `/webcodecs/` | **Status:** ✅ Fully Functional

---

### SharedArrayBuffer API Testing Suite ✅ **Production Ready**

A **comprehensive platform** for testing SharedArrayBuffer support and cross-origin isolation requirements.

**🎯 What it Tests:**
- **SharedArrayBuffer API**: Availability detection and basic operations
- **Security Requirements**: HTTPS, COOP, COEP headers validation
- **Cross-Origin Isolation**: Cross-origin isolation status and requirements
- **Web Worker Communication**: Memory sharing between main thread and workers
- **Atomics Operations**: Thread-safe memory operations testing
- **Performance Comparison**: SharedArrayBuffer vs ArrayBuffer benchmarks

**🌟 Key Features:**
- Real-time security requirements validation
- Interactive worker communication testing
- Performance benchmarking with detailed metrics
- Memory usage monitoring and analysis
- Cross-browser compatibility detection

**📍 Access:** `/sharedarraybuffer/` | **Status:** ✅ Fully Functional

---

## 🔮 Planned Experiments

### 🌐 WebRTC Data Channels
- P2P communication testing
- File transfer capabilities
- Network configuration validation
- **Status:** 📋 Planning Phase

### 🎮 WebGPU Compute Shaders  
- GPU computing performance tests
- Parallel processing benchmarks
- Cross-device GPU compatibility
- **Status:** 📋 Planning Phase

### 📡 Web Serial & USB APIs
- Hardware device communication
- Arduino/IoT integration testing
- Serial protocol validation
- **Status:** 📋 Planning Phase

### 🔊 Web Audio Worklets
- Advanced audio processing
- Real-time effects and synthesis
- Audio context performance testing
- **Status:** 📋 Planning Phase

## 📂 Repository Structure

```
web-experiments-hub/
├── 🏠 index.html              # Main hub landing page
├── 🎨 styles.css              # Shared UI styles across experiments
├── 🚀 server.js               # Node.js HTTP server
├── 🐍 server.py               # Python HTTP server alternative
├── 📦 package.json            # Node.js dependencies
├── 🎬 webcodecs/              # WebCodecs experiment (✅ Complete)
│   ├── index.html             # WebCodecs test interface
│   └── webcodecs-test.js      # WebCodecs implementation
├── 🧠 sharedarraybuffer/      # SharedArrayBuffer experiment (✅ Complete)
│   ├── index.html             # SharedArrayBuffer test interface
│   └── sharedarraybuffer-test.js  # SharedArrayBuffer implementation
├── 🌐 webrtc/                 # WebRTC experiments (📋 Planned)
├── 🎮 webgpu/                 # WebGPU experiments (📋 Planned)
├── 📡 web-serial/             # Web Serial experiments (📋 Planned)
├── 🔊 web-audio/              # Web Audio experiments (📋 Planned)
└── 📚 README.md               # This documentation
```

## 🚀 Quick Start

### 1️⃣ Clone & Start
```bash
# Clone the repository
git clone https://github.com/vishal83/web-experiments-hub.git
cd web-experiments-hub

# Start with Node.js (recommended)
node server.js

# Or start with Python
python3 server.py

# Custom port
PORT=8080 node server.js
```

### 2️⃣ Access the Hub
```
🏠 Main Hub:            http://localhost:8000
🎬 WebCodecs Test:      http://localhost:8000/webcodecs/
🧠 SharedArrayBuffer:   http://localhost:8000/sharedarraybuffer/
📱 Mobile Testing:      http://[your-ip]:8000 (check console output)
```

### 3️⃣ For Remote Device Testing
```bash
# Enable HTTPS for full functionality on mobile devices
npx ngrok http 8000
```

## 🎯 How to Use

1. **🏠 Start at the Hub**: Visit `http://localhost:8000` to see all available experiments
2. **🎬 Choose an Experiment**: Click on any experiment card to launch it
3. **📊 Run Tests**: Follow the experiment-specific instructions
4. **📱 Test Cross-Device**: Use network IP for mobile/tablet testing
5. **🔒 Use HTTPS**: For advanced features requiring secure contexts

## 🛠️ Development

### Adding New Experiments

The hub is designed for easy expansion. To add a new experiment:

```bash
# 1. Create experiment directory
mkdir web-new-api/

# 2. Create experiment files
cd web-new-api/
touch index.html          # Main experiment interface
touch experiment.js       # Experiment logic
```

```javascript
// 3. Update main index.html to add experiment card
<div class="experiment-card">
    <h3>🆕 New Web API Test</h3>
    <div class="description">Description of your experiment...</div>
    <div class="tags">
        <span class="tag">New API</span>
        <span class="tag">Testing</span>
    </div>
    <a href="web-new-api/" class="experiment-link">Launch Test</a>
</div>
```

### Experiment Template Structure

Each experiment should follow this structure:
```
web-api-name/
├── index.html           # Main experiment page
├── experiment.js        # Core experiment logic  
├── assets/             # Experiment-specific assets (optional)
└── README.md           # Experiment documentation (optional)
```

### Shared Resources

- **Styling**: Use `../styles.css` for consistent hub appearance
- **Navigation**: Include breadcrumb: `<a href="../index.html">← Back to Hub</a>`
- **Server**: No changes needed - server auto-handles new directories

## ⚙️ Configuration

### Environment Variables
```bash
PORT=8000        # Server port (default: 8000)
HOST=0.0.0.0     # Server host (default: 0.0.0.0)
```

### HTTPS Setup
```bash
# For advanced API features requiring secure contexts
npx ngrok http 8000
```

## 🌐 Browser Compatibility

The hub itself works on all modern browsers. Individual experiments may have specific requirements:

| Experiment | Chrome | Firefox | Safari | Edge |
|------------|--------|---------|--------|------|
| Hub Interface | ✅ | ✅ | ✅ | ✅ |
| WebCodecs | ✅ 94+ | ⚠️ Limited | ⚠️ Partial | ✅ 94+ |
| Future APIs | 📋 TBD | 📋 TBD | 📋 TBD | 📋 TBD |

## 🤝 Contributing

We welcome contributions to expand the Web Experiments Hub! Here's how you can help:

### 🆕 Adding New Experiments
1. **Fork the repository**
2. **Create your experiment** following the template structure
3. **Test across browsers** to ensure compatibility
4. **Submit a pull request** with your new experiment

### 🐛 Reporting Issues
- **Browser compatibility issues**
- **Performance problems** 
- **Feature requests** for new experiments
- **Documentation improvements**

### 💡 Experiment Ideas
- WebAssembly performance testing
- Service Worker capabilities
- IndexedDB storage limits
- Canvas/WebGL performance
- Geolocation accuracy testing

## 🎯 Use Cases

This hub is perfect for:
- **🏢 Enterprise teams** validating web API support
- **👨‍💻 Web developers** testing browser compatibility
- **🎓 Students** learning modern web technologies
- **🔬 Researchers** studying web API performance
- **📝 Technical writers** documenting browser support

## 🚀 Deployment

### Local Development
```bash
git clone https://github.com/vishal83/web-experiments-hub.git
cd web-experiments-hub
node server.js
```

### Production Deployment
The hub can be deployed to any static hosting service:
- **GitHub Pages**: For static hosting
- **Vercel/Netlify**: For serverless deployment  
- **Docker**: Container-based deployment
- **Traditional Servers**: Node.js or Python hosting

## 📄 License

MIT License - Feel free to use and modify for your testing needs.

---

## 🌟 About

Created as a comprehensive platform for testing modern web APIs across different browsers and devices. The hub demonstrates real-world implementations and provides valuable compatibility insights for the web development community.

**🔗 Repository**: https://github.com/vishal83/web-experiments-hub  
**🌐 Live Demo**: https://vishal83.github.io/web-experiments-hub/  
**👨‍💻 Author**: Vishal Gupta ([@vishal83](https://github.com/vishal83))  
**🎯 Purpose**: Advancing web technology adoption through comprehensive testing

---

**Happy Experimenting! 🧪✨**
