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

  async set(key, value, expirationInSeconds = 3600) {
    await this._client.set(key, value, {
      EX: expirationInSeconds,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    return result;
  }

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
