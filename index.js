"use strict"



const crypto = require("crypto")
const fs = require("fs")
const mmm = require("mmmagic")
const Magic = mmm.Magic
const ExifImage = require("exif").ExifImage
const musicmetadata = require("musicmetadata")
const jsmediatags = require("jsmediatags")

const magic = new Magic(mmm.MAGIC_MIME_TYPE)

new Promise((resolve, reject)=>{
	fs.readFile(FILE_NAME, (fsErr, fileBuffer)=>{
		if (fsErr) return reject(fsErr)

		magic.detect(fileBuffer, (err, fileType)=>{
			if (err) return reject(err)

			const fileData = {
				path: FILE_NAME,
				type: fileType,
				md5: crypto.createHash("md5").update(fileBuffer).digest("hex"),
				sha1: crypto.createHash("sha1").update(fileBuffer).digest("hex")
			}

			if (fileType.split("/")[0] === "image") {
				try {
					new ExifImage({image: fileBuffer},(exifErr, exifData)=>{
						// No exif data found
						if (exifErr) return resolve(fileData)

						resolve(Object.assign({}, fileData, {exif: exifData}))
					})
				} catch (unkExifErr) {
					reject(unkExifErr)
				}
			} else if (fileType.split("/")[0] === "audio") {
				/*musicmetadata(fs.createReadStream(FILE_NAME), (id3Err, metadata)=>{
					if (id3Err) return resolve(fileData)

					resolve(Object.assign({}, fileData, {audioMeta: metadata}))
				})*/
				jsmediatags.read(fileBuffer, {
					onSuccess: tag => resolve(Object.assign({}, fileData, {audioMeta: tag})),
					onError: tagErr => resolve(fileData)
				})
			} else {
				resolve(fileData)
			}
		})
	})
}).then(res=>console.log(JSON.stringify(res, null, "\t")), console.error)
