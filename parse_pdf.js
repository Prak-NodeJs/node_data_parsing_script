const fs = require('fs');
const path = require('path');
const { PdfReader } = require('pdfreader');

const convertPdfToText = async (pdfPath, password = '') => {
    if(!pdfPath.endsWith('.pdf')){
        console.log('Only pdf file is allowed')
        return
    }
    const basename = path.basename(pdfPath, path.extname(pdfPath));
    const outputFilePath = basename+'.txt'
    let rows = {};
    let currentPage = null;
    let allText= ''
    const flushRows = () => {
        if (currentPage !== null) {
            const pageText = Object.keys(rows)
                .sort((y1, y2) => parseFloat(y1) - parseFloat(y2))
                .map(y => (rows[y] || []).join(""))
                .join("\n");
            
            // fs.writeFileSync(path.join(folderName, `page-${currentPage}.txt`), pageText);
            allText +=`\n\n  ${pageText}`;
            rows = {};
        }
    };

    new PdfReader({ password: password || '' }).parseFileItems(pdfPath, (err, item) => {
        if (err) {
            console.error(`Error while parsing the pdf`, err);
        } else if (!item) {
            flushRows();
            fs.writeFileSync(outputFilePath, allText);
            console.log("END OF FILE");
        }
        else if (item.page) {
            flushRows();
            currentPage = item.page;
            console.log("PAGE:", item.page);
        } else if (item.text) {
            (rows[item.y] = rows[item.y] || []).push(item.text);
        }
    });
};

// Call the function with your PDF file
const inputFilePath = 'nifty-50-whitepaper-2024_0.pdf'
const password = 'pass123'
convertPdfToText(inputFilePath, password);

// https://www.nseindia.com/products/content/gi/FTSE_brochure.pdf
// https://nsearchives.nseindia.com/web/sites/default/files/inline-files/nifty-50-whitepaper-2024_0.pdf