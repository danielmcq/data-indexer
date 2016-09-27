export interface File {
	buffer: Buffer,
	path: String,
	type: MimeType,
	md5: String,
	sha1: String,
	meta?: Object
}