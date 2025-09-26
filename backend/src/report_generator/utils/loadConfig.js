const fs = require("fs");
const path = require("path");

function loadConfig(assessment_id) {
    const configPath = path.join(__dirname, "../configs", `${assessment_id}.json`);
    
    if (!fs.existsSync(configPath)) {
        throw new Error(`Config not found for ${assessment_id}`);
    }
    
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

module.exports = loadConfig;