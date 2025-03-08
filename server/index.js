import express from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

// Configure multer to use memory storage (files are kept in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({
    storage
});

// Utility function to read uploaded files (from multer)
function readFilesFromUpload(files) {
    return files.map(file => file.buffer.toString('utf-8'));
}

/* =============================
   Detector: Find Untitled Features
   ============================= */
/**
 * A feature is “untitled” if its line matches "Feature:" with no title following.
 *
 * @param {string[]} filenames - Array of feature file names.
 * @param {string[]} fileContents - Array of feature file contents.
 * @returns {Array} Array of result objects with filename, lineNumber, and matchedLine.
 */
function findUntitledFeatures(filenames, fileContents) {
    const pattern = /^Feature:\s*$/;
    const results = [];
    filenames.forEach((filename, idx) => {
        const lines = fileContents[idx].split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (pattern.test(lines[i])) {
                const matchedLine = lines[i].replace(/^\s+/, '');
                results.push({
                    filename,
                    lineNumber: i + 1,
                    matchedLine
                });
                break;
            }
        }
    });
    return results;
}

/* ===============================================
   Detector: Find Duplicate Feature Titles (Advanced)
   =============================================== */
/**
 * Extracts the first line starting with "Feature:" from each file,
 * groups them by title, counts occurrences, and returns overall totals
 * along with a duplicate report.
 *
 * @param {string[]} filenames - Array of feature file names.
 * @param {string[]} fileContents - Array of feature file contents.
 * @returns {Object} Analysis result with totalFeatures, totalDistinctFeatures, and reportData.
 */
function findDuplicateFeatureTitlesAdvanced(filenames, fileContents) {
    const pattern = /Feature:.*$/m;
    const features = [];
    filenames.forEach((filename, idx) => {
        const file = fileContents[idx];
        const match = file.match(pattern);
        if (match) {
            features.push({
                feature: match[0].trim(),
                filename
            });
        }
    });
    const totalFeatures = features.length;
    const distinctFeatures = {};
    features.forEach(({
        feature,
        filename
    }) => {
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
    reportData.sort((a, b) => a.feature.localeCompare(b.feature));
    return {
        totalFeatures,
        totalDistinctFeatures,
        reportData
    };
}

/* ===============================================
   Additional Detector: Absence of Background
   =============================================== */
/**
 * Helper function to mimic Python's match_structure.
 */
function matchStructure(line, totalList, pattern) {
    const match = line.match(pattern);
    if (match) {
        const titleName = match[2] || "";
        const normalizedTitle = titleName.trim();
        totalList.push(normalizedTitle);
    }
}

/**
 * Helper function: absenceCounter
 */
function absenceCounter(stepsScenariosFeature) {
    let biggestScenario = [];
    stepsScenariosFeature.forEach(scenario => {
        if (scenario.length > biggestScenario.length) {
            biggestScenario = scenario;
        }
    });
    const stepCounts = {};
    for (let size = biggestScenario.length; size > 0; size--) {
        for (let key in stepCounts) {
            delete stepCounts[key];
        }
        stepsScenariosFeature.forEach(stepsScenario => {
            const key = stepsScenario.slice(0, size).join('|');
            stepCounts[key] = (stepCounts[key] || 0) + 1;
        });
        const counts = Object.values(stepCounts);
        const maxCount = counts.length ? Math.max(...counts) : 0;
        if (maxCount >= stepsScenariosFeature.length) {
            return stepCounts;
        }
    }
    return stepCounts;
}

/**
 * Helper function: absenceStructure
 */
function absenceStructure(filename, absenceCounts, absencesBackgrounds, totalScenarios, totalAbsenceBackgrounds) {
    let absenceBackground = [];
    Object.entries(absenceCounts).forEach(([key, count]) => {
        if (count >= totalScenarios && totalScenarios > 1) {
            const formattedStep = key.split('|').map(s => s.trim()).join('\n ');
            absenceBackground.push(`'${formattedStep}' appears ${count} times`);
            totalAbsenceBackgrounds += count;
        }
    });
    if (absenceBackground.length > 0) {
        absencesBackgrounds.push({
            filename,
            absence_background: absenceBackground,
            scenarios: totalScenarios
        });
    }
    return totalAbsenceBackgrounds;
}

/**
 * Helper function: absenceAnalysis
 */
function absenceAnalysis(filename, registers, stepPattern, partitionPattern, absencesBackgrounds, totalScenarios, totalAbsenceBackgrounds) {
    let stepsScenariosFeature = [];
    registers = registers.map(reg => reg.replace(/\n\n/g, "\n"));
    registers.forEach(reg => {
        const trimmed = reg.trim();
        let untreatedStepsScenarios = trimmed.match(stepPattern) || [];
        untreatedStepsScenarios.forEach(uts => {
            const utsTrimmed = uts.trim();
            let stepsScenario = utsTrimmed.split(partitionPattern).map(s => s.trim()).filter(s => s);
            stepsScenariosFeature.push(stepsScenario);
        });
    });
    const absenceCounts = absenceCounter(stepsScenariosFeature);
    totalAbsenceBackgrounds = absenceStructure(filename, absenceCounts, absencesBackgrounds, totalScenarios, totalAbsenceBackgrounds);
    return totalAbsenceBackgrounds;
}

/**
 * Detector: Find Absence of Background
 * Mimics the Python function to detect scenarios where background is absent.
 *
 * @param {string[]} featureFilenames - Array of feature file names.
 * @param {string[]} featureFiles - Array of feature file contents.
 * @returns {Object} An object with totalAbsenceBackgrounds and an array of detailed records.
 */
function findAbsenceBackground(featureFilenames, featureFiles) {
    let totalScenarios = [];
    let absencesBackgrounds = [];
    let totalAbsenceBackgrounds = 0;

    const scenarioPattern = /(Scenario:[\s\S]*?)(?=(?:([@#]\S*?)?Scenario:)|(?:([@#]\S*?)?Scenario Outline:)|(?:([@#]\S*?)?Example:)|(?:([@#]\S*?)?Rule:)|$)/g;
    const scenarioOutlinePattern = /(Scenario Outline:[\s\S]*?)(?=(?:([@#]\S*?)?Scenario:)|(?:([@#]\S*?)?Scenario Outline:)|(?:([@#]\S*?)?Example:)|(?:([@#]\S*?)?Rule:)|$)/g;
    const examplePattern = /(Example:[\s\S]*?)(?=(?:([@#]\S*?)?Scenario:)|(?:([@#]\S*?)?Scenario Outline:)|(?:([@#]\S*?)?Example:)|(?:([@#]\S*?)?Rule:)|$)/g;
    const stepPattern = /(?:Scenario:|Scenario Outline:|Example:)[\s\S]*?(?:(Given[\s\S]*?|And[\s\S]*?))(?=When|Then|Scenario:|Scenario Outline:|Example:|Examples:|Rule:|$)/g;
    const partitionPattern = /(?:Given\s|And\s|But\s)/g;
    const totalScenarioPattern = /^\s*(Scenario:|Example:|Scenario Outline:)\s*(.+)$/;

    for (let i = 0; i < featureFiles.length; i++) {
        const filename = featureFilenames[i];
        const fileContent = featureFiles[i];
        const lines = fileContent.split('\n');
        for (let j = 0; j < lines.length; j++) {
            matchStructure(lines[j], totalScenarios, totalScenarioPattern);
        }
        let scenarios = [];
        let match;
        while ((match = scenarioPattern.exec(fileContent)) !== null) {
            scenarios.push(match[1].trim());
        }
        let scenarioOutlines = [];
        while ((match = scenarioOutlinePattern.exec(fileContent)) !== null) {
            scenarioOutlines.push(match[1].trim());
        }
        let examples = [];
        while ((match = examplePattern.exec(fileContent)) !== null) {
            examples.push(match[1].trim());
        }
        const totalScenariosFeature = scenarios.concat(scenarioOutlines, examples);
        totalAbsenceBackgrounds = absenceAnalysis(
            filename,
            totalScenariosFeature,
            stepPattern,
            partitionPattern,
            absencesBackgrounds,
            totalScenarios.length,
            totalAbsenceBackgrounds
        );
        totalScenarios = [];
    }

    if (absencesBackgrounds.length > 0) {
        absencesBackgrounds.forEach(register => {
            register.absence_background = register.absence_background.join('\n');
        });
    }

    return {
        totalAbsenceBackgrounds,
        absencesBackgrounds
    };
}

/* ===============================================
   Detector: Find Duplicate Scenario Titles
   =============================================== */
/**
 * Extracts scenario titles (ignoring the prefixes "Scenario:", "Example:", and "Scenario Outline:")
 * and returns a report of duplicate titles with their counts and file locations.
 *
 * @param {string[]} filenames - Array of feature file names.
 * @param {string[]} fileContents - Array of feature file contents.
 * @returns {Object} An object with totalScenarioTitles and duplicateScenarioTitles array.
 */
function findDuplicateScenarioTitles(filenames, fileContents) {
    const scenarioRegex = /^\s*(Scenario:|Example:|Scenario Outline:)\s*(.+)$/;
    const titleCount = {};
    let totalScenarioTitles = 0;
    filenames.forEach((filename, idx) => {
        const lines = fileContents[idx].split('\n');
        lines.forEach((line, i) => {
            const match = line.match(scenarioRegex);
            if (match) {
                totalScenarioTitles++;
                const normalizedTitle = match[2].trim();
                if (!titleCount[normalizedTitle]) {
                    titleCount[normalizedTitle] = {
                        count: 0,
                        locations: []
                    };
                }
                titleCount[normalizedTitle].count++;
                titleCount[normalizedTitle].locations.push(`${filename}:${i + 1}`);
            }
        });
    });

    const duplicateScenarioTitles = [];
    for (const title in titleCount) {
        if (titleCount[title].count > 1) {
            const sortedLocations = titleCount[title].locations.sort();
            duplicateScenarioTitles.push({
                title,
                count: titleCount[title].count,
                locations: sortedLocations
            });
        }
    }
    duplicateScenarioTitles.sort((a, b) => a.title.localeCompare(b.title));

    return {
        totalScenarioTitles,
        duplicateScenarioTitles
    };
}

/* ===============================================
   Detector: Find Duplicate Steps
   =============================================== */
/**
 * Finds duplicate steps within each feature file.
 *
 * @param {string[]} featureFilenames - Array of feature file names.
 * @param {string[]} featureFiles - Array of feature file contents.
 * @returns {Object} An object with totalDuplicateSteps and an array of duplicate steps details.
 */
function findDuplicateSteps(featureFilenames, featureFiles) {
    const backgroundPattern = /(Background:.*)([\s\S]*?)(?=(?:([@#][\s\S]*?)?Scenario:)|(?:([@#][\s\S]*?)?Scenario Outline:)|(?:([@#][\s\S]*?)?Example:)|(?:([@#][\s\S]*?)?Rule:)|$)/g;
    const scenarioPattern = /(Scenario:.*)([\s\S]*?)(?=(?:([@#][\s\S]*?)?Scenario:)|(?:([@#][\s\S]*?)?Scenario Outline:)|(?:([@#][\s\S]*?)?Example:)|(?:([@#][\s\S]*?)?Rule:)|$)/g;
    const scenarioOutlinePattern = /(Scenario Outline:.*)([\s\S]*?)(?=(?:([@#][\s\S]*?)?Scenario:)|(?:([@#][\s\S]*?)?Scenario Outline:)|(?:([@#][\s\S]*?)?Example:)|(?:([@#][\s\S]*?)?Rule:)|$)/g;
    const examplePattern = /(Example:.*)([\s\S]*?)(?=(?:([@#][\s\S]*?)?Scenario:)|(?:([@#][\s\S]*?)?Scenario Outline:)|(?:([@#][\s\S]*?)?Example:)|(?:([@#][\s\S]*?)?Rule:)|$)/g;
    const stepPattern = /(?:Given|When|Then|And|But)([\s\S]*?)(?=Given|When|Then|And|But|Scenario:|Scenario Outline:|Example:|Examples:|Rule:|$)/g;

    let duplicateSteps = [];
    let totalDuplicateSteps = 0;

    for (let i = 0; i < featureFilenames.length; i++) {
        const filename = featureFilenames[i];
        const featureFile = featureFiles[i];
        let registers = [];

        function getMatches(pattern) {
            pattern.lastIndex = 0;
            let match;
            while ((match = pattern.exec(featureFile)) !== null) {
                const lineNumber = featureFile.slice(0, match.index).split('\n').length;
                registers.push({
                    register: match[0].trim(),
                    lineNumber
                });
            }
        }
        getMatches(backgroundPattern);
        getMatches(scenarioPattern);
        getMatches(scenarioOutlinePattern);
        getMatches(examplePattern);

        totalDuplicateSteps = stutteringAnalysis(filename, registers, stepPattern, duplicateSteps, totalDuplicateSteps);
    }

    if (duplicateSteps.length > 0) {
        duplicateSteps.forEach(ds => {
            ds.file_and_line = ds.file_and_line.join('\n');
            ds.duplicate_step = ds.duplicate_step.join('\n');
        });
    }

    return {
        totalDuplicateSteps,
        duplicateSteps
    };
}

/**
 * Helper function: stutteringAnalysis
 */
function stutteringAnalysis(filename, registers, stepPattern, duplicateSteps, totalDuplicateSteps) {
    const originalRegisters = registers.map(r => r.register);
    for (let i = 0; i < registers.length; i++) {
        registers[i].register = registers[i].register.replace(/\n\n/g, "\n").trim();
        stepPattern.lastIndex = 0;
        let steps = [];
        let match;
        while ((match = stepPattern.exec(registers[i].register)) !== null) {
            steps.push(match[1].trim());
        }
        const stutteringCounts = stutteringCounter(steps);
        totalDuplicateSteps = duplicateStepsStructure(
            filename,
            registers[i].lineNumber,
            stutteringCounts,
            originalRegisters[i],
            duplicateSteps,
            totalDuplicateSteps
        );
    }
    return totalDuplicateSteps;
}

/**
 * Helper function: stutteringCounter
 */
function stutteringCounter(steps) {
    const stepCounts = {};
    steps.forEach(step => {
        step = step.trim();
        stepCounts[step] = (stepCounts[step] || 0) + 1;
    });
    return stepCounts;
}

/**
 * Helper function: duplicateStepsStructure
 */
function duplicateStepsStructure(filename, registerLine, stutteringCounts, register, duplicateSteps, totalDuplicateSteps) {
    let duplicateStepArr = [];
    let fileAndLineArr = [];
    for (const step in stutteringCounts) {
        const count = stutteringCounts[step];
        if (count > 1) {
            let stepLine = 0;
            const lines = register.split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].search(new RegExp(step, 'g')) !== -1) {
                    stepLine = registerLine + i;
                    break;
                }
            }
            fileAndLineArr.push(`${filename}:${stepLine}`);
            duplicateStepArr.push(`'${step}' appears ${count} times`);
            totalDuplicateSteps += count;
        }
    }
    if (duplicateStepArr.length > 0) {
        duplicateSteps.push({
            file_and_line: fileAndLineArr,
            duplicate_step: duplicateStepArr,
            register: register
        });
    }
    return totalDuplicateSteps;
}

/* ===============================================
   Detector: Find Duplicate Test Cases
   =============================================== */
/**
 * Finds duplicate test cases in feature files by comparing the body (excluding the first line) of each test case.
 *
 * @param {string[]} filenames - Array of feature file names.
 * @param {string[]} fileContents - Array of feature file contents.
 * @returns {Object} An object with totalTestCases and an array of duplicate test cases.
 */
function findDuplicateTestCases(filenames, fileContents) {
    const testCaseRegex = /(Scenario:[^\n]*|Example:[^\n]*|Scenario Outline:[^\n]*)([\s\S]*?)(?=\n(?:\n\s*)*[@#]|Scenario:|Example:|Examples:|Scenario Outline:|Rule:|$)/g;
    const testCaseCount = {};
    let totalTestCases = 0;
    filenames.forEach((filename, idx) => {
        const text = fileContents[idx];
        let match;
        while ((match = testCaseRegex.exec(text)) !== null) {
            totalTestCases++;
            const fullTestCase = match[0].trim();
            const lineNumber = text.slice(0, match.index).split('\n').length;
            const testCaseLines = fullTestCase.split('\n');
            const testCaseBody = testCaseLines.slice(1).join('\n').trim();
            if (!testCaseCount[testCaseBody]) {
                testCaseCount[testCaseBody] = {
                    count: 0,
                    titlesAndFiles: []
                };
            }
            testCaseCount[testCaseBody].count++;
            testCaseCount[testCaseBody].titlesAndFiles.push(`${filename}:${lineNumber} - ${testCaseLines[0].trim()}`);
        }
    });
    const duplicateTestCases = [];
    for (const body in testCaseCount) {
        if (testCaseCount[body].count > 1) {
            duplicateTestCases.push({
                count: testCaseCount[body].count,
                titlesAndFiles: testCaseCount[body].titlesAndFiles.join('\n'),
                testCaseBody: body
            });
        }
    }
    duplicateTestCases.sort((a, b) => a.titlesAndFiles.localeCompare(b.titlesAndFiles));
    return {
        totalTestCases,
        duplicateTestCases
    };
}

/* ===============================================
   Detector: Find Malformed Tests
   =============================================== */
/**
 * Finds all the malformed tests in the feature files.
 *
 * A malformed test is detected by analyzing test blocks (from backgrounds,
 * scenarios, scenario outlines, and examples) for duplicate occurrences of
 * the keywords "Given", "When", and "Then" (or missing counts).
 *
 * @param {string[]} featureFilenames - Array of feature file names.
 * @param {string[]} featureFiles - Array of feature file contents.
 * @returns {Object} An object with totalMalformedTests and an array of malformed test records.
 */
function findMalformedTests(featureFilenames, featureFiles) {
    // Regex patterns (same as in the Python script)
    const backgroundPattern = /(Background:.*)([\s\S]*?)(?=(?:([@#][\s\S]*?)?Scenario:)|(?:([@#][\s\S]*?)?Scenario Outline:)|(?:([@#][\s\S]*?)?Example:)|(?:([@#][\s\S]*?)?Rule:)|$)/g;
    const scenarioPattern = /(Scenario:.*)([\s\S]*?)(?=(?:([@#][\s\S]*?)?Scenario:)|(?:([@#][\s\S]*?)?Scenario Outline:)|(?:([@#][\s\S]*?)?Example:)|(?:([@#][\s\S]*?)?Rule:)|$)/g;
    const scenarioOutlinePattern = /(Scenario Outline:.*)([\s\S]*?)(?=(?:([@#][\s\S]*?)?Scenario:)|(?:([@#][\s\S]*?)?Scenario Outline:)|(?:([@#][\s\S]*?)?Example:)|(?:([@#][\s\S]*?)?Rule:)|$)/g;
    const examplePattern = /(Example:.*)([\s\S]*?)(?=(?:([@#][\s\S]*?)?Scenario:)|(?:([@#][\s\S]*?)?Scenario Outline:)|(?:([@#][\s\S]*?)?Example:)|(?:([@#][\s\S]*?)?Rule:)|$)/g;
    const stepPattern = /(Given.*|When.*|Then.*)/g;

    let malformedRegisters = [];
    let totalMalformedTests = 0;

    for (let i = 0; i < featureFilenames.length; i++) {
        const filename = featureFilenames[i];
        const featureFile = featureFiles[i];

        // Collect registers from backgrounds, scenarios, scenario outlines, and examples.
        function collectMatches(pattern) {
            pattern.lastIndex = 0;
            let match;
            let results = [];
            while ((match = pattern.exec(featureFile)) !== null) {
                const lineNumber = featureFile.slice(0, match.index).split('\n').length;
                // In Python, for each match.groups()[1:] if group exists, add the full match.
                // Here, we simply add the full match once if any group after the first exists.
                for (let j = 1; j < match.length; j++) {
                    if (match[j]) {
                        results.push({
                            register: match[0].trim(),
                            lineNumber
                        });
                        break;
                    }
                }
            }
            return results;
        }

        const backgrounds = collectMatches(backgroundPattern);
        const scenarios = collectMatches(scenarioPattern);
        const scenarioOutlines = collectMatches(scenarioOutlinePattern);
        const examples = collectMatches(examplePattern);
        const totalRegisters = backgrounds.concat(scenarios, scenarioOutlines, examples);

        if (backgrounds.length !== 0) {
            totalMalformedTests = malformedAnalysisBackgrounds(filename, backgrounds, stepPattern, malformedRegisters, totalMalformedTests);
        }
        totalMalformedTests = malformedAnalysis(filename, totalRegisters, stepPattern, malformedRegisters, totalMalformedTests);
    }

    if (malformedRegisters.length > 0) {
        malformedRegisters.forEach(register => {
            register.file_and_line = register.file_and_line.join('\n');
            register.justification = register.justification.join('\n');
        });
    }
    return {
        totalMalformedTests,
        malformedRegisters
    };
}

function malformedAnalysisBackgrounds(filename, registers, stepPattern, malformedRegisters, totalMalformedTests) {
    const originalRegisters = registers.map(r => r.register);
    for (let i = 0; i < registers.length; i++) {
        registers[i].register = registers[i].register.replace(/\n\n/g, "\n").trim();
        const register = registers[i].register;
        const registerLine = registers[i].lineNumber;
        const steps = register.match(stepPattern) || [];
        const keywordCounts = malformedTestsCounter(steps);
        totalMalformedTests = malformedTestsStructureBackgrounds(filename, registerLine, keywordCounts, originalRegisters[i], malformedRegisters, totalMalformedTests);
    }
    return totalMalformedTests;
}

function malformedAnalysis(filename, registers, stepPattern, malformedRegisters, totalMalformedTests) {
    const originalRegisters = registers.map(r => r.register);
    for (let i = 0; i < registers.length; i++) {
        registers[i].register = registers[i].register.replace(/\n\n/g, "\n").trim();
        const register = registers[i].register;
        const registerLine = registers[i].lineNumber;
        const steps = register.match(stepPattern) || [];
        const keywordCounts = malformedTestsCounter(steps);
        totalMalformedTests = malformedTestsStructure(filename, registerLine, keywordCounts, originalRegisters[i], malformedRegisters, totalMalformedTests);
    }
    return totalMalformedTests;
}

function malformedTestsCounter(steps) {
    const keywordCounts = {
        "Given": 0,
        "When": 0,
        "Then": 0
    };
    steps.forEach(step => {
        if (step.startsWith("Given")) {
            keywordCounts["Given"] += 1;
        } else if (step.startsWith("When")) {
            keywordCounts["When"] += 1;
        } else if (step.startsWith("Then")) {
            keywordCounts["Then"] += 1;
        }
    });
    return keywordCounts;
}

function malformedTestsStructureBackgrounds(filename, registerLine, keywordCounts, register, malformedRegisters, totalMalformedTests) {
    let malformedKeywords = [];
    let fileAndLine = [];
    for (const keyword in keywordCounts) {
        const count = keywordCounts[keyword];
        if (count > 1) {
            let stepLine = 0;
            const lines = register.split("\n");
            for (let i = 0; i < lines.length; i++) {
                const regex = new RegExp(escapeRegExp(keyword));
                if (regex.test(lines[i])) {
                    stepLine = registerLine + i + 1;
                    break;
                }
            }
            fileAndLine.push(`${filename}:${stepLine}`);
            malformedKeywords.push(`${keyword} appears ${count} times`);
            totalMalformedTests += count;
        }
    }
    if (malformedKeywords.length > 0) {
        malformedRegisters.push({
            file_and_line: fileAndLine,
            justification: malformedKeywords,
            register: register
        });
    }
    return totalMalformedTests;
}

function malformedTestsStructure(filename, registerLine, keywordCounts, register, malformedRegisters, totalMalformedTests) {
    let malformedKeywords = [];
    let fileAndLine = [];
    for (const keyword in keywordCounts) {
        const count = keywordCounts[keyword];
        if (count > 1) {
            let stepLine = 0;
            const lines = register.split("\n");
            for (let i = 0; i < lines.length; i++) {
                const regex = new RegExp(escapeRegExp(keyword));
                if (regex.test(lines[i])) {
                    stepLine = registerLine + i + 1;
                    break;
                }
            }
            fileAndLine.push(`${filename}:${stepLine}`);
            malformedKeywords.push(`${keyword} appears ${count} times`);
            totalMalformedTests += count;
        }
        if (count === 0 && keyword !== "Given") {
            fileAndLine.push(`${filename}:${registerLine}`);
            malformedKeywords.push(`${keyword} appears zero times`);
            totalMalformedTests += 1;
        }
    }
    if (malformedKeywords.length > 0) {
        malformedRegisters.push({
            file_and_line: fileAndLine,
            justification: malformedKeywords,
            register: register
        });
    }
    return totalMalformedTests;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ===============================================
   Detector: Find Starting With The Left Foot
   =============================================== */
/**
 * Finds all the "left foot" scenarios in feature files.
 *
 * A "left foot" scenario is detected when a scenario block's first step
 * does not start with "Given" or "When".
 *
 * @param {string[]} featureFilenames - Array of feature file names.
 * @param {string[]} featureFiles - Array of feature file contents.
 * @returns {Object} An object with totalLeftFoots and an array of left foot records.
 */
function findStartingWithTheLeftFoot(featureFilenames, featureFiles) {
    let leftFoots = [];
    let totalLeftFoots = 0;
    const scenarioPattern = /(Scenario:[\s\S]*?)(?=(?:([@#]\S*?)?Scenario:)|(?:([@#]\S*?)?Scenario Outline:)|(?:([@#]\S*?)?Example:)|(?:([@#]\S*?)?Rule:)|$)/g;
    const scenarioOutlinePattern = /(Scenario Outline:[\s\S]*?)(?=(?:([@#]\S*?)?Scenario:)|(?:([@#]\S*?)?Scenario Outline:)|(?:([@#]\S*?)?Example:)|(?:([@#]\S*?)?Rule:)|$)/g;
    const examplePattern = /(Example:[\s\S]*?)(?=(?:([@#]\S*?)?Scenario:)|(?:([@#]\S*?)?Scenario Outline:)|(?:([@#]\S*?)?Example:)|(?:([@#]\S*?)?Rule:)|$)/g;
    const stepPattern = /(?:Scenario:|Scenario Outline:|Example:)[\s\S]*?(?:(Given[\s\S]*?|And[\s\S]*?|When[\s\S]*?|Then[\s\S]*?))(?=When|Then|Scenario:|Scenario Outline:|Example:|Examples:|Rule:|$)/g;
    const partitionPattern = /(Given[\s\S]*?|And[\s\S]*?|But[\s\S]*?|Then[\s\S]*?)(?=Given|And|But|When|Then|Scenario:|Scenario Outline:|Example:|Examples:|Rule:|$)/;

    featureFiles.forEach((fileContent, idx) => {
        const filename = featureFilenames[idx];
        let registers = [];

        function collectMatches(pattern) {
            pattern.lastIndex = 0;
            let match;
            while ((match = pattern.exec(fileContent)) !== null) {
                const lineNumber = fileContent.slice(0, match.index).split('\n').length;
                registers.push({
                    register: match[0].trim(),
                    lineNumber
                });
            }
        }
        collectMatches(scenarioPattern);
        collectMatches(scenarioOutlinePattern);
        collectMatches(examplePattern);

        totalLeftFoots = leftFootAnalysis(filename, registers, stepPattern, partitionPattern, leftFoots, totalLeftFoots);
    });

    return {
        totalLeftFoots,
        leftFoots
    };
}

function leftFootAnalysis(filename, registers, stepPattern, partitionPattern, leftFoots, totalLeftFoots) {
    registers.forEach((item, index) => {
        item.register = item.register.replace(/\n\n/g, "\n").trim();
        stepPattern.lastIndex = 0;
        let untreatedSteps = item.register.match(stepPattern) || [];
        untreatedSteps.forEach(uts => {
            uts = uts.trim();
            let steps = uts.split(partitionPattern).map(s => s.trim()).filter(s => s);
            if (steps.length > 0 && !/^(Given|When)/.test(steps[0])) {
                totalLeftFoots = leftFootStructure(filename, leftFoots, item.register, item.lineNumber, totalLeftFoots);
                totalLeftFoots += 1;
            }
        });
    });
    return totalLeftFoots;
}

function leftFootStructure(filename, leftFoots, scenario, line, totalLeftFoots) {
    leftFoots.push({
        filename: `${filename}:${line}`,
        left_foot: scenario
    });
    return totalLeftFoots;
}

/* ===============================================
   Detector: Find Vicious Tags
   =============================================== */
function findViciousTags(featureFilenames, featureFiles) {
    let totalRules = [];
    let totalScenarios = [];
    let viciousTags = [];
    let totalViciousTags = 0;
    const ruleTagPattern = /((?:@[\S]+\s*)+)(?=\s*Rule:)/g;
    const scenarioTagPattern = /((?:@[\S]+\s*)+)(?=\s*Scenario:)/g;
    const scenarioOutlineTagPattern = /((?:@[\S]+\s*)+)(?=\s*Scenario Outline:)/g;
    const exampleTagPattern = /((?:@[\S]+\s*)+)(?=\s*Example:)/g;
    const totalRulePattern = /^\s*(Rule:)\s*(.+)$/;
    const totalScenarioPattern = /^\s*(Scenario:|Example:|Scenario Outline:)\s*(.+)$/;

    for (let i = 0; i < featureFilenames.length; i++) {
        const filename = featureFilenames[i];
        const featureFile = featureFiles[i];
        const lines = featureFile.split('\n');
        for (let j = 0; j < lines.length; j++) {
            matchStructure(lines[j], totalRules, totalRulePattern);
            matchStructure(lines[j], totalScenarios, totalScenarioPattern);
        }
        let rules = featureFile.match(ruleTagPattern) || [];
        let scenarios = featureFile.match(scenarioTagPattern) || [];
        let scenariosOutline = featureFile.match(scenarioOutlineTagPattern) || [];
        let examples = featureFile.match(exampleTagPattern) || [];
        rules = rules.map(t => t.trim()).filter(t => t);
        scenarios = scenarios.map(t => t.trim()).filter(t => t);
        scenariosOutline = scenariosOutline.map(t => t.trim()).filter(t => t);
        examples = examples.map(t => t.trim()).filter(t => t);
        const totalTaggedScenariosFeature = scenarios.concat(scenariosOutline, examples);

        totalViciousTags = viciousAnalysis(filename, rules, viciousTags, totalRules.length, totalViciousTags, 'Rule');
        totalViciousTags = viciousAnalysis(filename, totalTaggedScenariosFeature, viciousTags, totalScenarios.length, totalViciousTags, 'Scenario');

        totalRules = [];
        totalScenarios = [];
    }
    if (viciousTags.length > 0) {
        viciousTags.forEach(register => {
            register.vicious_tag = register.vicious_tag.join('\n');
        });
    }
    return {
        totalViciousTags,
        viciousTags
    };
}

function viciousAnalysis(filename, registers, viciousTags, totalScenarios, totalViciousTags, type) {
    let tagsScenariosFeature = [];
    for (let i = 0; i < registers.length; i++) {
        let reg = registers[i].trim();
        let tags = reg.match(/@[\S]+/g) || [];
        tagsScenariosFeature.push(tags);
    }
    let viciousCounts = viciousCounter(tagsScenariosFeature);
    totalViciousTags = viciousStructure(filename, viciousCounts, viciousTags, totalScenarios, totalViciousTags, type);
    return totalViciousTags;
}

function viciousCounter(tagsScenariosFeature) {
    let tagCounts = {};
    tagsScenariosFeature.forEach(tagsArray => {
        tagsArray.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    return tagCounts;
}

function viciousStructure(filename, viciousCounts, viciousTags, totalScenarios, totalViciousTags, type) {
    let viciousTag = [];
    for (const tag in viciousCounts) {
        if (viciousCounts[tag] >= totalScenarios && totalScenarios > 1) {
            viciousTag.push(`'${tag}' appears ${viciousCounts[tag]} times`);
            totalViciousTags += viciousCounts[tag];
        }
    }
    if (viciousTag.length > 0) {
        viciousTags.push({
            filename: filename,
            vicious_tag: viciousTag,
            scenarios: totalScenarios,
            type: type
        });
    }
    return totalViciousTags;
}

/* ===============================================
   Single Endpoint: Run All Smell Detections
   =============================================== */
app.post('/run-detection', upload.array('files'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            error: "No files were uploaded."
        });
    }
    const fileNames = req.files.map(file => file.originalname);
    const fileContents = readFilesFromUpload(req.files);

    const untitledFeatures = findUntitledFeatures(fileNames, fileContents);
    const duplicateFeatureTitles = findDuplicateFeatureTitlesAdvanced(fileNames, fileContents);
    const absenceBackground = findAbsenceBackground(fileNames, fileContents);
    const duplicateScenarioTitles = findDuplicateScenarioTitles(fileNames, fileContents);
    const duplicateSteps = findDuplicateSteps(fileNames, fileContents);
    const duplicateTestCases = findDuplicateTestCases(fileNames, fileContents);
    const malformedTests = findMalformedTests(fileNames, fileContents);
    const startingWithLeftFoot = findStartingWithTheLeftFoot(fileNames, fileContents);
    const viciousTags = findViciousTags(fileNames, fileContents);

    res.json({
        untitledFeatures,
        duplicateFeatureTitles,
        absenceBackground,
        duplicateScenarioTitles,
        duplicateSteps,
        duplicateTestCases,
        malformedTests,
        startingWithLeftFoot,
        viciousTags
    });
});

// GET endpoint to serve a simple HTML form for file uploads
app.get('/', (req, res) => {
    res.send(`
    <h1>Test Smell Detector</h1>
    <form method="POST" action="/run-detection" enctype="multipart/form-data">
      <label for="files">Upload .feature files:</label>
      <input type="file" name="files" id="files" multiple accept=".feature">
      <button type="submit">Run All Detections</button>
    </form>
  `);
});

// Start the server
app.listen(port, () => {
    console.log(`Test Smell Detector server is running on port ${port}`);
});
