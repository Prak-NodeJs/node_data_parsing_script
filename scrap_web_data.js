const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// iterate over each parent element and fetch the text and image (recursive funtion)
const extractData = (element,content = '') => {
    element.children.forEach(child => {
        if (child.type === 'text') {
            const text = child.data.trim();
            if (text) {
                content += text + ' ';
            }
        }

        // Handle element nodes
        if (child.type === 'tag') {
            const tagName = child.name;

            if (tagName === 'img' && child.attribs.src) {
                const imgSrc = child.attribs.src;
                content += `[Image: ${imgSrc}] `;
            }

            if (child.children && child.children.length > 0) {
                content = extractData(child, content);
            }
        }
    });

    return content;
}

// Function to start scraping
const scrap = async () => {
       try {
        const result = await axios.get(url);
        const $ = cheerio.load(result.data);
        const body = $('body');

        let extractedContent = extractData(body[0], '');
        
        // Write extracted content to file
        fs.writeFileSync('extracted_content.txt', extractedContent.trim());
        console.log('Content extracted successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Start scraping
let url = 'https://mobeserv.com/';
url ='https://nikujais.medium.com/web-scraping-using-express-and-node-js-df881b6e4ed1'
scrap(url);
