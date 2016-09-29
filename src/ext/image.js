"use strict"

const ExifImage = require("exif").ExifImage

exports.isImage = file => file.type.split("/")[0] === "image"

exports.parse = file => new Promise((resolve, reject)=>{
	try {
		new ExifImage({image: file.buffer},(exifErr, exifData)=>{
			// No exif data found
			if (exifErr) return resolve(file)

			file.meta.exif = exifData

			resolve(file)
		})
	} catch (unkExifErr) {
		reject(unkExifErr)
	}
})