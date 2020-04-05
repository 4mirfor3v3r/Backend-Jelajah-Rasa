const url = 'mongodb://localhost:27017/dbJelajahRasa';
const GridFsStorage = require('multer-gridfs-storage')
const multer = require('multer')
const crypto = require('crypto');

const storage = new GridFsStorage({
	url: url,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				var str = file.originalname.replace(/\s+/g, '');
				const filename = `${Date.now()}-${Math.floor(Math.random() * 100)}-${str}`;
				const fileInfo = {
					filename: filename,
					bucketName: 'itemphotos',
				};
				resolve(fileInfo);
			});
		});
	},
});

module.exports = upload = multer({ storage });
