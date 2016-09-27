"use strict"

const inputFile = process.argv[2]

const crypto = require("crypto")
const fs     = require("fs")
const path   = require("path")
const mmm    = require("mmmagic")
const Magic  = mmm.Magic

const printData = require("./src/util/printData")
const audio = require("./src/ext/audio")
const flac = require("./src/ext/flac")
const image = require("./src/ext/image")

const magic = new Magic(mmm.MAGIC_MIME_TYPE)

const FILE_NAME = path.resolve(inputFile)

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
}).then(printData, console.error)