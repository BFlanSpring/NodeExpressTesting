const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function downloadPage(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(`Couldn't download ${url}`);
    return null;
  }
}

async function saveHTMLToFile(url, htmlContent) {
  const hostname = new URL(url).hostname;
  const filename = `${hostname}.txt`;
  const filePath = path.join(__dirname, filename);

  try {
    await fs.promises.writeFile(filePath, htmlContent);
    console.log(`Wrote to ${hostname}`);
  } catch (error) {
    console.error(`Couldn't write to ${hostname}`);
  }
}

async function processURLs(file) {
  try {
    const data = await fs.promises.readFile(file, 'utf-8');
    const urls = data.split('\n').filter(url => url.trim() !== '');

    const requests = urls.map(async (url) => {
      const htmlContent = await downloadPage(url);
      if (htmlContent) {
        await saveHTMLToFile(url, htmlContent);
      }
    });

    await Promise.all(requests);
  } catch (error) {
    console.error(`Couldn't read the original file ${file}`);
    process.exit(1);
  }
}

// Command line argument handling
if (process.argv.length !== 3) {
  console.error('Usage: node urls.js FILENAME');
  process.exit(1);
}

const fileName = process.argv[2];
processURLs(fileName);