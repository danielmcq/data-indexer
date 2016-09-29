"use strict"

const musicmetadata = require("musicmetadata")
const jsmediatags   = require("jsmediatags")

exports.isAudio = file => file.type.split("/")[0] === "audio"

exports.parse = file => new Promise((resolve, reject)=>{
	/*musicmetadata(fs.createReadStream(file.path), (id3Err, metadata)=>{
		if (id3Err) return resolve(file)

		file.meta.audioMeta = metadata
		resolve(file)
	})*/
	jsmediatags.read(file.buffer, {
		onSuccess: tag => resolve(file.meta.audioMeta = tag && file),
		onError: tagErr => resolve(file)
	})
})