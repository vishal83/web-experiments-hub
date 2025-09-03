class WebCodecsTestSuite {
    constructor() {
        this.videoCodecs = [
            { name: 'H.264 (AVC)', codec: 'avc1.42E01E', container: 'mp4' },
            { name: 'H.264 High', codec: 'avc1.64001E', container: 'mp4' },
            { name: 'H.265 (HEVC)', codec: 'hev1.1.6.L93.B0', container: 'mp4' },
            { name: 'VP8', codec: 'vp8', container: 'webm' },
            { name: 'VP9', codec: 'vp09.00.10.08', container: 'webm' },
            { name: 'AV1', codec: 'av01.0.04M.08', container: 'mp4' }
        ];

        this.audioCodecs = [
            { name: 'AAC', codec: 'mp4a.40.2', container: 'mp4' },
            { name: 'AAC HE', codec: 'mp4a.40.5', container: 'mp4' },
            { name: 'Opus', codec: 'opus', container: 'webm' },
            { name: 'MP3', codec: 'mp3', container: 'mp3' },
            { name: 'FLAC', codec: 'flac', container: 'mp4' },
            { name: 'PCM', codec: 'pcm-s16', container: 'wav' }
        ];

        this.testResults = {
            video: {},
            audio: {},
            liveTests: {}
        };

        this.init();
    }

    init() {
        this.updateBrowserInfo();
        this.setupEventListeners();
        this.checkWebCodecsSupport();
    }

    updateBrowserInfo() {
        document.getElementById('user-agent').textContent = navigator.userAgent;
    }

    setupEventListeners() {
        document.getElementById('test-video-codecs').addEventListener('click', () => this.testVideoCodecs());
        document.getElementById('test-audio-codecs').addEventListener('click', () => this.testAudioCodecs());
        document.getElementById('test-video-encoding').addEventListener('click', () => this.testVideoEncoding());
        document.getElementById('test-audio-encoding').addEventListener('click', () => this.testAudioEncoding());
        document.getElementById('start-camera-test').addEventListener('click', () => this.startCameraTest());
        document.getElementById('start-microphone-test').addEventListener('click', () => this.startMicrophoneTest());
    }

    checkWebCodecsSupport() {
        const supportElement = document.getElementById('webcodecs-support');
        
        if ('VideoEncoder' in window && 'VideoDecoder' in window && 
            'AudioEncoder' in window && 'AudioDecoder' in window) {
            supportElement.textContent = 'Supported';
            supportElement.className = 'status supported';
            
            // Enable encoding test buttons
            document.getElementById('test-video-encoding').disabled = false;
            document.getElementById('test-audio-encoding').disabled = false;
        } else {
            supportElement.textContent = 'Not Supported';
            supportElement.className = 'status not-supported';
        }
    }

    async testVideoCodecs() {
        const resultsContainer = document.getElementById('video-results');
        resultsContainer.innerHTML = '';
        
        this.updateButton('test-video-codecs', 'Testing...', true);

        for (const codecInfo of this.videoCodecs) {
            await this.testVideoCodec(codecInfo, resultsContainer);
        }

        this.updateButton('test-video-codecs', 'Test Video Codecs', false);
        this.updateSummary();
    }

    async testVideoCodec(codecInfo, container) {
        const resultDiv = this.createResultDiv(codecInfo.name, 'testing');
        container.appendChild(resultDiv);

        try {
            // Test encoder support
            const encoderSupported = await this.testVideoEncoder(codecInfo.codec);
            
            // Test decoder support
            const decoderSupported = await this.testVideoDecoder(codecInfo.codec);
            
            const supported = encoderSupported && decoderSupported;
            
            this.testResults.video[codecInfo.name] = {
                supported,
                encoder: encoderSupported,
                decoder: decoderSupported,
                codec: codecInfo.codec,
                container: codecInfo.container
            };

            this.updateResultDiv(resultDiv, codecInfo.name, supported, {
                encoder: encoderSupported ? '✓' : '✗',
                decoder: decoderSupported ? '✓' : '✗',
                codec: codecInfo.codec
            });

        } catch (error) {
            this.testResults.video[codecInfo.name] = { 
                supported: false, 
                error: error.message,
                codec: codecInfo.codec 
            };
            
            this.updateResultDiv(resultDiv, codecInfo.name, false, {
                error: error.message.substring(0, 100)
            });
        }
    }

    async testVideoEncoder(codec) {
        return new Promise((resolve) => {
            try {
                VideoEncoder.isConfigSupported({
                    codec: codec,
                    width: 640,
                    height: 480,
                    bitrate: 1000000,
                    framerate: 30
                }).then(result => {
                    resolve(result.supported);
                }).catch(() => resolve(false));
            } catch (error) {
                resolve(false);
            }
        });
    }

    async testVideoDecoder(codec) {
        return new Promise((resolve) => {
            try {
                VideoDecoder.isConfigSupported({
                    codec: codec
                }).then(result => {
                    resolve(result.supported);
                }).catch(() => resolve(false));
            } catch (error) {
                resolve(false);
            }
        });
    }

    async testAudioCodecs() {
        const resultsContainer = document.getElementById('audio-results');
        resultsContainer.innerHTML = '';
        
        this.updateButton('test-audio-codecs', 'Testing...', true);

        for (const codecInfo of this.audioCodecs) {
            await this.testAudioCodec(codecInfo, resultsContainer);
        }

        this.updateButton('test-audio-codecs', 'Test Audio Codecs', false);
        this.updateSummary();
    }

    async testAudioCodec(codecInfo, container) {
        const resultDiv = this.createResultDiv(codecInfo.name, 'testing');
        container.appendChild(resultDiv);

        try {
            // Test encoder support
            const encoderSupported = await this.testAudioEncoder(codecInfo.codec);
            
            // Test decoder support  
            const decoderSupported = await this.testAudioDecoder(codecInfo.codec);
            
            const supported = encoderSupported && decoderSupported;
            
            this.testResults.audio[codecInfo.name] = {
                supported,
                encoder: encoderSupported,
                decoder: decoderSupported,
                codec: codecInfo.codec,
                container: codecInfo.container
            };

            this.updateResultDiv(resultDiv, codecInfo.name, supported, {
                encoder: encoderSupported ? '✓' : '✗',
                decoder: decoderSupported ? '✓' : '✗',
                codec: codecInfo.codec
            });

        } catch (error) {
            this.testResults.audio[codecInfo.name] = { 
                supported: false, 
                error: error.message,
                codec: codecInfo.codec 
            };
            
            this.updateResultDiv(resultDiv, codecInfo.name, false, {
                error: error.message.substring(0, 100)
            });
        }
    }

    async testAudioEncoder(codec) {
        return new Promise((resolve) => {
            try {
                const config = {
                    codec: codec,
                    sampleRate: 48000,
                    numberOfChannels: 2,
                    bitrate: 128000
                };

                // Handle special cases for different codecs
                if (codec === 'pcm-s16') {
                    delete config.bitrate;
                } else if (codec === 'mp3') {
                    config.codec = 'mp3';
                }

                AudioEncoder.isConfigSupported(config).then(result => {
                    resolve(result.supported);
                }).catch(() => resolve(false));
            } catch (error) {
                resolve(false);
            }
        });
    }

    async testAudioDecoder(codec) {
        return new Promise((resolve) => {
            try {
                const config = {
                    codec: codec,
                    sampleRate: 48000,
                    numberOfChannels: 2
                };

                // Handle special cases
                if (codec === 'mp3') {
                    config.codec = 'mp3';
                }

                AudioDecoder.isConfigSupported(config).then(result => {
                    resolve(result.supported);
                }).catch(() => resolve(false));
            } catch (error) {
                resolve(false);
            }
        });
    }

    createResultDiv(name, status) {
        const div = document.createElement('div');
        div.className = `codec-result ${status}`;
        div.innerHTML = `
            <h3>${name}</h3>
            <div class="status ${status}">${status}</div>
            <div class="details"></div>
        `;
        return div;
    }

    updateResultDiv(div, name, supported, details = {}) {
        const statusClass = supported ? 'supported' : 'not-supported';
        const statusText = supported ? 'Supported' : 'Not Supported';
        
        div.className = `codec-result ${statusClass}`;
        div.querySelector('.status').className = `status ${statusClass}`;
        div.querySelector('.status').textContent = statusText;
        
        let detailsHtml = '';
        Object.entries(details).forEach(([key, value]) => {
            detailsHtml += `<div><strong>${key}:</strong> ${value}</div>`;
        });
        
        div.querySelector('.details').innerHTML = detailsHtml;
    }

    updateButton(id, text, disabled) {
        const button = document.getElementById(id);
        button.textContent = text;
        button.disabled = disabled;
    }

    async testVideoEncoding() {
        this.updateButton('test-video-encoding', 'Testing...', true);
        
        try {
            // Find a supported video codec
            const supportedCodec = Object.entries(this.testResults.video)
                .find(([_, result]) => result.supported);
            
            if (!supportedCodec) {
                alert('No supported video codecs found. Run codec tests first.');
                return;
            }

            const codecInfo = this.videoCodecs.find(c => c.name === supportedCodec[0]);
            await this.performVideoEncodingTest(codecInfo.codec);
            
        } catch (error) {
            console.error('Video encoding test failed:', error);
            alert(`Video encoding test failed: ${error.message}`);
        } finally {
            this.updateButton('test-video-encoding', 'Test Video Encoding', false);
        }
    }

    async performVideoEncodingTest(codec) {
        return new Promise((resolve, reject) => {
            const canvas = document.getElementById('test-canvas');
            const ctx = canvas.getContext('2d');
            
            // Draw a test pattern
            this.drawTestPattern(ctx, canvas.width, canvas.height);
            
            let encoder = null;
            let frameCount = 0;
            const maxFrames = 30;
            
            const config = {
                codec: codec,
                width: canvas.width,
                height: canvas.height,
                bitrate: 1000000,
                framerate: 30
            };

            encoder = new VideoEncoder({
                output: (chunk) => {
                    console.log(`Encoded frame ${frameCount}, size: ${chunk.byteLength} bytes`);
                    document.getElementById('live-test-status').innerHTML = 
                        `✅ Successfully encoded frame ${frameCount} with ${codec}<br>Chunk size: ${chunk.byteLength} bytes`;
                    
                    if (frameCount >= maxFrames) {
                        encoder.close();
                        resolve();
                    }
                },
                error: (error) => {
                    console.error('Encoding error:', error);
                    reject(error);
                }
            });

            encoder.configure(config);

            // Generate and encode test frames
            const encodeFrame = () => {
                if (frameCount < maxFrames) {
                    // Update test pattern
                    this.drawTestPattern(ctx, canvas.width, canvas.height, frameCount);
                    
                    const frame = new VideoFrame(canvas, {
                        timestamp: frameCount * 33333 // ~30fps
                    });
                    
                    encoder.encode(frame);
                    frame.close();
                    frameCount++;
                    
                    setTimeout(encodeFrame, 33); // ~30fps
                } else {
                    encoder.close();
                    resolve();
                }
            };

            encodeFrame();
        });
    }

    async testAudioEncoding() {
        this.updateButton('test-audio-encoding', 'Testing...', true);
        
        try {
            // Find a supported audio codec
            const supportedCodec = Object.entries(this.testResults.audio)
                .find(([_, result]) => result.supported);
            
            if (!supportedCodec) {
                alert('No supported audio codecs found. Run codec tests first.');
                return;
            }

            const codecInfo = this.audioCodecs.find(c => c.name === supportedCodec[0]);
            await this.performAudioEncodingTest(codecInfo.codec);
            
        } catch (error) {
            console.error('Audio encoding test failed:', error);
            alert(`Audio encoding test failed: ${error.message}`);
        } finally {
            this.updateButton('test-audio-encoding', 'Test Audio Encoding', false);
        }
    }

    async performAudioEncodingTest(codec) {
        return new Promise((resolve, reject) => {
            let encoder = null;
            let sampleCount = 0;
            const sampleRate = 48000;
            const channels = 2;
            const duration = 1; // 1 second
            const totalSamples = sampleRate * duration;
            
            const config = {
                codec: codec,
                sampleRate: sampleRate,
                numberOfChannels: channels,
                bitrate: 128000
            };

            // Handle special codec configs
            if (codec === 'pcm-s16') {
                delete config.bitrate;
            }

            encoder = new AudioEncoder({
                output: (chunk) => {
                    console.log(`Encoded audio chunk, size: ${chunk.byteLength} bytes`);
                    document.getElementById('live-test-status').innerHTML = 
                        `✅ Successfully encoded audio with ${codec}<br>Chunk size: ${chunk.byteLength} bytes`;
                    encoder.close();
                    resolve();
                },
                error: (error) => {
                    console.error('Audio encoding error:', error);
                    reject(error);
                }
            });

            encoder.configure(config);

            // Generate test audio data (sine wave)
            const frameSize = 1024;
            const audioData = new Float32Array(frameSize * channels);
            
            for (let i = 0; i < frameSize; i++) {
                const sample = Math.sin(2 * Math.PI * 440 * (sampleCount + i) / sampleRate); // 440Hz tone
                audioData[i * channels] = sample; // Left channel
                audioData[i * channels + 1] = sample; // Right channel
            }

            const audioFrame = new AudioData({
                format: 'f32-planar',
                sampleRate: sampleRate,
                numberOfChannels: channels,
                numberOfFrames: frameSize,
                timestamp: 0,
                data: audioData
            });

            encoder.encode(audioFrame);
            audioFrame.close();
        });
    }

    async startCameraTest() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            
            const video = document.getElementById('source-video');
            video.srcObject = stream;
            video.style.display = 'block';
            
            document.getElementById('live-test-status').innerHTML = 
                '📹 Camera access granted. Video stream active.';
            
            // You can extend this to encode frames from the video stream
            
        } catch (error) {
            document.getElementById('live-test-status').innerHTML = 
                `❌ Camera access failed: ${error.message}`;
        }
    }

    async startMicrophoneTest() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { sampleRate: 48000, channelCount: 2 } 
            });
            
            document.getElementById('live-test-status').innerHTML = 
                '🎤 Microphone access granted. Audio stream active.';
            
            // You can extend this to capture and encode audio from the stream
            
        } catch (error) {
            document.getElementById('live-test-status').innerHTML = 
                `❌ Microphone access failed: ${error.message}`;
        }
    }

    drawTestPattern(ctx, width, height, frame = 0) {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        
        // Draw animated test pattern
        const time = frame * 0.1;
        
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, `hsl(${time * 10 % 360}, 50%, 50%)`);
        gradient.addColorStop(1, `hsl(${(time * 10 + 180) % 360}, 50%, 30%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Moving circles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 5; i++) {
            const x = (width / 2) + Math.sin(time + i) * 100;
            const y = (height / 2) + Math.cos(time + i) * 80;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Frame counter
        ctx.fillStyle = 'white';
        ctx.font = '20px monospace';
        ctx.fillText(`Frame: ${frame}`, 10, 30);
    }

    updateSummary() {
        const summary = document.getElementById('summary-results');
        
        const videoSupported = Object.values(this.testResults.video).filter(r => r.supported).length;
        const videoTotal = Object.keys(this.testResults.video).length;
        
        const audioSupported = Object.values(this.testResults.audio).filter(r => r.supported).length;
        const audioTotal = Object.keys(this.testResults.audio).length;
        
        let html = '<h3>Test Summary</h3>';
        
        if (videoTotal > 0) {
            html += `<p><strong>Video Codecs:</strong> ${videoSupported}/${videoTotal} supported</p>`;
            html += '<div class="supported-codecs">';
            Object.entries(this.testResults.video).forEach(([name, result]) => {
                if (result.supported) {
                    html += `<span class="codec-tag supported">✓ ${name}</span>`;
                }
            });
            html += '</div>';
        }
        
        if (audioTotal > 0) {
            html += `<p><strong>Audio Codecs:</strong> ${audioSupported}/${audioTotal} supported</p>`;
            html += '<div class="supported-codecs">';
            Object.entries(this.testResults.audio).forEach(([name, result]) => {
                if (result.supported) {
                    html += `<span class="codec-tag supported">✓ ${name}</span>`;
                }
            });
            html += '</div>';
        }
        
        // Add browser compatibility info
        html += `<p><strong>Browser:</strong> ${this.getBrowserInfo()}</p>`;
        html += `<p><strong>WebCodecs API:</strong> ${('VideoEncoder' in window) ? 'Available' : 'Not Available'}</p>`;
        
        summary.innerHTML = html;
        
        // Add CSS for codec tags
        if (!document.getElementById('codec-tag-styles')) {
            const style = document.createElement('style');
            style.id = 'codec-tag-styles';
            style.textContent = `
                .codec-tag {
                    display: inline-block;
                    padding: 4px 8px;
                    margin: 2px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .codec-tag.supported {
                    background: #28a745;
                    color: white;
                }
            `;
            document.head.appendChild(style);
        }
    }

    getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edg')) return 'Edge';
        return 'Unknown';
    }
}

// Initialize the test suite when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WebCodecsTestSuite();
});
