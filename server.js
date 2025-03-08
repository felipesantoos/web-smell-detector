const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

// Middleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer to use memory storage (files are kept in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Utility function to read uploaded files (from multer)
function readFilesFromUpload(files) {
  return files.map(file => file.buffer.toString('utf-8'));
}

/**
 * Detector: Find Untitled Features
 * A feature is “untitled” if its line matches "Feature:" with no title following.
 *
 * @param {string[]} filenames - Array of feature file names.
 * @param {string[]} fileContents - Array of feature file contents.
 * @returns {Array} Array of result objects with filename, lineNumber, and matchedLine.
 */
function findUntitledFeatures(filenames, fileContents) {
  // Regular expression: "Feature:" followed only by whitespace until end-of-line
  const pattern = /^Feature:\s*$/;
  const results = [];

  filenames.forEach((filename, idx) => {
    const lines = fileContents[idx].split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) {
        // Mimic Python's lstrip() by removing only leading whitespace
        const matchedLine = lines[i].replace(/^\s+/, '');
        results.push({
          filename,
          lineNumber: i + 1,
          matchedLine
        });
        break; // stop after the first match per file
      }
    }
  });
  return results;
}

/**
 * Detector: Find Duplicate Feature Titles (Advanced)
 * This function extracts the first line starting with "Feature:" from each file,
 * groups them by title, counts the occurrences, and returns overall totals along
 * with a report of duplicate features.
 *
 * The returned object has the following structure:
 * {
 *   totalFeatures: <number>,
 *   totalDistinctFeatures: <number>,
 *   reportData: [
 *     { feature: <string>, count: <number>, filenames: <string> },
 *     ...
 *   ]
 * }
 *
 * @param {string[]} filenames - Array of feature file names.
 * @param {string[]} fileContents - Array of feature file contents.
 * @returns {Object} The analysis result.
 */
function findDuplicateFeatureTitlesAdvanced(filenames, fileContents) {
  // Pattern to extract feature line (using MULTILINE mode)
  const pattern = /Feature:.*$/m;
  const features = [];

  filenames.forEach((filename, idx) => {
    const file = fileContents[idx];
    const match = file.match(pattern);
    if (match) {
      features.push({ feature: match[0].trim(), filename });
    }
  });

  const totalFeatures = features.length;
  const distinctFeatures = {};
  features.forEach(({ feature, filename }) => {
    if (distinctFeatures[feature]) {
      distinctFeatures[feature].push(filename);
    } else {
      distinctFeatures[feature] = [filename];
    }
  });
  const totalDistinctFeatures = Object.keys(distinctFeatures).length;
  const reportData = [];
  Object.keys(distinctFeatures).forEach(feature => {
    const files = distinctFeatures[feature];
    const count = files.length;
    if (count > 1) {
      reportData.push({
        feature,
        count,
        filenames: files.join('\n')
      });
    }
  });
  // Sort reportData by feature name
  reportData.sort((a, b) => a.feature.localeCompare(b.feature));
  return { totalFeatures, totalDistinctFeatures, reportData };
}

/* 
  ============
  Additional detectors (for duplicate steps, duplicate scenario titles,
  absence of background, etc.) can be implemented in a similar fashion,
  using regular expressions and file/string processing.
  ============
*/

// POST endpoint to run detection on uploaded .feature files
app.post('/run-detection', upload.array('files'), (req, res) => {
  // req.files is an array of uploaded files
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files were uploaded." });
  }

  // Extract file names and contents
  const fileNames = req.files.map(file => file.originalname);
  const fileContents = readFilesFromUpload(req.files);

  // Run detectors on the uploaded files
  const untitledFeatures = findUntitledFeatures(fileNames, fileContents);
  const duplicateFeatureTitles = findDuplicateFeatureTitlesAdvanced(fileNames, fileContents);
  // Additional detectors would be called here…

  // Send JSON response with results
  res.json({
    untitledFeatures,
    duplicateFeatureTitles
    // ... include other detectors’ results here as needed
  });
});

// GET endpoint to serve a simple HTML form for file uploads
app.get('/', (req, res) => {
  res.send(`
    <h1>Test Smell Detector</h1>
    <form method="POST" action="/run-detection" enctype="multipart/form-data">
      <label for="files">Upload .feature files:</label>
      <input type="file" name="files" id="files" multiple accept=".feature">
      <button type="submit">Run Detection</button>
    </form>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Test Smell Detector server is running on port ${port}`);
});
