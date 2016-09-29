module.exports = data => {
	let printData = Object.assign({}, data)

	delete printData.buffer

	console.log(JSON.stringify(printData, null, "\t"))
}