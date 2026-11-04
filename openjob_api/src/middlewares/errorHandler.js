const ClientError = require('../exceptions/ClientError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'failed',
      message: 'Missing or invalid authentication token',
    });
  }

  if (err.code === '23505') {
    return res.status(400).json({
      status: 'failed',
      message: 'Data dengan atribut unik tersebut sudah ada',
    });
  }

  if (err.code === '23503') {
    return res.status(404).json({
      status: 'failed',
      message: 'Resource yang direferensikan tidak ditemukan',
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'failed',
      message: 'Format payload JSON tidak valid',
    });
  }

  console.error(err);
  return res.status(500).json({
    status: 'failed',
    message: 'Terjadi kegagalan pada server kami',
  });
};

module.exports = errorHandler;
