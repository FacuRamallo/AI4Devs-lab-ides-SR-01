import { Response } from 'express';
import multer from 'multer';
import { UploadCvUseCase } from '@application/UploadCv.usecase.js';
import { CandidateId } from '@domain/value-objects/CandidateId.vo.js';
import { MulterRequest } from '@infrastructure/controllers/types/MulterRequest.js';

export class UploadCandidateCvController {
  private static instance: UploadCandidateCvController;
  private upload = multer();

  private constructor(private readonly uploadCvUseCase: UploadCvUseCase) {}

  static getInstance(uploadCvUseCase: UploadCvUseCase): UploadCandidateCvController {
    if (!UploadCandidateCvController.instance) {
      UploadCandidateCvController.instance = new UploadCandidateCvController(uploadCvUseCase);
    }
    return UploadCandidateCvController.instance;
  }

  async handle(req: MulterRequest, res: Response): Promise<Response> {
    const { candidateId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    try {
      const { buffer: fileBuffer } = file;
      const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);

      const buffer = Buffer.from(arrayBuffer);

      const candidateIdObj = CandidateId.from(candidateId);
      const result = await this.uploadCvUseCase.execute(candidateIdObj, buffer);

      return res.status(200).json({ message: 'CV uploaded successfully', url: result });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(500).json({ error: errorMessage });
    }
  }
}
