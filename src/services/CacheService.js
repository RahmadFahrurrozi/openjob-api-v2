const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
      },
    });

    this._client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    this._client.connect();
  }

  /**
   * Set key-value pair in Redis cache with TTL.
   * @param {string} key - Cache key.
   * @param {string} value - Stringified data.
   * @param {number} expirationInSeconds - Time to live in seconds (default: 3600).
   */
  async set(key, value, expirationInSeconds = 3600) {
    await this._client.set(key, value, {
      EX: expirationInSeconds,
    });
  }

  /**
   * Get value from Redis cache by key.
   * @param {string} key - Cache key.
   * @returns {Promise<string|null>} Cached data or null if not found.
   */
  async get(key) {
    const result = await this._client.get(key);
    return result;
  }

  /**
   * Delete one or more keys from Redis cache.
   * @param {string|string[]} keys - Single key or array of keys.
   */
  async delete(keys) {
    if (Array.isArray(keys)) {
      if (keys.length > 0) {
        await this._client.del(keys);
      }
    } else if (keys) {
      await this._client.del(keys);
    }
  }
}

module.exports = CacheService;
