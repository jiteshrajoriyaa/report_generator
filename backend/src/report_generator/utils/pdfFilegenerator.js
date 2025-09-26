const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

async function generatePDF(htmlContent, filename){
    const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
});
    const page = await browser.newPage();

    await page.setContent(htmlContent, {waitUntil: 'networkidle0'})

    const reportDir = path.join(__dirname, '../../reports');
    if(!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true })
    
    const filePath = path.join(reportDir, filename)

    await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: {top: '20px', bottom: '20px', left: '20px', right: '20px'}
    })

    await browser.close();
    return filePath;
}

module.exports = generatePDF;