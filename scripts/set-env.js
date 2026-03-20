const fs = require("fs");
const path = require("path");

const apiBaseUrl = process.env.API_BASE_URL;
if (!apiBaseUrl) {
  console.warn("[set-env] WARNING: API_BASE_URL is not set, placeholder will remain.");
}

const envFilePath = path.join(__dirname, "..", "src", "environments", "environment.ts");
let content = fs.readFileSync(envFilePath, "utf8");
content = content.replace("__API_BASE_URL__", apiBaseUrl || "");
fs.writeFileSync(envFilePath, content);

console.log(`[set-env] API_BASE_URL set to: ${apiBaseUrl || "(empty)"}`);
