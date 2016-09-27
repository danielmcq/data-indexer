"use strict"

const inputFile = process.argv[2]

const crypto        = require("crypto")
const fs            = require("fs")
const path          = require("path")
const mmm           = require("mmmagic")
const Magic         = mmm.Magic
const musicmetadata = require("musicmetadata")
const jsmediatags   = require("jsmediatags")

const printData = require("./src/util/printData")
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
}).then(printData, console.error)