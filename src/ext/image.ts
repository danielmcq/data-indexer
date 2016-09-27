"use strict"

import { File } from "../interfaces/File"

const ExifImage = require("exif").ExifImage

exports.isImage = (mimeType: string) => mimeType.split("/")[0] === "image"

exports.parse = (file: File) => new Promise((resolve, reject)=>{
	try {
		new ExifImage({image: file.buffer},(exifErr: Object, exifData: Object)=>{
			// No exif data found
			if (exifErr) return resolve(file.data)

			resolve(Object.assign({}, file.data, {exif: exifData}))
		})
	} catch (unkExifErr) {
		reject(unkExifErr)
	}
})