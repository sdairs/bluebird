export class BatchProcessor {
  constructor() {
    this.queue = []
    this.processing = false
    this.maxRetries = 5
    this.baseDelay = 1000 // 1 second
    
    // Rate limiting configuration
    this.maxRequestsPerSecond = 5
    this.tokens = this.maxRequestsPerSecond
    this.lastRefill = Date.now()
    this.refillInterval = 1000 // 1 second in milliseconds
  }

  async addBatch(events) {
    this.queue.push([...events])
    if (!this.processing) {
      this.processing = true
      this.processQueue().catch(console.error)
    }
  }

  async waitForToken() {
    const now = Date.now()
    const timeSinceLastRefill = now - this.lastRefill
    
    // Refill tokens based on time elapsed
    if (timeSinceLastRefill >= this.refillInterval) {
      this.tokens = this.maxRequestsPerSecond
      this.lastRefill = now
    }

    // If no tokens available, wait until next refill
    if (this.tokens <= 0) {
      const waitTime = this.refillInterval - timeSinceLastRefill
      await new Promise(resolve => setTimeout(resolve, waitTime))
      return this.waitForToken()
    }

    this.tokens--
    return true
  }

  async processQueue() {
    while (this.queue.length > 0) {
      const batch = this.queue[0]
      let success = false
      let retryCount = 0

      while (!success && retryCount < this.maxRetries) {
        try {
          await this.waitForToken() // Wait for rate limit token
          await this.processBatch(batch)
          success = true
          this.queue.shift() // Remove the processed batch
        } catch (error) {
          retryCount++
          if (retryCount === this.maxRetries) {
            console.error(`Failed to send batch after ${this.maxRetries} retries:`, error)
            this.queue.shift() // Remove the failed batch after max retries
          } else {
            const delay = this.baseDelay * Math.pow(2, retryCount - 1)
            console.log(`Retry ${retryCount} after ${delay}ms`)
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }
      }
    }
    this.processing = false
  }

  // This method should be implemented by specific processors
  async processBatch(events) {
    throw new Error('processBatch must be implemented by the processor')
  }
}
