const { nanoid } = require('nanoid');
const pool = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class JobsService {
  async addJob({
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible = true,
    status = 'open',
  }) {
    // Check if company exists
    const companyCheck = await pool.query('SELECT id FROM companies WHERE id = $1', [company_id]);
    if (!companyCheck.rows.length) {
      throw new NotFoundError('Perusahaan tidak ditemukan');
    }

    // Check if category exists
    const categoryCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [category_id]);
    if (!categoryCheck.rows.length) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }

    const id = `job-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO jobs(
        id, company_id, category_id, title, description, job_type, 
        experience_level, location_type, location_city, salary_min, 
        salary_max, is_salary_visible, status
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      values: [
        id,
        company_id,
        category_id,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city || null,
        salary_min !== undefined ? salary_min : null,
        salary_max !== undefined ? salary_max : null,
        is_salary_visible !== undefined ? is_salary_visible : true,
        status || 'open',
      ],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Job gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getJobs({ title, companyName } = {}) {
    let baseQuery = `
      SELECT jobs.*, companies.name AS company_name, categories.name AS category_name
      FROM jobs
      JOIN companies ON jobs.company_id = companies.id
      JOIN categories ON jobs.category_id = categories.id
    `;
    const conditions = [];
    const values = [];

    if (title && title.trim() !== '') {
      values.push(`%${title.trim()}%`);
      conditions.push(`jobs.title ILIKE $${values.length}`);
    }

    if (companyName && companyName.trim() !== '') {
      values.push(`%${companyName.trim()}%`);
      conditions.push(`companies.name ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      baseQuery += ` WHERE ${conditions.join(' AND ')}`;
    }

    baseQuery += ' ORDER BY jobs.created_at DESC';

    const result = await pool.query(baseQuery, values);
    return result.rows;
  }

  async getJobById(id) {
    const query = {
      text: `
        SELECT jobs.*, companies.name AS company_name, categories.name AS category_name
        FROM jobs
        JOIN companies ON jobs.company_id = companies.id
        JOIN categories ON jobs.category_id = categories.id
        WHERE jobs.id = $1
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    return result.rows[0];
  }

  async getJobsByCompanyId(companyId) {
    const query = {
      text: `
        SELECT jobs.*, companies.name AS company_name, categories.name AS category_name
        FROM jobs
        JOIN companies ON jobs.company_id = companies.id
        JOIN categories ON jobs.category_id = categories.id
        WHERE jobs.company_id = $1
        ORDER BY jobs.created_at DESC
      `,
      values: [companyId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async getJobsByCategoryId(categoryId) {
    const query = {
      text: `
        SELECT jobs.*, companies.name AS company_name, categories.name AS category_name
        FROM jobs
        JOIN companies ON jobs.company_id = companies.id
        JOIN categories ON jobs.category_id = categories.id
        WHERE jobs.category_id = $1
        ORDER BY jobs.created_at DESC
      `,
      values: [categoryId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async editJobById(id, payload) {
    const current = await this.getJobById(id);

    const updated = {
      company_id: payload.company_id !== undefined ? payload.company_id : current.company_id,
      category_id: payload.category_id !== undefined ? payload.category_id : current.category_id,
      title: payload.title !== undefined ? payload.title : current.title,
      description: payload.description !== undefined ? payload.description : current.description,
      job_type: payload.job_type !== undefined ? payload.job_type : current.job_type,
      experience_level: payload.experience_level !== undefined ? payload.experience_level : current.experience_level,
      location_type: payload.location_type !== undefined ? payload.location_type : current.location_type,
      location_city: payload.location_city !== undefined ? payload.location_city : current.location_city,
      salary_min: payload.salary_min !== undefined ? payload.salary_min : current.salary_min,
      salary_max: payload.salary_max !== undefined ? payload.salary_max : current.salary_max,
      is_salary_visible: payload.is_salary_visible !== undefined ? payload.is_salary_visible : current.is_salary_visible,
      status: payload.status !== undefined ? payload.status : current.status,
    };

    const query = {
      text: `UPDATE jobs SET 
        company_id = $1, category_id = $2, title = $3, description = $4,
        job_type = $5, experience_level = $6, location_type = $7, location_city = $8,
        salary_min = $9, salary_max = $10, is_salary_visible = $11, status = $12,
        updated_at = NOW()
        WHERE id = $13 RETURNING id`,
      values: [
        updated.company_id,
        updated.category_id,
        updated.title,
        updated.description,
        updated.job_type,
        updated.experience_level,
        updated.location_type,
        updated.location_city,
        updated.salary_min,
        updated.salary_max,
        updated.is_salary_visible,
        updated.status,
        id,
      ],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui job. Id tidak ditemukan');
    }
  }

  async deleteJobById(id) {
    const query = {
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Job gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = JobsService;
