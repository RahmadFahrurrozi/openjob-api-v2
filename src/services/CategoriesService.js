const { nanoid } = require('nanoid');
const pool = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class CategoriesService {
  async addCategory({ name, description }) {
    const id = `category-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO categories(id, name, description) VALUES($1, $2, $3) RETURNING id',
      values: [id, name, description || null],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Kategori gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getCategories() {
    const result = await pool.query('SELECT id, name, description FROM categories ORDER BY created_at ASC');
    return result.rows;
  }

  async getCategoryById(id) {
    const query = {
      text: 'SELECT id, name, description FROM categories WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }

    return result.rows[0];
  }

  async editCategoryById(id, { name, description }) {
    const current = await this.getCategoryById(id);

    const updatedName = name !== undefined ? name : current.name;
    const updatedDescription = description !== undefined ? description : current.description;

    const query = {
      text: 'UPDATE categories SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING id',
      values: [updatedName, updatedDescription, id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui kategori. Id tidak ditemukan');
    }
  }

  async deleteCategoryById(id) {
    const query = {
      text: 'DELETE FROM categories WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kategori gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = CategoriesService;
