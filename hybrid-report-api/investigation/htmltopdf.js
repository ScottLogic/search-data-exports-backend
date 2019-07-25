const pdf = require("html-pdf"); // npm package being used
const pdfTemplate = require("./htmlbase"); // Base template for PDF
const svgString = require(`./svg`); // This mocks the inputted SVG string we would be using.
const tableData = [
  { tag: "#CoolTag", count: 15 },
  { tag: "#PopularTag", count: 10 },
  { tag: "#SemiPopular", count: 4 },
  { tag: "#NotPopular", count: 2 }
]; // Mock of example data for the table generation

const outputFile = `./investigation/html-pdf.pdf`;
const textInformation = `You can even insert random text from the calling device.`; // Extra text which can be inputted
const pdfOptions = {
  format: "A4",
  orientation: "portrait",
  border: "10"
};

console.log(`Testing HTML to PDF Generation`);
// Please Note: This doesnt handle its async process well / at all. when converted into a class all methods will need to be async.

pdf
  .create(pdfTemplate({ svgString, textInformation, tableData }), pdfOptions)
  .toFile(outputFile, (err, res) => {
    console.log(`Error`, err);
    console.log(`Result`, res);
  });
// .toFile is for testing purposes only. when as a lambda this can return a stream which can be fed into S3.

console.log(`Done`);
