const assessmentData = require('./data/data');
const generatePDF = require('./utils/pdfFilegenerator');
const handlebars = require('handlebars');
const getValue = require('./utils/getValue');
const loadConfig = require('./utils/loadConfig');
const fs = require('fs');
const path = require('path');
const { Router } = require('express')
const router = Router()


// Register Handlebars helper
// Replace your existing lookupValue helper with this:
handlebars.registerHelper('lookupValue', (field, record) => {
    try {
        if (!record || !field?.jsonPath) return 'N/A';
        const rawValue = getValue(record, field.jsonPath);

        if (rawValue === undefined || rawValue === null) return 'N/A';

        // Check if field has classifications
        if (field.classifications && field.classifications.length > 0) {
            const numValue = parseFloat(rawValue);
            if (!isNaN(numValue)) {
                const classification = field.classifications.find(c =>
                    numValue >= c.min && numValue < c.max
                );
                if (classification) {
                    return `${rawValue} (${classification.label})`;
                }
            }
        }

        return String(rawValue);
    } catch (err) {
        console.error('Error getting value for path:', field.jsonPath, err);
        return 'N/A';
    }
});

// Add helper to get classification class
handlebars.registerHelper('getClassification', (field, record) => {
    try {
        if (!record || !field?.jsonPath || !field.classifications) return '';

        const rawValue = getValue(record, field.jsonPath);
        if (rawValue === undefined || rawValue === null) return '';

        const numValue = parseFloat(rawValue);
        if (!isNaN(numValue)) {
            const classification = field.classifications.find(c =>
                numValue >= c.min && numValue < c.max
            );
            return classification ? classification.class : '';
        }
        return '';
    } catch (err) {
        return '';
    }
});

handlebars.registerHelper('contains', (str, substring) => {
    return str && str.includes(substring);
});

handlebars.registerHelper('currentDate', () => {
    return new Date().toLocaleDateString();
});

router.get('/generate-report', async (req, res) => {
    const { session_id } = req.query;

    if (!session_id) {
        return res.status(400).json({ msg: "session_id is required" });
    }

    const record = assessmentData.find(r => r.session_id === session_id);
    if (!record) {
        return res.status(404).json({ msg: "record not found" });
    }

    try {
        // Load config and template
        const config = loadConfig(record.assessment_id);
        const templatePath = path.join(__dirname, "templates", "report.handlebars");
        const templateHtml = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(templateHtml);

        // Render HTML
        const html = template({ sections: config.sections, record });

        // Generate PDF
        const filename = `${session_id}_${record.assessment_id}.pdf`;
        const pdfPath = await generatePDF(html, filename);

        res.json({ success: true, msg: "PDF generated", pdfPath, filename });
    } catch (e) {
        res.status(500).json({ msg: "PDF generation failed", error: e.message });
    }
});

router.get("/download/:filename", (req, res) => {
    const filePath = path.join(__dirname, "reports", req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send("File not found");
        }
    });
});

module.exports = router