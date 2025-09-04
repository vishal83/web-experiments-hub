# SharedArrayBuffer API Test Suite

A comprehensive testing platform for SharedArrayBuffer support and cross-origin isolation requirements in modern browsers.

## 🎯 What This Tests

### Core SharedArrayBuffer Functionality
- **Basic API Detection**: Checks if `SharedArrayBuffer` constructor is available
- **Memory Operations**: Tests creation, reading, and writing to shared memory
- **Typed Array Views**: Validates `Int32Array`, `Uint8Array`, and other views
- **Data Integrity**: Ensures read/write operations maintain data consistency

### Security Requirements
- **HTTPS Detection**: Verifies secure context requirements
- **Cross-Origin-Opener-Policy (COOP)**: Checks for `same-origin` policy
- **Cross-Origin-Embedder-Policy (COEP)**: Validates `require-corp` header
- **Cross-Origin Isolation**: Tests `window.crossOriginIsolated` status

### Advanced Features
- **Atomics Operations**: Tests `Atomics.store()`, `Atomics.load()`, `Atomics.exchange()`, `Atomics.compareExchange()`
- **Web Worker Communication**: Real-time memory sharing between main thread and workers
- **Performance Benchmarking**: Compares SharedArrayBuffer vs ArrayBuffer performance
- **Memory Monitoring**: Displays heap usage and device memory information

## 🌟 Key Features

### Real-Time Security Validation
- ✅/❌ status indicators for each security requirement
- Detailed explanations for missing requirements
- Step-by-step guidance for enabling SharedArrayBuffer

### Interactive Testing
- **Basic Tests**: Validate core SharedArrayBuffer functionality
- **Worker Tests**: Demonstrate thread-safe memory sharing
- **Performance Tests**: Benchmark atomic vs non-atomic operations

### Comprehensive Reporting
- Browser detection and version information
- Memory usage statistics
- Individual component support status
- Troubleshooting recommendations

## 📋 Available Tests

### 1. Basic Functionality Test
Tests core SharedArrayBuffer operations:
- Memory allocation and initialization
- Typed array view creation
- Data read/write operations
- Memory integrity validation

### 2. Worker Communication Test
Demonstrates real-time memory sharing:
- Creates a Web Worker with inline script
- Shares SharedArrayBuffer between threads
- Performs atomic operations from worker
- Validates data consistency across threads

### 3. Performance Comparison Test
Benchmarks different approaches:
- ArrayBuffer operations (baseline)
- SharedArrayBuffer with Atomics (thread-safe)
- SharedArrayBuffer without Atomics (regular ops)
- Calculates atomic operation overhead

## 🔒 Security Requirements

SharedArrayBuffer requires strict security measures due to Spectre/Meltdown mitigations:

### Required Headers
```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

### HTTPS Requirement
SharedArrayBuffer only works in secure contexts (HTTPS or localhost).

### Cross-Origin Isolation
The page must be cross-origin isolated (`window.crossOriginIsolated === true`).

## 🌐 Browser Compatibility

### Full Support
- **Chrome 68+**: Full SharedArrayBuffer and Atomics support
- **Firefox 79+**: Complete implementation with security headers
- **Safari 15.2+**: SharedArrayBuffer available with proper headers

### Partial/No Support
- **Safari < 15.2**: Limited or no SharedArrayBuffer support
- **Mobile browsers**: Varies by version and platform
- **Older browsers**: SharedArrayBuffer disabled or unavailable

## 🚨 Troubleshooting

### "SharedArrayBuffer is not defined"
1. **Check HTTPS**: Ensure you're using HTTPS (or localhost)
2. **Verify Headers**: Confirm COOP and COEP headers are present
3. **Browser Version**: Update to a supported browser version

### "crossOriginIsolated is false"
1. **Server Headers**: Add required COOP and COEP headers
2. **Embedded Content**: Ensure all resources have proper CORP headers
3. **Third-party Scripts**: Remove or fix cross-origin scripts

### Worker Communication Fails
1. **Security Context**: Verify all security requirements are met
2. **Browser Support**: Check if browser supports Web Workers with SharedArrayBuffer
3. **Thread Safety**: Ensure proper use of Atomics for shared data

## 📱 Mobile Testing

SharedArrayBuffer on mobile devices requires special consideration:
- **iOS Safari**: Requires iOS 15.2+ and proper headers
- **Android Chrome**: Generally supports SharedArrayBuffer with headers
- **Mobile Networks**: HTTPS required for testing over network

## 🔧 Configuration

This test suite automatically detects and validates:
- Browser capabilities
- Security context
- Header presence
- Cross-origin isolation status

No manual configuration required - just ensure proper server headers are set.

## 📊 Understanding Results

### Status Indicators
- 🟢 **Green**: Feature fully supported and available
- 🟡 **Yellow**: Partial support or missing requirements
- 🔴 **Red**: Feature not supported or blocked

### Performance Metrics
- **Regular Operations**: Baseline performance without atomics
- **Atomic Operations**: Thread-safe operations (typically 10-30% slower)
- **Memory Overhead**: SharedArrayBuffer vs ArrayBuffer allocation costs

## 🛡️ Security Implications

SharedArrayBuffer enables:
- **High-precision timers** (potential security risk)
- **Cross-thread memory sharing** (requires proper synchronization)
- **Performance optimizations** (parallel processing capabilities)

Always use proper Atomics operations when sharing data between threads to avoid race conditions and data corruption.
