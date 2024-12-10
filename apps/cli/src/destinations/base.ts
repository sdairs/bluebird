import { Event } from "../lib/types.js";

export abstract class Destination {
  protected queue: Event[][] = [];
  protected processing = false;
  protected maxRetries = 5;
  protected baseDelay = 1000; // 1 second

  // Rate limiting configuration
  protected maxRequestsPerSecond = 5;
  protected tokens = this.maxRequestsPerSecond;
  protected lastRefill = Date.now();
  protected refillInterval = 1000; // 1 second in milliseconds

  abstract send(events: Event[]): Promise<void>;

  async addBatch(events: Event[]): Promise<void> {
    this.queue.push([...events]);
    if (!this.processing) {
      this.processing = true;
      this.processQueue().catch(console.error);
    }
  }

  async init(): Promise<void> {}

  protected async waitForToken(): Promise<boolean> {
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

  protected async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const batch = this.queue[0];
      let success = false;
      let retryCount = 0;

      while (!success && retryCount < this.maxRetries) {
        try {
          await this.waitForToken();
          await this.send(batch);
          success = true;
        } catch (error) {
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
