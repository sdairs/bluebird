export class Destination {
    queue = [];
    processing = false;
    maxRetries = 5;
    baseDelay = 1000; // 1 second
    // Rate limiting configuration
    maxRequestsPerSecond = 5;
    tokens = this.maxRequestsPerSecond;
    lastRefill = Date.now();
    refillInterval = 1000; // 1 second in milliseconds
    async addBatch(events) {
        this.queue.push([...events]);
        if (!this.processing) {
            this.processing = true;
            this.processQueue().catch(console.error);
        }
    }
    async init() { }
    async waitForToken() {
        const now = Date.now();
        const timeSinceLastRefill = now - this.lastRefill;
        // Refill tokens based on time elapsed
        if (timeSinceLastRefill >= this.refillInterval) {
            this.tokens = this.maxRequestsPerSecond;
            this.lastRefill = now;
        }
        // If no tokens available, wait until next refill
        if (this.tokens <= 0) {
            const waitTime = this.refillInterval - timeSinceLastRefill;
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.waitForToken();
        }
        this.tokens--;
        return true;
    }
    async processQueue() {
        while (this.queue.length > 0) {
            const batch = this.queue[0];
            let success = false;
            let retryCount = 0;
            while (!success && retryCount < this.maxRetries) {
                try {
                    await this.waitForToken();
                    await this.send(batch);
                    success = true;
                }
                catch (error) {
                    retryCount++;
                    if (retryCount === this.maxRetries) {
                        console.error('Failed to process batch after max retries:', error);
                        break;
                    }
                    const delay = this.baseDelay * Math.pow(2, retryCount);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            this.queue.shift();
        }
        this.processing = false;
    }
}
