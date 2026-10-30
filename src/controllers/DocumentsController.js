const path = require('path');
const fs = require('fs');
const NotFoundError = require('../exceptions/NotFoundError');

class DocumentsController {
  constructor(documentsService) {
    this._documentsService = documentsService;

    this.postDocumentHandler = this.postDocumentHandler.bind(this);
    this.getDocumentsHandler = this.getDocumentsHandler.bind(this);
    this.getDocumentByIdHandler = this.getDocumentByIdHandler.bind(this);
    this.deleteDocumentByIdHandler = this.deleteDocumentByIdHandler.bind(this);
  }

  /**
   * Handle document upload request (POST /documents).
   */
  async postDocumentHandler(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { filename, originalname, size } = req.file;

      const document = await this._documentsService.addDocument({
        userId,
        filename,
        originalName: originalname,
        size,
      });

      return res.status(201).json({
        status: 'success',
        message: 'Dokumen berhasil diunggah',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle retrieve all documents request (GET /documents).
   */
  async getDocumentsHandler(req, res, next) {
    try {
      const documents = await this._documentsService.getDocuments();

      return res.status(200).json({
        status: 'success',
        data: {
          documents,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle view/download document by ID (GET /documents/:id).
   * Delivers physical PDF file with required Content-Type and Content-Disposition headers.
   */
  async getDocumentByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const document = await this._documentsService.getDocumentById(id);

      const filePath = path.resolve(
        __dirname,
        '../../uploads/documents',
        document.filename
      );

      if (!fs.existsSync(filePath)) {
        throw new NotFoundError('Berkas fisik dokumen tidak ditemukan');
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${document.original_name}"`
      );

      return res.sendFile(filePath);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle delete document request (DELETE /documents/:id).
   */
  async deleteDocumentByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._documentsService.deleteDocumentById(id);

      return res.status(200).json({
        status: 'success',
        message: 'Dokumen berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DocumentsController;

