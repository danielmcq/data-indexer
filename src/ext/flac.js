const metaflac = require("metaflac")

exports.MIME_TYPE = "audio/x-flac"
exports.default = file=>new Promise((resolve, reject)=>{
	metaflac.list([["exceptBlockType","SEEKTABLE"],["exceptBlockType","PICTURE"]], file.FILE_NAME, (flacErr, metadataBlocks)=>{
		if (flacErr) return resolve(file.fileData)

		metaflac.showMD5sum({}, file.FILE_NAME, (flacMd5Err, flacMd5sum)=>{
			if (flacMd5Err) return resolve(file.fileData)

			resolve(Object.assign({}, file.fileData, {metaFlacMd5: flacMd5sum, metaFlac: metadataBlocks}))
		})
	})
})