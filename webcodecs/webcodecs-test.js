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
        document.getElementById('test-video-roundtrip').addEventListener('click', () => this.testVideoRoundtrip());
        document.getElementById('test-audio-roundtrip').addEventListener('click', () => this.testAudioRoundtrip());
        document.getElementById('start-camera-test').addEventListener('click', () => this.startCameraTest());
        document.getElementById('start-microphone-test').addEventListener('click', () => this.startMicrophoneTest());
    }

    checkWebCodecsSupport() {
        const supportElement = document.getElementById('webcodecs-support');
        const videoEncoderElement = document.getElementById('video-encoder-support');
        const videoDecoderElement = document.getElementById('video-decoder-support');
        const audioEncoderElement = document.getElementById('audio-encoder-support');
        const audioDecoderElement = document.getElementById('audio-decoder-support');
        
        // Check individual component support
        const videoEncoderSupported = 'VideoEncoder' in window;
        const videoDecoderSupported = 'VideoDecoder' in window;
        const audioEncoderSupported = 'AudioEncoder' in window;
        const audioDecoderSupported = 'AudioDecoder' in window;
        
        // Update individual status indicators
        this.updateSupportStatus(videoEncoderElement, videoEncoderSupported);
        this.updateSupportStatus(videoDecoderElement, videoDecoderSupported);
        this.updateSupportStatus(audioEncoderElement, audioEncoderSupported);
        this.updateSupportStatus(audioDecoderElement, audioDecoderSupported);
        
        // Determine overall support
        const fullSupport = videoEncoderSupported && videoDecoderSupported && 
                           audioEncoderSupported && audioDecoderSupported;
        const partialSupport = videoEncoderSupported || videoDecoderSupported || 
                             audioEncoderSupported || audioDecoderSupported;
        
        // Update overall support status
        if (fullSupport) {
            supportElement.textContent = 'Fully Supported';
            supportElement.className = 'status supported';
            
            // Enable all test buttons for full support
            document.getElementById('test-video-encoding').disabled = false;
            document.getElementById('test-audio-encoding').disabled = false;
            document.getElementById('test-video-roundtrip').disabled = false;
            document.getElementById('test-audio-roundtrip').disabled = false;
            
        } else if (partialSupport) {
            supportElement.textContent = 'Partially Supported';
            supportElement.className = 'status partial';
            
            // Enable buttons based on what's available
            document.getElementById('test-video-encoding').disabled = !videoEncoderSupported;
            document.getElementById('test-audio-encoding').disabled = !audioEncoderSupported;
            document.getElementById('test-video-roundtrip').disabled = !(videoEncoderSupported && videoDecoderSupported);
            document.getElementById('test-audio-roundtrip').disabled = !(audioEncoderSupported && audioDecoderSupported);
            
        } else {
            supportElement.textContent = 'Not Supported';
            supportElement.className = 'status not-supported';
            
            // Keep all buttons disabled
        }
        
        // Store support status for other functions to use
        this.supportStatus = {
            videoEncoder: videoEncoderSupported,
            videoDecoder: videoDecoderSupported,
            audioEncoder: audioEncoderSupported,
            audioDecoder: audioDecoderSupported,
            fullSupport: fullSupport,
            partialSupport: partialSupport
        };
    }

    updateSupportStatus(element, isSupported) {
        if (isSupported) {
            element.textContent = 'Available';
            element.className = 'status supported';
        } else {
            element.textContent = 'Not Available';
            element.className = 'status not-supported';
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
            const errorType = this.classifyWebCodecsError(error);
            this.testResults.video[codecInfo.name] = { 
                supported: false, 
                error: error.message,
                errorType: errorType,
                codec: codecInfo.codec 
            };
            
            this.updateResultDiv(resultDiv, codecInfo.name, false, {
                error: error.message.substring(0, 100),
                errorType: errorType
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
                format: 'f32',  // Fixed: Use interleaved format for interleaved data
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
            // Check if VideoEncoder is available
            if (!this.supportStatus || !this.supportStatus.videoEncoder) {
                document.getElementById('live-test-status').innerHTML = 
                    '❌ VideoEncoder not available in this browser.';
                return;
            }
            
            // Find a supported video codec
            const supportedCodec = Object.entries(this.testResults.video)
                .find(([_, result]) => result.supported && result.encoder);
            
            if (!supportedCodec) {
                document.getElementById('live-test-status').innerHTML = 
                    '❌ No supported video codecs found. Run codec tests first.';
                return;
            }

            const codecInfo = this.videoCodecs.find(c => c.name === supportedCodec[0]);
            
            // Get camera access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 }, 
                    height: { ideal: 480 },
                    frameRate: { ideal: 30 }
                } 
            });
            
            const video = document.getElementById('source-video');
            video.srcObject = stream;
            video.style.display = 'block';
            await video.play();
            
            document.getElementById('live-test-status').innerHTML = 
                `📹 Camera active, starting encoding with ${codecInfo.name}...`;

            // Start the encoding pipeline
            await this.encodeCameraStream(stream, codecInfo.codec, codecInfo.name);
            
        } catch (error) {
            console.error('Camera test error:', error);
            document.getElementById('live-test-status').innerHTML = 
                `❌ Camera test failed: ${error.message}`;
        }
    }

    async encodeCameraStream(stream, codec, codecName) {
        let encoder = null;
        let processor = null;
        let reader = null;
        let frameCount = 0;
        let totalBytes = 0;
        let isEncoding = true;
        const startTime = performance.now();

        try {
            const videoTrack = stream.getVideoTracks()[0];
            const settings = videoTrack.getSettings();
            
            // Create encoder
            encoder = new VideoEncoder({
                output: (chunk) => {
                    frameCount++;
                    totalBytes += chunk.byteLength;
                    const elapsed = (performance.now() - startTime) / 1000;
                    const fps = (frameCount / elapsed).toFixed(1);
                    const kbps = ((totalBytes * 8) / elapsed / 1000).toFixed(1);
                    
                    document.getElementById('encoding-stats').innerHTML = `
                        <strong>🎬 Live Camera Encoding (${codecName})</strong><br>
                        Frames encoded: ${frameCount}<br>
                        Encoding FPS: ${fps}<br>
                        Bitrate: ${kbps} kbps<br>
                        Total data: ${(totalBytes / 1024).toFixed(1)} KB<br>
                        Chunk size: ${chunk.byteLength} bytes<br>
                        Resolution: ${settings.width}×${settings.height}
                    `;
                },
                error: (error) => {
                    console.error('Camera encoding error:', error);
                    document.getElementById('live-test-status').innerHTML = 
                        `❌ Encoding error: ${error.message}`;
                    isEncoding = false;
                }
            });

            encoder.configure({
                codec: codec,
                width: settings.width || 640,
                height: settings.height || 480,
                bitrate: 1000000,
                framerate: 30,
                keyFrameInterval: 60
            });

            // Use MediaStreamTrackProcessor if available (Chrome 94+)
            if ('MediaStreamTrackProcessor' in window) {
                processor = new MediaStreamTrackProcessor({ track: videoTrack });
                reader = processor.readable.getReader();

                document.getElementById('live-test-status').innerHTML = 
                    `✅ Camera encoding active with MediaStreamTrackProcessor`;

                // Process frames
                while (isEncoding) {
                    const { done, value: frame } = await reader.read();
                    if (done || !isEncoding) break;

                    try {
                        encoder.encode(frame, { keyFrame: frameCount % 60 === 0 });
                        frame.close();
                        
                        // Stop after 10 seconds or 300 frames for demo
                        if (frameCount >= 300) {
                            isEncoding = false;
                        }
                    } catch (error) {
                        console.error('Frame encoding error:', error);
                        frame.close();
                    }
                }
            } else {
                // Fallback: Use video element and canvas
                document.getElementById('live-test-status').innerHTML = 
                    `✅ Camera encoding active (canvas fallback)`;

                const canvas = document.getElementById('test-canvas');
                canvas.width = settings.width || 640;
                canvas.height = settings.height || 480;
                canvas.style.display = 'block';
                const ctx = canvas.getContext('2d');
                
                const video = document.getElementById('source-video');
                
                const encodeFromCanvas = () => {
                    if (!isEncoding || frameCount >= 300) return;
                    
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    const frame = new VideoFrame(canvas, {
                        timestamp: performance.now() * 1000
                    });
                    
                    encoder.encode(frame, { keyFrame: frameCount % 60 === 0 });
                    frame.close();
                    
                    setTimeout(encodeFromCanvas, 33); // ~30fps
                };
                
                encodeFromCanvas();
            }

            // Cleanup after encoding finishes
            setTimeout(() => {
                isEncoding = false;
                if (encoder) encoder.close();
                if (reader) reader.releaseLock();
                if (processor) processor.readable.cancel();
                
                stream.getTracks().forEach(track => track.stop());
                document.getElementById('source-video').style.display = 'none';
                document.getElementById('test-canvas').style.display = 'none';
                
                const finalFps = (frameCount / ((performance.now() - startTime) / 1000)).toFixed(1);
                document.getElementById('live-test-status').innerHTML = 
                    `✅ Camera encoding completed. Average FPS: ${finalFps}`;
            }, 10000); // Stop after 10 seconds

        } catch (error) {
            console.error('Camera encoding setup error:', error);
            document.getElementById('live-test-status').innerHTML = 
                `❌ Camera encoding setup failed: ${error.message}`;
        }
    }

    async startMicrophoneTest() {
        try {
            // Check if AudioEncoder is available
            if (!this.supportStatus || !this.supportStatus.audioEncoder) {
                document.getElementById('live-test-status').innerHTML = 
                    '❌ AudioEncoder not available in this browser.';
                return;
            }
            
            // Find a supported audio codec
            const supportedCodec = Object.entries(this.testResults.audio)
                .find(([_, result]) => result.supported && result.encoder);
            
            if (!supportedCodec) {
                document.getElementById('live-test-status').innerHTML = 
                    '❌ No supported audio codecs found. Run codec tests first.';
                return;
            }

            const codecInfo = this.audioCodecs.find(c => c.name === supportedCodec[0]);
            
            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { 
                    sampleRate: 48000, 
                    channelCount: 2,
                    echoCancellation: false,
                    noiseSuppression: false
                } 
            });
            
            document.getElementById('live-test-status').innerHTML = 
                `🎤 Microphone active, starting encoding with ${codecInfo.name}...`;

            // Start the encoding pipeline
            await this.encodeMicrophoneStream(stream, codecInfo.codec, codecInfo.name);
            
        } catch (error) {
            console.error('Microphone test error:', error);
            document.getElementById('live-test-status').innerHTML = 
                `❌ Microphone test failed: ${error.message}`;
        }
    }

    async encodeMicrophoneStream(stream, codec, codecName) {
        let encoder = null;
        let processor = null;
        let reader = null;
        let chunkCount = 0;
        let totalBytes = 0;
        let isEncoding = true;
        const startTime = performance.now();
        const audioContext = new AudioContext();

        try {
            const audioTrack = stream.getAudioTracks()[0];
            const settings = audioTrack.getSettings();
            
            // Create encoder
            encoder = new AudioEncoder({
                output: (chunk) => {
                    chunkCount++;
                    totalBytes += chunk.byteLength;
                    const elapsed = (performance.now() - startTime) / 1000;
                    const chunksPerSec = (chunkCount / elapsed).toFixed(1);
                    const kbps = ((totalBytes * 8) / elapsed / 1000).toFixed(1);
                    
                    document.getElementById('encoding-stats').innerHTML = `
                        <strong>🎤 Live Microphone Encoding (${codecName})</strong><br>
                        Audio chunks: ${chunkCount}<br>
                        Chunks/sec: ${chunksPerSec}<br>
                        Bitrate: ${kbps} kbps<br>
                        Total data: ${(totalBytes / 1024).toFixed(1)} KB<br>
                        Chunk size: ${chunk.byteLength} bytes<br>
                        Sample rate: ${settings.sampleRate || 48000}Hz
                    `;
                },
                error: (error) => {
                    console.error('Microphone encoding error:', error);
                    document.getElementById('live-test-status').innerHTML = 
                        `❌ Encoding error: ${error.message}`;
                    isEncoding = false;
                }
            });

            const config = {
                codec: codec,
                sampleRate: settings.sampleRate || 48000,
                numberOfChannels: 2,
                bitrate: 128000
            };

            if (codec === 'pcm-s16') {
                delete config.bitrate;
            }

            encoder.configure(config);

            // Use MediaStreamTrackProcessor if available (Chrome 94+)
            if ('MediaStreamTrackProcessor' in window) {
                processor = new MediaStreamTrackProcessor({ track: audioTrack });
                reader = processor.readable.getReader();

                document.getElementById('live-test-status').innerHTML = 
                    `✅ Microphone encoding active with MediaStreamTrackProcessor`;

                // Process audio frames
                while (isEncoding) {
                    const { done, value: audioData } = await reader.read();
                    if (done || !isEncoding) break;

                    try {
                        encoder.encode(audioData);
                        audioData.close();
                        
                        // Stop after 10 seconds or 100 chunks for demo
                        if (chunkCount >= 100) {
                            isEncoding = false;
                        }
                    } catch (error) {
                        console.error('Audio frame encoding error:', error);
                        audioData.close();
                    }
                }
            } else {
                // Fallback: Use Web Audio API to capture audio data
                document.getElementById('live-test-status').innerHTML = 
                    `✅ Microphone encoding active (Web Audio API fallback)`;

                const source = audioContext.createMediaStreamSource(stream);
                const processor = audioContext.createScriptProcessor(4096, 2, 2);
                
                processor.onaudioprocess = (event) => {
                    if (!isEncoding || chunkCount >= 100) return;

                    const inputBuffer = event.inputBuffer;
                    const leftChannel = inputBuffer.getChannelData(0);
                    const rightChannel = inputBuffer.getChannelData(1);
                    
                    // Interleave the channels
                    const frameSize = leftChannel.length;
                    const audioData = new Float32Array(frameSize * 2);
                    
                    for (let i = 0; i < frameSize; i++) {
                        audioData[i * 2] = leftChannel[i];
                        audioData[i * 2 + 1] = rightChannel[i];
                    }

                    try {
                        const audioFrame = new AudioData({
                            format: 'f32',
                            sampleRate: audioContext.sampleRate,
                            numberOfChannels: 2,
                            numberOfFrames: frameSize,
                            timestamp: performance.now() * 1000,
                            data: audioData
                        });

                        encoder.encode(audioFrame);
                        audioFrame.close();
                    } catch (error) {
                        console.error('Audio encoding error:', error);
                    }
                };
                
                source.connect(processor);
                processor.connect(audioContext.destination);
            }

            // Cleanup after encoding finishes
            setTimeout(() => {
                isEncoding = false;
                if (encoder) encoder.close();
                if (reader) reader.releaseLock();
                if (processor) processor.readable?.cancel();
                if (audioContext.state !== 'closed') audioContext.close();
                
                stream.getTracks().forEach(track => track.stop());
                
                const avgChunksPerSec = (chunkCount / ((performance.now() - startTime) / 1000)).toFixed(1);
                document.getElementById('live-test-status').innerHTML = 
                    `✅ Microphone encoding completed. Avg chunks/sec: ${avgChunksPerSec}`;
            }, 10000); // Stop after 10 seconds

        } catch (error) {
            console.error('Microphone encoding setup error:', error);
            document.getElementById('live-test-status').innerHTML = 
                `❌ Microphone encoding setup failed: ${error.message}`;
        }
    }

    async testVideoRoundtrip() {
        this.updateButton('test-video-roundtrip', 'Testing...', true);
        const resultsContainer = document.getElementById('roundtrip-results');
        
        try {
            // Find supported codecs
            const supportedCodecs = Object.entries(this.testResults.video)
                .filter(([_, result]) => result.supported)
                .slice(0, 3); // Test first 3 supported codecs
            
            if (supportedCodecs.length === 0) {
                alert('No supported video codecs found. Run codec tests first.');
                return;
            }

            resultsContainer.innerHTML = '<p>Running video roundtrip tests...</p>';

            for (const [codecName, codecResult] of supportedCodecs) {
                await this.performVideoRoundtripTest(codecName, codecResult.codec, resultsContainer);
            }

        } catch (error) {
            console.error('Video roundtrip test failed:', error);
            resultsContainer.innerHTML = `<p class="error">❌ Roundtrip test failed: ${error.message}</p>`;
        } finally {
            this.updateButton('test-video-roundtrip', 'Test Video Roundtrip', false);
        }
    }

    async testAudioRoundtrip() {
        this.updateButton('test-audio-roundtrip', 'Testing...', true);
        const resultsContainer = document.getElementById('roundtrip-results');
        
        try {
            // Find supported codecs
            const supportedCodecs = Object.entries(this.testResults.audio)
                .filter(([_, result]) => result.supported)
                .slice(0, 3); // Test first 3 supported codecs
            
            if (supportedCodecs.length === 0) {
                alert('No supported audio codecs found. Run codec tests first.');
                return;
            }

            if (resultsContainer.innerHTML.includes('Running video roundtrip')) {
                // Append to existing results
            } else {
                resultsContainer.innerHTML = '<p>Running audio roundtrip tests...</p>';
            }

            for (const [codecName, codecResult] of supportedCodecs) {
                await this.performAudioRoundtripTest(codecName, codecResult.codec, resultsContainer);
            }

        } catch (error) {
            console.error('Audio roundtrip test failed:', error);
            resultsContainer.innerHTML += `<p class="error">❌ Audio roundtrip test failed: ${error.message}</p>`;
        } finally {
            this.updateButton('test-audio-roundtrip', 'Test Audio Roundtrip', false);
        }
    }

    async performVideoRoundtripTest(codecName, codec, container) {
        return new Promise(async (resolve, reject) => {
            let encodedChunks = [];
            let decodedFrames = [];
            let encoder = null;
            let decoder = null;
            
            const resultDiv = this.createResultDiv(`${codecName} Roundtrip`, 'testing');
            container.appendChild(resultDiv);

            try {
                // Create test canvas and pattern
                const canvas = document.createElement('canvas');
                canvas.width = 320;
                canvas.height = 240;
                const ctx = canvas.getContext('2d');
                this.drawTestPattern(ctx, canvas.width, canvas.height, 0);

                // Configure encoder
                encoder = new VideoEncoder({
                    output: (chunk) => {
                        encodedChunks.push(chunk);
                        // Start decoding after we have some chunks
                        if (encodedChunks.length === 1 && !decoder) {
                            setupDecoder();
                        }
                    },
                    error: (error) => reject(error)
                });

                const setupDecoder = () => {
                    decoder = new VideoDecoder({
                        output: (frame) => {
                            decodedFrames.push(frame);
                            if (decodedFrames.length >= 3) {
                                // Test passed - we encoded and decoded frames
                                this.updateResultDiv(resultDiv, `${codecName} Roundtrip`, true, {
                                    'Encoded chunks': encodedChunks.length,
                                    'Decoded frames': decodedFrames.length,
                                    'Total size': `${encodedChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)} bytes`
                                });
                                
                                // Cleanup
                                decodedFrames.forEach(f => f.close());
                                encoder.close();
                                decoder.close();
                                resolve();
                            }
                        },
                        error: (error) => reject(error)
                    });

                    decoder.configure({ codec: codec });
                    
                    // Decode the chunks
                    encodedChunks.forEach(chunk => {
                        decoder.decode(chunk);
                    });
                };

                encoder.configure({
                    codec: codec,
                    width: canvas.width,
                    height: canvas.height,
                    bitrate: 500000,
                    framerate: 30
                });

                // Encode a few test frames
                for (let i = 0; i < 5; i++) {
                    this.drawTestPattern(ctx, canvas.width, canvas.height, i);
                    const frame = new VideoFrame(canvas, {
                        timestamp: i * 33333
                    });
                    encoder.encode(frame, { keyFrame: i === 0 });
                    frame.close();
                }

                encoder.flush();

            } catch (error) {
                this.updateResultDiv(resultDiv, `${codecName} Roundtrip`, false, {
                    error: error.message
                });
                reject(error);
            }
        });
    }

    async performAudioRoundtripTest(codecName, codec, container) {
        return new Promise(async (resolve, reject) => {
            let encodedChunks = [];
            let decodedFrames = [];
            let encoder = null;
            let decoder = null;
            
            const resultDiv = this.createResultDiv(`${codecName} Audio Roundtrip`, 'testing');
            container.appendChild(resultDiv);

            try {
                // Configure encoder
                encoder = new AudioEncoder({
                    output: (chunk) => {
                        encodedChunks.push(chunk);
                        // Start decoding after first chunk
                        if (encodedChunks.length === 1 && !decoder) {
                            setupDecoder();
                        }
                    },
                    error: (error) => reject(error)
                });

                const setupDecoder = () => {
                    decoder = new AudioDecoder({
                        output: (audioData) => {
                            decodedFrames.push(audioData);
                            if (decodedFrames.length >= 2) {
                                // Test passed
                                this.updateResultDiv(resultDiv, `${codecName} Audio Roundtrip`, true, {
                                    'Encoded chunks': encodedChunks.length,
                                    'Decoded frames': decodedFrames.length,
                                    'Sample rate': `${decodedFrames[0].sampleRate}Hz`,
                                    'Channels': decodedFrames[0].numberOfChannels
                                });
                                
                                // Cleanup
                                decodedFrames.forEach(f => f.close());
                                encoder.close();
                                decoder.close();
                                resolve();
                            }
                        },
                        error: (error) => reject(error)
                    });

                    decoder.configure({ codec: codec });
                    
                    // Decode the chunks
                    encodedChunks.forEach(chunk => {
                        decoder.decode(chunk);
                    });
                };

                const config = {
                    codec: codec,
                    sampleRate: 48000,
                    numberOfChannels: 2,
                    bitrate: 128000
                };

                if (codec === 'pcm-s16') {
                    delete config.bitrate;
                }

                encoder.configure(config);

                // Generate and encode test audio
                for (let i = 0; i < 3; i++) {
                    const frameSize = 1024;
                    const audioData = new Float32Array(frameSize * 2);
                    
                    for (let j = 0; j < frameSize; j++) {
                        const sample = Math.sin(2 * Math.PI * 440 * (i * frameSize + j) / 48000);
                        audioData[j * 2] = sample;
                        audioData[j * 2 + 1] = sample;
                    }

                    const audioFrame = new AudioData({
                        format: 'f32',
                        sampleRate: 48000,
                        numberOfChannels: 2,
                        numberOfFrames: frameSize,
                        timestamp: i * frameSize * 1000000 / 48000,
                        data: audioData
                    });

                    encoder.encode(audioFrame);
                    audioFrame.close();
                }

                encoder.flush();

            } catch (error) {
                this.updateResultDiv(resultDiv, `${codecName} Audio Roundtrip`, false, {
                    error: error.message
                });
                reject(error);
            }
        });
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
        
        if (this.supportStatus) {
            html += '<h4>WebCodecs Components:</h4>';
            html += '<div class="component-status">';
            html += `<span class="component-item">VideoEncoder: <span class="status ${this.supportStatus.videoEncoder ? 'supported' : 'not-supported'}">${this.supportStatus.videoEncoder ? '✓' : '✗'}</span></span>`;
            html += `<span class="component-item">VideoDecoder: <span class="status ${this.supportStatus.videoDecoder ? 'supported' : 'not-supported'}">${this.supportStatus.videoDecoder ? '✓' : '✗'}</span></span>`;
            html += `<span class="component-item">AudioEncoder: <span class="status ${this.supportStatus.audioEncoder ? 'supported' : 'not-supported'}">${this.supportStatus.audioEncoder ? '✓' : '✗'}</span></span>`;
            html += `<span class="component-item">AudioDecoder: <span class="status ${this.supportStatus.audioDecoder ? 'supported' : 'not-supported'}">${this.supportStatus.audioDecoder ? '✓' : '✗'}</span></span>`;
            html += '</div>';
        } else {
            html += `<p><strong>WebCodecs API:</strong> ${('VideoEncoder' in window) ? 'Available' : 'Not Available'}</p>`;
        }
        
        summary.innerHTML = html;
        
        // Add CSS for codec tags and component status
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
                .component-status {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                }
                .component-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.3rem 0.5rem;
                    background: #f8f9fa;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    border: 1px solid #e9ecef;
                }
                .component-item .status {
                    font-size: 0.8rem;
                    padding: 2px 6px;
                    border-radius: 3px;
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

    classifyWebCodecsError(error) {
        const message = error.message.toLowerCase();
        const name = error.name.toLowerCase();

        // Hardware/driver issues
        if (message.includes('hardware') || message.includes('driver')) {
            return 'Hardware/Driver Issue';
        }
        
        // Codec not supported
        if (message.includes('not supported') || message.includes('unsupported') || 
            name.includes('notsupported')) {
            return 'Codec Not Supported';
        }
        
        // Configuration issues
        if (message.includes('invalid') || message.includes('configuration') || 
            message.includes('bitrate') || message.includes('resolution')) {
            return 'Configuration Error';
        }
        
        // Memory/resource issues
        if (message.includes('memory') || message.includes('resource') || 
            message.includes('quota')) {
            return 'Resource Limitation';
        }
        
        // Permission/security issues
        if (message.includes('permission') || message.includes('security') || 
            message.includes('origin')) {
            return 'Permission/Security Error';
        }
        
        // Network issues
        if (message.includes('network') || message.includes('timeout')) {
            return 'Network Error';
        }

        // Browser feature not available
        if (message.includes('undefined') || message.includes('not a function')) {
            return 'API Not Available';
        }

        return 'Unknown Error';
    }
}

// Initialize the test suite when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WebCodecsTestSuite();
});
