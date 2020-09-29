// Utilizado para configuração de caminhos pelo nodejs
import path from 'path';
// Configurações de upload
import multer from 'multer';

import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  // Para acessar o caminho em outros arquivos
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  // Armazenamento em disco local
  storage: multer.diskStorage({
    //__dirname - caminho completo até o arquivo em uso
    destination: tmpFolder,

    // nome que o arquivo vai receber
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;
      //Necessário no multer
      return callback(null, fileName);
    }
  }),
};
