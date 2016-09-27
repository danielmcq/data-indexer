"use strict"

const metaflac = require("metaflac")

import { File } from "../interfaces/File"

exports.isFlac = (mimeType: string) => mimeType === "audio/x-flac"

exports.parse = (file: File) => new Promise((resolve: Function, reject: Function)=>{
	metaflac.list([["exceptBlockType","SEEKTABLE"],["exceptBlockType","PICTURE"]], file.path, (flacErr: Error, metadataBlocks: Object)=>{
		if (flacErr) return resolve(file.meta)

		metaflac.showMD5sum({}, file.path, (flacMd5Err: Error, flacMd5sum: Object)=>{
			if (flacMd5Err) return resolve(file.meta)

			resolve(Object.assign({}, file.meta, {metaFlacMd5: flacMd5sum, metaFlac: metadataBlocks}))
		})
	})
})