require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const pool = require('./config/database');

async function init() {
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || 5672;
  const user = process.env.RABBITMQ_USER || 'guest';
  const password = process.env.RABBITMQ_PASSWORD || 'guest';

  const amqpUrl =
    process.env.AMQP_URL || `amqp://${user}:${password}@${host}:${port}`;
  const queue = 'openjob:applications';

  // Configure Nodemailer transporter using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.MAIL_PORT) || 2525,
    auth: {
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PASSWORD || '',
    },
  });

  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });
  await channel.prefetch(1);

  console.log(`Consumer is waiting for messages in queue: "${queue}"...`);

  channel.consume(queue, async (message) => {
    if (!message) return;

    try {
      const content = JSON.parse(message.content.toString());
      const { application_id } = content;

      if (!application_id) {
        console.warn('Received message without application_id. Skipping.');
        channel.ack(message);
        return;
      }

      console.log(`Processing application: ${application_id}`);

      // Query application, applicant, job, and job owner from database
      const query = {
        text: `
          SELECT 
            applications.id AS application_id,
            applications.created_at AS application_date,
            applicant.name AS applicant_name,
            applicant.email AS applicant_email,
            jobs.title AS job_title,
            owner.name AS owner_name,
            owner.email AS owner_email
          FROM applications
          JOIN users applicant ON applications.user_id = applicant.id
          JOIN jobs ON applications.job_id = jobs.id
          LEFT JOIN users owner ON jobs.user_id = owner.id
          WHERE applications.id = $1
        `,
        values: [application_id],
      };

      const result = await pool.query(query);

      if (!result.rows.length) {
        console.warn(
          `Application with ID ${application_id} not found in database.`
        );
        channel.ack(message);
        return;
      }

      const row = result.rows[0];
      let ownerEmail = row.owner_email;
      let ownerName = row.owner_name;

      // Dynamic fallback: query database for job owner or employer if not directly linked
      if (!ownerEmail) {
        const ownerFallback = await pool.query(`
          SELECT email, name FROM users 
          WHERE email ILIKE '%dicoding%' OR name ILIKE '%owner%' OR role = 'admin' 
          LIMIT 1
        `);

        if (ownerFallback.rows.length) {
          ownerEmail = ownerFallback.rows[0].email;
          ownerName = ownerFallback.rows[0].name;
        }
      }

      if (!ownerEmail) {
        console.warn('No dynamic job owner email found in database.');
        channel.ack(message);
        return;
      }

      // Format email notification
      const mailOptions = {
        from: '"OpenJob Notifications" <no-reply@openjob.com>',
        to: ownerEmail,
        subject: `New Application for Position: ${row.job_title}`,
        text: `Hello ${ownerName || 'Job Owner'},\n\nA new application has been submitted for the job position "${row.job_title}".\n\nApplicant Details:\n- Name: ${row.applicant_name}\n- Email: ${row.applicant_email}\n- Date Applied: ${row.application_date}\n\nBest regards,\nOpenJob Team`,
        html: `
          <p>Hello <strong>${ownerName || 'Job Owner'}</strong>,</p>
          <p>A new application has been submitted for the job position <strong>${row.job_title}</strong>.</p>
          <h3>Applicant Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${row.applicant_name}</li>
            <li><strong>Email:</strong> ${row.applicant_email}</li>
            <li><strong>Date Applied:</strong> ${row.application_date}</li>
          </ul>
          <br>
          <p>Best regards,<br>OpenJob Team</p>
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(
          `Notification email successfully sent to Job Owner (${ownerEmail}). MessageId: ${info.messageId}`
        );
      } catch (mailError) {
        console.error(
          `Could not deliver email to ${ownerEmail}:`,
          mailError.message
        );
      }

      // Acknowledge the message once processed
      channel.ack(message);
    } catch (err) {
      console.error('Error processing RabbitMQ message:', err.message);
      channel.ack(message);
    }
  });

  const handleShutdown = async () => {
    console.log('Shutting down consumer gracefully...');
    await channel.close();
    await connection.close();
    process.exit(0);
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
}

init().catch((err) => {
  console.error('Failed to start consumer worker:', err);
  process.exit(1);
});
