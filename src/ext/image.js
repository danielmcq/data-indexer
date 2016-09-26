"use strict"

const ExifImage = require("exif").ExifImage

exports.isImage = mimeType => mimeType.split("/")[0] === "image"

exports.parse = file => new Promise((resolve, reject)=>{
	try {
		new ExifImage({image: file.fileBuffer},(exifErr, exifData)=>{
			// No exif data found
			if (exifErr) return resolve(file.fileData)

			resolve(Object.assign({}, file.fileData, {exif: exifData}))
		})
	} catch (unkExifErr) {
		reject(unkExifErr)
	}
})