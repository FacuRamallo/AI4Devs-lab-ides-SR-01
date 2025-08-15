export interface IFileStorage {
  /**
   * Uploads a file to the storage service and returns the URL of the uploaded file.
   * @param file - The file buffer to upload.
   * @param path - The path where the file should be stored.
   * @returns A promise that resolves to the URL of the uploaded file.
   */
  upload(file: Buffer, path: string): Promise<string>;
}
