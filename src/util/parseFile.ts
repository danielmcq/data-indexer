"use strict"

import * as crypto from "crypto"
import * as fs     from "fs"
import * as path   from "path"

import { File } from "../interfaces/File"

const mmm = require("mmmagic")

const audio = require("../ext/audio")
const flac  = require("../ext/flac")
const image = require("../ext/image")

const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE)

module.exports = (fileName: string) => new Promise((resolve: Function, reject: Function)=>{
	const FILE_NAME = path.resolve(fileName)

	fs.readFile(FILE_NAME, (fsErr: Error, fileBuffer: Buffer)=>{
		if (fsErr) return reject(fsErr)

		magic.detect(fileBuffer, (err: Error, fileType: MimeType)=>{
			if (err) return reject(err)

			const file = <File>{
				path: FILE_NAME,
				type: fileType,
				buffer: fileBuffer,
				md5: crypto.createHash("md5").update(fileBuffer).digest("hex"),
				sha1: crypto.createHash("sha1").update(fileBuffer).digest("hex")
			}

			if ( image.isImage(fileType) ) {
				image.parse(file).then(resolve, reject)
			} else if (flac.isFlac(fileType)) {
				flac.parse(file).then(resolve, reject)
			} else if (audio.isAudio(fileType)) {
				audio.parse(file).then(resolve, reject)
			} else {
				resolve(file)
			}
		})
	})
})