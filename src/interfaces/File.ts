export interface File {
	buffer: Buffer,
	path: String,
	type: String,
	md5: String,
	sha1: String,
	meta?: Object
}