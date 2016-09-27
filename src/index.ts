"use strict"

const inputFile = process.argv[2]

const parseFile = require("./src/util/parseFile")
const printData = require("./src/util/printData")

parseFile(inputFile).then(printData, console.error)