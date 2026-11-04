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
