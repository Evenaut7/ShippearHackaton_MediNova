// src/config/multer.ts
import multer from 'multer';
import fs from 'fs';
import path from 'path';
// Asegurarnos de que el directorio temporal exista al arrancar
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Guardamos en la carpeta /uploads
    },
    filename: (req, file, cb) => {
        // Generamos un nombre único: timestamp + sufijo aleatorio + extensión original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname) || '';
        cb(null, `audio-${uniqueSuffix}${ext}`);
    }
});
// Exportamos el middleware listo para usar
export const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // Límite opcional: 50MB por audio
    }
});
