"use strict"

const crypto = require("crypto")
const fs     = require("fs")
const path   = require("path")
const mmm    = require("mmmagic")

const audio = require("../ext/audio")
const flac = require("../ext/flac")
const image = require("../ext/image")

const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE)

module.exports = fileName => new Promise((resolve, reject)=>{
	const FILE_NAME = path.resolve(fileName)

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

			if ( image.isImage(fileType) ) {
				image.parse({fileBuffer: fileBuffer, fileData: fileData}).then(resolve, reject)
			} else if (flac.isFlac(fileType)) {
				flac.parse({FILE_NAME:FILE_NAME, fileData: fileData}).then(resolve, reject)
			} else if (audio.isAudio(fileType)) {
				audio.parse({FILE_NAME:FILE_NAME, fileData: fileData, fileBuffer: fileBuffer}).then(resolve, reject)
			} else {
				resolve(fileData)
			}
		})
	})
})