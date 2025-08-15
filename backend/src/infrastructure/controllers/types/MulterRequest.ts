import { Request } from 'express';
import { Readable } from 'stream';

export interface MulterRequest extends Request {
  file?: {
    buffer: Buffer;
    originalname: string;
    fieldname: string;
    encoding: string;
    mimetype: string;
    size: number;
    stream: Readable;
    destination: string;
    filename: string;
    path: string;
  };
}
