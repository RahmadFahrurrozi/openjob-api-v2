const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class DocumentsService {
  /**
   * Save uploaded document metadata into the database.
   */
  async addDocument({ userId, filename, originalName, size }) {
    const id = `document-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO documents(id, user_id, filename, original_name, size) VALUES($1, $2, $3, $4, $5) RETURNING id, filename, original_name, size',
      values: [id, userId, filename, originalName, size],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Dokumen gagal ditambahkan');
    }

    return {
      documentId: result.rows[0].id,
      filename: result.rows[0].filename,
      originalName: result.rows[0].original_name,
      size: Number(result.rows[0].size),
    };
  }

  /**
   * Retrieve all uploaded documents.
   */
  async getDocuments() {
    const result = await pool.query(
      'SELECT id, user_id, filename, original_name, size, created_at, updated_at FROM documents ORDER BY created_at DESC'
    );
    return result.rows;
  }

  /**
   * Retrieve single document metadata by id.
   */
  async getDocumentById(id) {
    const query = {
      text: 'SELECT id, user_id, filename, original_name, size FROM documents WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Dokumen tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   * Delete document metadata from database and unlink physical file from disk.
   */
  async deleteDocumentById(id) {
    const document = await this.getDocumentById(id);

    const query = {
      text: 'DELETE FROM documents WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Dokumen gagal dihapus. Id tidak ditemukan');
    }

    // Delete physical file from disk
    const filePath = path.resolve(
      __dirname,
      '../../uploads/documents',
      document.filename
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = DocumentsService;
