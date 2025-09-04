class SharedArrayBufferTester {
    constructor() {
        this.testResults = {
            basicSupport: false,
            secureContext: false,
            crossOriginIsolated: false,
            coopHeader: null,
            coepHeader: null
        };
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateBrowserInfo();
            this.checkSecurityRequirements();
            this.checkBasicSupport();
            this.updateMemoryInfo();
            this.setupEventListeners();
            this.updateSummary();
        });
    }

    updateBrowserInfo() {
        const browserInfo = this.getBrowserInfo();
        document.getElementById('browser-info').textContent = browserInfo;
        document.getElementById('user-agent').textContent = navigator.userAgent;
        
        // Check secure context
        const isSecure = window.isSecureContext;
        this.testResults.secureContext = isSecure;
        const secureElement = document.getElementById('secure-context');
        secureElement.textContent = isSecure ? 'Yes (HTTPS)' : 'No (HTTP)';
        secureElement.className = `status ${isSecure ? 'supported' : 'not-supported'}`;
    }

    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Firefox')) {
            browser = 'Firefox';
        } else if (ua.includes('Chrome') && !ua.includes('Edg')) {
            browser = 'Chrome';
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            browser = 'Safari';
        } else if (ua.includes('Edg')) {
            browser = 'Edge';
        }
        
        return browser;
    }

    async checkSecurityRequirements() {
        // Check HTTPS
        const httpsElement = document.getElementById('https-requirement');
        const httpsStatus = document.getElementById('https-status');
        const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
        
        httpsStatus.textContent = isHttps ? 'Met ✓' : 'Not Met ✗';
        httpsElement.className = `security-requirement ${isHttps ? 'met' : 'not-met'}`;

        // Check Cross-Origin Isolation
        const isIsolated = window.crossOriginIsolated || false;
        this.testResults.crossOriginIsolated = isIsolated;
        
        const isolationElement = document.getElementById('isolation-requirement');
        const isolationStatus = document.getElementById('isolation-status');
        isolationStatus.textContent = isIsolated ? 'Enabled ✓' : 'Not Enabled ✗';
        isolationElement.className = `security-requirement ${isIsolated ? 'met' : 'not-met'}`;

        // Try to detect headers (this is limited in browsers for security)
        await this.checkHeaders();
    }

    async checkHeaders() {
        try {
            // We can't directly read response headers in most cases,
            // but we can infer from crossOriginIsolated status
            const coopElement = document.getElementById('coop-requirement');
            const coepElement = document.getElementById('coep-requirement');
            const coopStatus = document.getElementById('coop-status');
            const coepStatus = document.getElementById('coep-status');

            if (window.crossOriginIsolated) {
                coopStatus.textContent = 'Likely Present ✓';
                coepStatus.textContent = 'Likely Present ✓';
                coopElement.className = 'security-requirement met';
                coepElement.className = 'security-requirement met';
            } else {
                coopStatus.textContent = 'Missing or Insufficient ✗';
                coepStatus.textContent = 'Missing or Insufficient ✗';
                coopElement.className = 'security-requirement not-met';
                coepElement.className = 'security-requirement not-met';
            }
        } catch (error) {
            console.warn('Could not check headers:', error);
        }
    }

    checkBasicSupport() {
        const supportElement = document.getElementById('sharedarraybuffer-support');
        const hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
        
        this.testResults.basicSupport = hasSharedArrayBuffer;
        
        supportElement.textContent = hasSharedArrayBuffer ? 'Available' : 'Not Available';
        supportElement.className = `status ${hasSharedArrayBuffer ? 'supported' : 'not-supported'}`;

        // Enable/disable test buttons
        const canRunTests = hasSharedArrayBuffer;
        document.getElementById('test-basic').disabled = !canRunTests;
        document.getElementById('test-worker').disabled = !canRunTests;
        document.getElementById('test-performance').disabled = !canRunTests;
    }

    updateMemoryInfo() {
        // Device Memory API
        const deviceMemory = navigator.deviceMemory || 'Unknown';
        document.getElementById('device-memory').textContent = 
            deviceMemory !== 'Unknown' ? `${deviceMemory} GB` : 'Unknown';

        // Performance memory info (Chrome specific)
        if (performance.memory) {
            const formatBytes = (bytes) => {
                const mb = bytes / (1024 * 1024);
                return `${mb.toFixed(2)} MB`;
            };

            document.getElementById('heap-used').textContent = 
                formatBytes(performance.memory.usedJSHeapSize);
            document.getElementById('heap-total').textContent = 
                formatBytes(performance.memory.totalJSHeapSize);
            document.getElementById('heap-limit').textContent = 
                formatBytes(performance.memory.jsHeapSizeLimit);
        } else {
            ['heap-used', 'heap-total', 'heap-limit'].forEach(id => {
                document.getElementById(id).textContent = 'Not Available';
            });
        }
    }

    setupEventListeners() {
        document.getElementById('test-basic').addEventListener('click', () => {
            this.testBasicFunctionality();
        });

        document.getElementById('test-worker').addEventListener('click', () => {
            this.testWorkerCommunication();
        });

        document.getElementById('test-performance').addEventListener('click', () => {
            this.testPerformance();
        });
    }

    testBasicFunctionality() {
        const resultsDiv = document.getElementById('basic-results');
        const testSection = document.getElementById('basic-test-results');
        
        testSection.style.display = 'block';
        resultsDiv.innerHTML = '<p>Running basic tests...</p>';

        try {
            const tests = [];

            // Test 1: Create SharedArrayBuffer
            try {
                const sab = new SharedArrayBuffer(1024);
                tests.push({
                    name: 'SharedArrayBuffer Creation',
                    result: 'Passed',
                    details: `Created 1KB SharedArrayBuffer (${sab.byteLength} bytes)`
                });
            } catch (error) {
                tests.push({
                    name: 'SharedArrayBuffer Creation',
                    result: 'Failed',
                    details: error.message
                });
            }

            // Test 2: Create views
            try {
                const sab = new SharedArrayBuffer(32);
                const int32View = new Int32Array(sab);
                const uint8View = new Uint8Array(sab);
                
                tests.push({
                    name: 'Typed Array Views',
                    result: 'Passed',
                    details: `Created Int32Array (${int32View.length} elements) and Uint8Array (${uint8View.length} elements)`
                });
            } catch (error) {
                tests.push({
                    name: 'Typed Array Views',
                    result: 'Failed',
                    details: error.message
                });
            }

            // Test 3: Write and read data
            try {
                const sab = new SharedArrayBuffer(16);
                const view = new Int32Array(sab);
                
                view[0] = 42;
                view[1] = 123;
                view[2] = 999;
                
                const success = view[0] === 42 && view[1] === 123 && view[2] === 999;
                
                tests.push({
                    name: 'Data Read/Write',
                    result: success ? 'Passed' : 'Failed',
                    details: success ? 
                        `Successfully wrote and read values: [${view[0]}, ${view[1]}, ${view[2]}]` :
                        'Data integrity check failed'
                });
            } catch (error) {
                tests.push({
                    name: 'Data Read/Write',
                    result: 'Failed',
                    details: error.message
                });
            }

            // Test 4: Atomics operations
            try {
                const sab = new SharedArrayBuffer(16);
                const view = new Int32Array(sab);
                
                Atomics.store(view, 0, 100);
                const loaded = Atomics.load(view, 0);
                const exchanged = Atomics.exchange(view, 0, 200);
                const compareExchange = Atomics.compareExchange(view, 0, 200, 300);
                
                tests.push({
                    name: 'Atomics Operations',
                    result: 'Passed',
                    details: `store/load: ${loaded}, exchange: ${exchanged}, compareExchange: ${compareExchange}`
                });
            } catch (error) {
                tests.push({
                    name: 'Atomics Operations',
                    result: 'Failed',
                    details: error.message
                });
            }

            this.displayTestResults(tests, resultsDiv);

        } catch (error) {
            resultsDiv.innerHTML = `<p class="error">Test failed: ${error.message}</p>`;
        }
    }

    testWorkerCommunication() {
        const outputDiv = document.getElementById('worker-output');
        const testSection = document.getElementById('worker-test-results');
        
        testSection.style.display = 'block';
        outputDiv.textContent = 'Creating worker and testing SharedArrayBuffer communication...\n';

        try {
            // Create worker inline
            const workerScript = `
                self.onmessage = function(e) {
                    const { sab, command } = e.data;
                    
                    if (command === 'test') {
                        try {
                            const view = new Int32Array(sab);
                            
                            // Read initial value
                            const initialValue = Atomics.load(view, 0);
                            self.postMessage({ type: 'log', message: 'Worker: Read initial value: ' + initialValue });
                            
                            // Modify the shared memory
                            Atomics.store(view, 0, initialValue + 1000);
                            self.postMessage({ type: 'log', message: 'Worker: Added 1000 to the value' });
                            
                            // Use atomic operations
                            const result = Atomics.add(view, 1, 50);
                            self.postMessage({ type: 'log', message: 'Worker: Added 50 to index 1, previous value was: ' + result });
                            
                            // Signal completion
                            Atomics.store(view, 2, 999);
                            self.postMessage({ type: 'complete', message: 'Worker: Test completed successfully' });
                            
                        } catch (error) {
                            self.postMessage({ type: 'error', message: 'Worker error: ' + error.message });
                        }
                    }
                };
            `;

            const blob = new Blob([workerScript], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));

            // Create SharedArrayBuffer
            const sab = new SharedArrayBuffer(16);
            const view = new Int32Array(sab);
            
            // Initialize data
            Atomics.store(view, 0, 42);
            Atomics.store(view, 1, 0);
            Atomics.store(view, 2, 0);
            
            outputDiv.textContent += `Main: Created SharedArrayBuffer with initial value: ${view[0]}\n`;
            
            // Set up worker message handler
            worker.onmessage = (e) => {
                const { type, message } = e.data;
                outputDiv.textContent += message + '\n';
                
                if (type === 'complete') {
                    // Verify the changes
                    const finalValue0 = Atomics.load(view, 0);
                    const finalValue1 = Atomics.load(view, 1);
                    const finalValue2 = Atomics.load(view, 2);
                    
                    outputDiv.textContent += `Main: Final values - [${finalValue0}, ${finalValue1}, ${finalValue2}]\n`;
                    
                    if (finalValue0 === 1042 && finalValue1 === 50 && finalValue2 === 999) {
                        outputDiv.textContent += 'SUCCESS: Worker communication test passed!\n';
                    } else {
                        outputDiv.textContent += 'FAILURE: Values don\'t match expected results\n';
                    }
                    
                    worker.terminate();
                } else if (type === 'error') {
                    outputDiv.textContent += 'FAILURE: ' + message + '\n';
                    worker.terminate();
                }
            };

            worker.onerror = (error) => {
                outputDiv.textContent += `Worker error: ${error.message}\n`;
                worker.terminate();
            };

            // Send SharedArrayBuffer to worker
            worker.postMessage({ sab, command: 'test' });

        } catch (error) {
            outputDiv.textContent += `Error: ${error.message}\n`;
        }
    }

    testPerformance() {
        const statsDiv = document.getElementById('performance-stats');
        const detailsDiv = document.getElementById('performance-details');
        const testSection = document.getElementById('performance-test-results');
        
        testSection.style.display = 'block';
        detailsDiv.innerHTML = '<p>Running performance tests...</p>';

        try {
            const arraySize = 1024 * 1024; // 1MB
            const iterations = 1000;

            // Test regular ArrayBuffer
            const startRegular = performance.now();
            const regularBuffer = new ArrayBuffer(arraySize);
            const regularView = new Int32Array(regularBuffer);
            
            for (let i = 0; i < iterations; i++) {
                regularView[i % regularView.length] = i;
            }
            const regularTime = performance.now() - startRegular;

            // Test SharedArrayBuffer
            const startShared = performance.now();
            const sharedBuffer = new SharedArrayBuffer(arraySize);
            const sharedView = new Int32Array(sharedBuffer);
            
            for (let i = 0; i < iterations; i++) {
                Atomics.store(sharedView, i % sharedView.length, i);
            }
            const sharedTime = performance.now() - startShared;

            // Test regular operations on SharedArrayBuffer
            const startSharedRegular = performance.now();
            const sharedBuffer2 = new SharedArrayBuffer(arraySize);
            const sharedView2 = new Int32Array(sharedBuffer2);
            
            for (let i = 0; i < iterations; i++) {
                sharedView2[i % sharedView2.length] = i;
            }
            const sharedRegularTime = performance.now() - startSharedRegular;

            // Display stats
            const stats = [
                { label: 'ArrayBuffer Operations', value: `${regularTime.toFixed(2)} ms` },
                { label: 'SharedArrayBuffer (Atomic)', value: `${sharedTime.toFixed(2)} ms` },
                { label: 'SharedArrayBuffer (Regular)', value: `${sharedRegularTime.toFixed(2)} ms` },
                { label: 'Atomic Overhead', value: `${((sharedTime / sharedRegularTime - 1) * 100).toFixed(1)}%` }
            ];

            statsDiv.innerHTML = stats.map(stat => `
                <div class="stat-item">
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `).join('');

            detailsDiv.innerHTML = `
                <h4>Performance Test Details</h4>
                <p><strong>Array Size:</strong> ${arraySize.toLocaleString()} bytes (${(arraySize / (1024 * 1024)).toFixed(1)} MB)</p>
                <p><strong>Iterations:</strong> ${iterations.toLocaleString()} write operations</p>
                <p><strong>Results:</strong></p>
                <ul>
                    <li>Regular ArrayBuffer: ${regularTime.toFixed(2)} ms</li>
                    <li>SharedArrayBuffer with Atomics: ${sharedTime.toFixed(2)} ms</li>
                    <li>SharedArrayBuffer without Atomics: ${sharedRegularTime.toFixed(2)} ms</li>
                </ul>
                <p><strong>Analysis:</strong> Atomic operations add approximately ${((sharedTime / sharedRegularTime - 1) * 100).toFixed(1)}% overhead compared to regular operations on SharedArrayBuffer.</p>
            `;

        } catch (error) {
            detailsDiv.innerHTML = `<p class="error">Performance test failed: ${error.message}</p>`;
        }
    }

    displayTestResults(tests, container) {
        const html = tests.map(test => `
            <div class="test-result">
                <h4>${test.name}: <span class="${test.result.toLowerCase()}">${test.result}</span></h4>
                <p>${test.details}</p>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    updateSummary() {
        const summaryDiv = document.getElementById('summary-results');
        const hasSupport = this.testResults.basicSupport;
        const isSecure = this.testResults.secureContext;
        const isIsolated = this.testResults.crossOriginIsolated;

        let status, message, recommendations;

        if (hasSupport && isSecure && isIsolated) {
            status = 'Fully Supported';
            message = 'SharedArrayBuffer is fully available and ready to use.';
            recommendations = [
                '✓ All security requirements are met',
                '✓ SharedArrayBuffer API is available',
                '✓ Cross-origin isolation is enabled',
                'You can safely use SharedArrayBuffer in your applications'
            ];
        } else if (hasSupport && isSecure) {
            status = 'Limited Support';
            message = 'SharedArrayBuffer API exists but cross-origin isolation is not enabled.';
            recommendations = [
                '✓ SharedArrayBuffer API is available',
                '✓ Running in secure context',
                '✗ Cross-origin isolation headers missing',
                'Add COOP and COEP headers to your server to enable full functionality'
            ];
        } else if (hasSupport) {
            status = 'Requires HTTPS';
            message = 'SharedArrayBuffer is available but requires HTTPS.';
            recommendations = [
                '✓ SharedArrayBuffer API is available',
                '✗ Not running in secure context (HTTPS required)',
                'Deploy your application over HTTPS to enable SharedArrayBuffer'
            ];
        } else {
            status = 'Not Supported';
            message = 'SharedArrayBuffer is not available in this browser.';
            recommendations = [
                '✗ SharedArrayBuffer API not available',
                'This browser version does not support SharedArrayBuffer',
                'Try updating your browser or use a different browser'
            ];
        }

        summaryDiv.innerHTML = `
            <div class="summary-status">
                <h3>Overall Status: <span class="status ${hasSupport ? 'supported' : 'not-supported'}">${status}</span></h3>
                <p>${message}</p>
                <ul>
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    }
}

// Initialize the tester
new SharedArrayBufferTester();
