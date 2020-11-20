import { Request } from 'express';
import { mkdir } from 'fs';
import multer, { DiskStorageOptions } from 'multer';

export class Storage {
	initStorage() {
		var options: DiskStorageOptions = {
			destination: (req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
				const dir = './uploads/';
				mkdir(dir, (err) => {
					cb(err, dir);
				});
			},
			filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
				cb(null, file.originalname);
			},
		};

		const storage = multer.diskStorage(options);
	}
}
