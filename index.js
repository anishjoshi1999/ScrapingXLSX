const XLSX = require("xlsx");
const fs = require("fs");
const { scrapeEmail } = require("./scraping");

// Specify the path to your XLSX file
const filePath = "./myfile.xlsx";

// Read the XLSX file
const workbook = XLSX.readFile(filePath);

// Assuming your data is in the first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert the sheet data to JSON
const jsonData = XLSX.utils.sheet_to_json(sheet);

// Process the data
async function processData() {
  for (let i = 0; i < jsonData.length; i++) {
    const title = jsonData[i].Title;
    const location = jsonData[i].Location;
    const url = jsonData[i].URL;
    try {
      const { Email, Contact } = await scrapeEmail(url);
      jsonData[i].Email = Email;
      jsonData[i].Contact = Contact;
      // Now you can do whatever you want with the data
      console.log(
        `Title: ${title}, Email: ${Email}, Contact: ${Contact}, Location: ${location}, URL: ${url}`
      );
      // Update the XLSX file with the modified data
      const updatedSheet = XLSX.utils.json_to_sheet(jsonData);
      workbook.Sheets[sheetName] = updatedSheet;

      XLSX.writeFile(workbook, filePath);
      console.log(`${i + 1} Record updated successfully`);
    } catch (error) {
      console.error(`Error processing data for URL: ${url}`, error);
    }
  }
  console.log("Scraping Successfuly");
}
processData();
