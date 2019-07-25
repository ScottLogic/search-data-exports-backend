const svgString = require(`./svg`); // This mocks the inputted SVG string we would be using.
const tableData = [
  { tag: "tagName", count: 10 },
  { tag: "Tag2", count: 4 },
  { tag: "Tag3", count: 2 }
]; // Mock of example data for the table generation

// Code beings
const pdf = require("html-pdf"); // npm package being used

const pdfTemplate = require("./htmlbase"); // Base template for PDF
const outputFile = `./investigation/html-pdf.pdf`;
const textInformation = `You can even insert random text from the calling device.`; // Extra text which can be inputted
const pdfOptions = {
  format: "A4",
  orientation: "portrait",
  border: "10"
};

console.log(`Testing HTML to PDF Generation`);

const r = pdf
  .create(pdfTemplate({ svgString, textInformation, tableData }), pdfOptions)
  .toFile(outputFile, (err, res) => {
    console.log(`Error`, err);
    console.log(`Result`, res);
  });

console.log(`Done`, r);
