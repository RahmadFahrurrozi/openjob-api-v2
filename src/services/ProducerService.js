const amqp = require('amqplib');

class ProducerService {
  constructor() {
    this._connection = null;
    this._channel = null;
  }

  async _getChannel() {
    if (!this._connection) {
      const host = process.env.RABBITMQ_HOST || 'localhost';
      const port = process.env.RABBITMQ_PORT || 5672;
      const user = process.env.RABBITMQ_USER || 'guest';
      const password = process.env.RABBITMQ_PASSWORD || 'guest';

      const amqpUrl =
        process.env.AMQP_URL || `amqp://${user}:${password}@${host}:${port}`;
      this._connection = await amqp.connect(amqpUrl);

      this._connection.on('error', () => {
        this._connection = null;
        this._channel = null;
      });

      this._connection.on('close', () => {
        this._connection = null;
        this._channel = null;
      });
    }

    if (!this._channel) {
      this._channel = await this._connection.createChannel();
    }

    return this._channel;
  }

  async sendMessage(queue, message) {
    try {
      const channel = await this._getChannel();
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(message));
    } catch (error) {
      // Reset connection on failure so subsequent calls can retry
      this._connection = null;
      this._channel = null;
      console.error('Failed to send message to RabbitMQ:', error.message);
    }
  }
}

module.exports = ProducerService;
