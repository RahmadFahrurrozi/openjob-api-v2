const { nanoid } = require('nanoid');
const pool = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class BookmarksService {
  async addBookmark(userId, jobId) {
    // Check if job exists
    const jobCheck = await pool.query('SELECT id FROM jobs WHERE id = $1', [jobId]);
    if (!jobCheck.rows.length) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    // Check if already bookmarked
    const existing = await pool.query(
      'SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2',
      [userId, jobId]
    );

    if (existing.rows.length) {
      throw new InvariantError('Job sudah di-bookmark sebelumnya');
    }

    const id = `bookmark-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO bookmarks(id, user_id, job_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, jobId],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Bookmark gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getBookmarksByUserId(userId) {
    const query = {
      text: `
        SELECT bookmarks.*, jobs.title, jobs.company_id, companies.name AS company_name
        FROM bookmarks
        JOIN jobs ON bookmarks.job_id = jobs.id
        JOIN companies ON jobs.company_id = companies.id
        WHERE bookmarks.user_id = $1
        ORDER BY bookmarks.created_at DESC
      `,
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async getBookmarkById(id, jobId) {
    const query = {
      text: `
        SELECT bookmarks.*, jobs.title, jobs.company_id, companies.name AS company_name
        FROM bookmarks
        JOIN jobs ON bookmarks.job_id = jobs.id
        JOIN companies ON jobs.company_id = companies.id
        WHERE bookmarks.id = $1 AND bookmarks.job_id = $2
      `,
      values: [id, jobId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteBookmark(userId, jobId) {
    const query = {
      text: 'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id',
      values: [userId, jobId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Bookmark gagal dihapus. Data tidak ditemukan');
    }
  }
}

module.exports = BookmarksService;
