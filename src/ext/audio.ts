"use strict"

const musicmetadata = require("musicmetadata")
const jsmediatags   = require("jsmediatags")

exports.isAudio = mimeType => mimeType.split("/")[0] === "audio"

exports.parse = file => new Promise((resolve, reject)=>{
	/*musicmetadata(fs.createReadStream(file.FILE_NAME), (id3Err, metadata)=>{
		if (id3Err) return resolve(file.fileData)

		resolve(Object.assign({}, file.fileData, {audioMeta: metadata}))
	})*/
	jsmediatags.read(file.fileBuffer, {
		onSuccess: tag => resolve(Object.assign({}, file.fileData, {audioMeta: tag})),
		onError: tagErr => resolve(file.fileData)
	})
})