"use strict"

const inputFile = process.argv[2]

const parseFile = require("./util/parseFile")
const printData = require("./util/printData")

parseFile(inputFile).then(printData, console.error)