const { nanoid } = require('nanoid');
const pool = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class ApplicationsService {
  async addApplication({ user_id, job_id, status = 'pending' }) {
    // Verify user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
    if (!userCheck.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    // Verify job exists
    const jobCheck = await pool.query('SELECT id FROM jobs WHERE id = $1', [job_id]);
    if (!jobCheck.rows.length) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    const id = `application-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO applications(id, user_id, job_id, status) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, user_id, job_id, status || 'pending'],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lamaran gagal diajukan');
    }

    return result.rows[0].id;
  }

  async getApplications() {
    const query = `
      SELECT applications.*, users.name AS user_name, users.email AS user_email, jobs.title AS job_title 
      FROM applications 
      JOIN users ON applications.user_id = users.id 
      JOIN jobs ON applications.job_id = jobs.id 
      ORDER BY applications.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async getApplicationById(id) {
    const query = {
      text: `
        SELECT applications.*, users.name AS user_name, users.email AS user_email, jobs.title AS job_title 
        FROM applications 
        JOIN users ON applications.user_id = users.id 
        JOIN jobs ON applications.job_id = jobs.id 
        WHERE applications.id = $1
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lamaran tidak ditemukan');
    }

    return result.rows[0];
  }

  async getApplicationsByUserId(userId) {
    const query = {
      text: `
        SELECT applications.*, jobs.title AS job_title
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        WHERE applications.user_id = $1
        ORDER BY applications.created_at DESC
      `,
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async getApplicationsByJobId(jobId) {
    const query = {
      text: `
        SELECT applications.*, users.name AS user_name, users.email AS user_email
        FROM applications
        JOIN users ON applications.user_id = users.id
        WHERE applications.job_id = $1
        ORDER BY applications.created_at DESC
      `,
      values: [jobId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async editApplicationStatusById(id, { status }) {
    const query = {
      text: 'UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      values: [status, id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui status lamaran. Id tidak ditemukan');
    }
  }

  async deleteApplicationById(id) {
    const query = {
      text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lamaran gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = ApplicationsService;
