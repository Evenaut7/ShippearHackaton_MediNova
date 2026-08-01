// src/services/MediaService.ts
import ffmpeg from 'fluent-ffmpeg';
export class MediaService {
    static async convertToWav(inputPath, outputPath) {
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat('wav')
                .audioFrequency(16000)
                .audioChannels(1)
                .on('end', () => resolve(outputPath))
                .on('error', (err) => reject(err))
                .save(outputPath);
        });
    }
}
