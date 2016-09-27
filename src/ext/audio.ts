"use strict"

import { File } from "../interfaces/File"

const musicmetadata = require("musicmetadata")
const jsmediatags   = require("jsmediatags")

exports.isAudio = (mimeType: string) => mimeType.split("/")[0] === "audio"

exports.parse = (file: File) => new Promise((resolve: Function, reject: Function)=>{
	/*musicmetadata(fs.createReadStream(file.fname), (id3Err: Object, metadata: Object)=>{
		if (id3Err) return resolve(file.meta)

		resolve(Object.assign({}, file.meta, {audioMeta: metadata}))
	})*/
	jsmediatags.read(file.buffer, {
		onSuccess: (tag: Object) => resolve(Object.assign({}, file.meta, {audioMeta: tag})),
		onError: (tagErr: Object) => resolve(file.meta)
	})
})