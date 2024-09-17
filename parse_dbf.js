const { DBFFile } = require('dbffile');
const XLSX = require('xlsx');
const path = require('path')
const fs = require('fs')

const convertDbfToExcelAndCsv = async (dbfInputFilePath) => {
    try {
        if(!dbfInputFilePath.endsWith('.dbf')){
            console.log('Only .dbf file is allowed')
            return 
        }
        const dbf = await DBFFile.open(dbfInputFilePath);
        console.log(`DBF file contains ${dbf.recordCount} records.`);

        // Prepare to collect all records
        const records = [];

        // Iterate over each record in the DBF file
        for await (const record of dbf) {
            records.push(record);
        }

        //construct dyanmic result folder for json and excel file.
        const basename = path.basename(dbfInputFilePath, path.extname(dbfInputFilePath));
        const resultFolder = path.join(path.dirname(dbfInputFilePath), basename);
    
        // Create the result folder if it doesn't exist
        if (!fs.existsSync(resultFolder)) {
          fs.mkdirSync(resultFolder, { recursive: true });
        }
    
        // Define file paths
        const jsonFilePath = path.join(resultFolder, `${basename}.json`);
        const excelFilePath = path.join(resultFolder, `${basename}.xlsx`);

        writeJSONFile(records, jsonFilePath)
        writeXLSXFile(records, excelFilePath);

        console.log('CSV and Excel files created successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
}

const writeJSONFile = (records, filePath) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
        console.log(`JSON file written to ${filePath}`);
    } catch (error) {
        console.error('Error writing records to JSON file:', error);
        throw error
    }
};

const writeXLSXFile = (records, filePath) => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(records);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Records');
        XLSX.writeFile(workbook, filePath);
        console.log(`Excel file written to ${filePath}`);
    } catch (error) {
        console.log(`Error while writing records to excel file`, error)
        throw error
    }

}

// Execute the read and write process
const dbfInputFilePath = 'karvy.dbf'

convertDbfToExcelAndCsv(dbfInputFilePath);





