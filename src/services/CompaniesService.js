const { nanoid } = require('nanoid');
const pool = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class CompaniesService {
  async addCompany({ name, location, description }) {
    const id = `company-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO companies(id, name, location, description) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, location, description || null],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Perusahaan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getCompanies() {
    const result = await pool.query('SELECT id, name, location, description FROM companies ORDER BY created_at ASC');
    return result.rows;
  }

  async getCompanyById(id) {
    const query = {
      text: 'SELECT id, name, location, description FROM companies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Perusahaan tidak ditemukan');
    }

    return result.rows[0];
  }

  async editCompanyById(id, { name, location, description }) {
    const current = await this.getCompanyById(id);

    const updatedName = name !== undefined ? name : current.name;
    const updatedLocation = location !== undefined ? location : current.location;
    const updatedDescription = description !== undefined ? description : current.description;

    const query = {
      text: 'UPDATE companies SET name = $1, location = $2, description = $3, updated_at = NOW() WHERE id = $4 RETURNING id',
      values: [updatedName, updatedLocation, updatedDescription, id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui perusahaan. Id tidak ditemukan');
    }
  }

  async deleteCompanyById(id) {
    const query = {
      text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Perusahaan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = CompaniesService;
