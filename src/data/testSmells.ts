export default [
  {
    "category": "Title Smells",
    "items": [
      {
        "title": "Untitled Feature",
        "description": "The 'Untitled Feature' smell is characterized by the absence of a title in a .feature file.",
        "consequences": [
          "Ambiguity: unclear objective of the feature.",
          "Reduced readability: difficult to understand the purpose of the test.",
          "Maintenance difficulty: unclear context complicates scenario updates."
        ],
        "image": "https://t9013506324.p.clickup-attachments.com/t9013506324/271eb48e-5ebd-4315-a03e-8783d4d8c501/image.png"
      },
      {
        "title": "Duplicate Feature Title",
        "description": "The 'Duplicate Feature Title' smell occurs when multiple feature files have identical titles.",
        "consequences": [
          "Ambiguity: hard to distinguish between features.",
          "Misinterpretation: higher risk of analyzing test results incorrectly.",
          "Traceability compromised: difficult to connect features to requirements."
        ],
        "image": "https://t9013506324.p.clickup-attachments.com/t9013506324/fa5a5838-c3d5-4f81-983b-f0e40fb5bfb5/image.png"
      },
      {
        "title": "Duplicate Scenario Titles",
        "description": "The 'Duplicate Scenario Title' smell occurs when scenario titles are repeated within or across feature files.",
        "consequences": [
          "Confusion about test outcomes.",
          "Inconsistency in expected behavior.",
          "Compromised traceability between scenarios and requirements."
        ],
        "image": "https://t9013506324.p.clickup-attachments.com/t9013506324/be271357-988b-46b8-b8af-ba787825fec2/image.png"
      }
    ]
  },
  {
    "category": "Tag Smells",
    "items": [
      {
        "title": "Cryptic Tag",
        "description": "The 'Cryptic Tag' smell occurs when a tag's meaning is unclear or difficult to understand.",
        "consequences": [
          "Ambiguity: unclear purpose of tags.",
          "Complex maintenance: difficulty organizing tests.",
          "Misclassification: errors in test categorization."
        ],
        "image": "https://t9013506324.p.clickup-attachments.com/t9013506324/d5135c38-f9f9-408f-a00d-f9aeab6a5148/image.png"
      },
      {
        "title": "Vicious Tag",
        "description": "The 'Vicious Tag' smell occurs when a tag is unnecessarily repeated across all scenarios within a feature file.",
        "consequences": [
          "Redundancy: increases file size and reduces readability.",
          "Maintenance complexity: changes in tags must be updated everywhere.",
          "Error-prone organization: makes test execution and categorization difficult."
        ],
        "image": "https://t9013506324.p.clickup-attachments.com/t9013506324/6f57f316-1301-4b31-976c-db74ebe77f1a/image.png"
      }
    ]
  },
  {
    "category": "Step Smells",
    "items": [
      {
        "title": "Duplicate Step",
        "description": "The 'Duplicate Step' smell occurs when the same step is repeated within a single scenario.",
        "consequences": [
          "Code redundancy: unnecessarily increases scenario length.",
          "Reduces readability and clarity of the test.",
          "Higher maintenance effort for step updates."
        ],
        "image": "https://t9013506324.p.clickup-attachments.com/t9013506324/c6f84360-5d9b-4fc2-a449-7189e00950d6/image.png"
      },
      {
        "title": "Malformed Test",
        "description": "The 'Malformed Test' smell occurs when the Given, When, or Then keywords are incorrectly repeated or essential keywords are missing.",
        "consequences": [
          "Ambiguity: unclear test logic due to repeated or missing keywords.",
          "Incompleteness: tests lack clarity or completeness."
        ],
        "image": "https://t9013506324.p.clickup-attachments.com/t9013506324/b3d0e69a-d3f6-4895-afd7-99b3d3cd942a/image.png"
      },
      {
        "title": "Starting With The Left Foot",
        "description": "The 'Left Foot' smell occurs when a scenario does not start with a 'Given' or 'When' step, thus deviating from standard practices.",
        "consequences": [
          "Structural inconsistency: violates Cucumber’s best practices.",
          "Ambiguity: unclear initial conditions.",
          "Difficult troubleshooting: requires extra checks on Background."
        ],
        "image": "https://t9013506324.p.clickup-attachments.com/t9013506324/21f21fc1-9496-4156-8e9f-a79a37c86a1c/image.png"
      }
    ]
  },
  {
    "category": "Table Smells",
    "items": [
      {
        "title": "Incomplete Table",
        "description": "The 'Incomplete Table' smell occurs when a table in a feature file lacks headers, body, or has incorrectly formatted values.",
        "consequences": [
          "Automation issues: problems during test execution.",
          "Misinterpretation: incorrect understanding of the data.",
          "Reduced readability and maintainability: confusion among team members."
        ],
        "image": "https://t9013506324.p.clickup-attachments.com/t9013506324/82ffa006-7e6c-40c8-ab72-3520db8f0703/image.png"
      }
    ]
  }
];