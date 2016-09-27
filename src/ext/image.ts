"use strict"

import { File } from "../interfaces/File"

const ExifImage = require("exif").ExifImage

exports.isImage = (mimeType: string) => mimeType.split("/")[0] === "image"

exports.parse = (file: File) => new Promise((resolve: Function, reject: Function)=>{
	try {
		new ExifImage({image: file.buffer},(exifErr: Error, exifData: Object)=>{
			// No exif data found
			if (exifErr) return resolve(file.meta)

			resolve(Object.assign({}, file.meta, {exif: exifData}))
		})
	} catch (unkExifErr) {
		reject(unkExifErr)
	}
})