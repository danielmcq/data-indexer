"use strict"

const metaflac = require("metaflac")

exports.isFlac = file => file.type === "audio/x-flac"

exports.parse = file => new Promise((resolve, reject)=>{
	metaflac.list([["exceptBlockType","SEEKTABLE"],["exceptBlockType","PICTURE"]], file.path, (flacErr, metadataBlocks)=>{
		if (flacErr) return resolve(file)

		/*metaflac.showMD5sum({}, file.path, (flacMd5Err, flacMd5sum)=>{
			if (flacMd5Err) return resolve(file)

			Object.assign(file.meta, {metaFlacMd5: flacMd5sum, metaFlac: metadataBlocks})

			resolve(file)
		})*/
resolve(file)
	})
})