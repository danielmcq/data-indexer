"use strict"

const metaflac = require("metaflac")

import { File } from "../interfaces/File"

exports.isFlac = (mimeType: string) => mimeType === "audio/x-flac"

exports.parse = (file: File) => new Promise((resolve, reject)=>{
	metaflac.list([["exceptBlockType","SEEKTABLE"],["exceptBlockType","PICTURE"]], file.fname, (flacErr: Object, metadataBlocks: Object)=>{
		if (flacErr) return resolve(file.data)

		metaflac.showMD5sum({}, file.fname, (flacMd5Err: Object, flacMd5sum: Object)=>{
			if (flacMd5Err) return resolve(file.data)

			resolve(Object.assign({}, file.data, {metaFlacMd5: flacMd5sum, metaFlac: metadataBlocks}))
		})
	})
})