const mockUITestConversations = [
  {
    role: 'USER',
    message: 'Lets build some markdown examples. \n\n\n\nStart with 4 line breaks in a row, then a list of bullet points.',
  },
  {
    role: 'XT',
    message:
      'Here are 4 line breaks in a row to illustrate if that works.\n\n\n\nNext, we can try a list:\n- Item 1\n- Item 2\n- Item 3',
  },
  { role: 'USER', message: 'Numbered list:\n1. Item 1\n2. Item 2\n3. Item 3' },
  { role: 'XT', message: 'Numbered list:\n1. Item 1\n2. Item 2\n3. Item 3' },
  { role: 'USER', message: '**Bold Text**\n*Italic Text*' },
  { role: 'XT', message: '**Bold Text**\n*Italic Text*' },
  { role: 'USER', message: 'Link to Google: \n[Google](https://www.google.com)' },
  { role: 'XT', message: 'Link to Google: \n[Google](https://www.google.com)' },
  {
    role: 'USER',
    message: 'Image displayed inline:\n![DevXT Logo](https://devxt.com/wp-content/uploads/2023/01/Logo-300x93.png)',
  },
  {
    role: 'XT',
    message: 'Image displayed inline:\n![DevXT Logo](https://devxt.com/wp-content/uploads/2023/01/Logo-300x93.png)',
  },
  {
    role: 'USER',
    message: 'Table example:\n\n| Header 1 | Header 2 |\n|----------|----------|\n| Value 1  | Value 2  |',
  },
  {
    role: 'XT',
    message: 'Table example:\n\n| Header 1 | Header 2 |\n|----------|----------|\n| Value 1  | Value 2  |',
  },
  { role: 'USER', message: 'Heading:\n# Heading 1' },
  { role: 'XT', message: 'Heading:\n# Heading 1' },
  { role: 'USER', message: 'Subheading:\n## Heading 2' },
  { role: 'XT', message: 'Subheading:\n## Heading 2' },
  { role: 'USER', message: 'subsubheading:\n### Heading 3' },
  { role: 'XT', message: 'subsubheading:\n### Heading 3' },
  { role: 'USER', message: 'subsubsubheading:\n#### Heading 4' },
  { role: 'XT', message: 'subsubsubheading:\n#### Heading 4' },
  { role: 'USER', message: 'subsubsubsubheading:\n##### Heading 5' },
  { role: 'XT', message: 'subsubsubsubheading:\n##### Heading 5' },
  { role: 'USER', message: 'subsubsubsubsubheading:\n###### Heading 6' },
  { role: 'XT', message: 'subsubsubsubsubheading:\n###### Heading 6' },
  { role: 'USER', message: 'strikethrough:\n~~Strikethrough~~' },
  { role: 'XT', message: 'strikethrough:\n~~Strikethrough~~' },
  { role: 'USER', message: 'Spoiler:\n||Spoiler||' },
  { role: 'XT', message: 'Spoiler:\n||Spoiler||' },
  { role: 'USER', message: 'Quote:\n> Quote' },
  { role: 'XT', message: 'Quote:\n> Quote' },
  { role: 'USER', message: "Code block:\n```python\nprint('Hello, World!')\n```" },
  { role: 'XT', message: "Code block:\n```python\nprint('Hello, World!')\n```" },
  { role: 'USER', message: "Inline code:\n`print('Hello, World!')`" },
  { role: 'XT', message: "Inline code:\n`print('Hello, World!')`" },
  { role: 'USER', message: 'Horizontal rule:\n---' },
  { role: 'XT', message: 'Horizontal rule:\n---' },
  { role: 'USER', message: 'Line break:\nLine 1\nLine 2' },
  { role: 'XT', message: 'Line break:\nLine 1\nLine 2' },
  { role: 'USER', message: 'Superscript:\nX^2' },
  { role: 'XT', message: 'Superscript:\nX^2' },
  { role: 'USER', message: 'Subscript:\nX~2' },
  { role: 'XT', message: 'Subscript:\nX~2' },
  {
    role: 'USER',
    message: 'CSV code block:\n```csv\nHeader 1, Header 2\nValue 1, Value 2\n```',
  },
  {
    role: 'XT',
    message: 'CSV code block:\n```csv\nHeader 1, Header 2, \nValue 1, Value 2\n```',
  },
  {
    role: 'USER',
    message: 'TSV code block:\n```tsv\nHeader 1\tHeader 2\nValue 1\tValue 2\n```',
  },
  {
    role: 'XT',
    message: 'TSV code block:\n```tsv\nHeader 1\tHeader 2\nValue 1\tValue 2\n```',
  },
  {
    role: 'USER',
    message:
      'Mermaid diagram:\n```mermaid\ngraph TD\n    A[Square Rect] -- Link text --> B((Circle))\n    A --> C(Round Rect)\n    B --> D{Rhombus}\n    C --> D\n```',
  },
  {
    role: 'XT',
    message:
      'Mermaid diagram:\n```mermaid\ngraph TD\n    A[Square Rect] -- Link text --> B((Circle))\n    A --> C(Round Rect)\n    B --> D{Rhombus}\n    C --> D\n```',
  },
  {
    role: 'USER',
    message:
      'Flowchart diagram:\n```flow\nst=>start: Start\nop=>operation: Your Operation\ncond=>condition: Yes or No?\ne=>end\n\nst->op->cond\ncond(yes)->e\ncond(no)->op\n```',
  },
  {
    role: 'XT',
    message:
      'Flowchart diagram:\n```flow\nst=>start: Start\nop=>operation: Your Operation\ncond=>condition: Yes or No?\ne=>end\n\nst->op->cond\ncond(yes)->e\ncond(no)->op\n```',
  },
  {
    role: 'USER',
    message:
      'Sequence diagram:\n```sequence\nAlice->Bob: Hello Bob, how are you?\nNote right of Bob: Bob thinks\nBob-->Alice: I am good thanks!\n```',
  },
  {
    role: 'XT',
    message:
      'Sequence diagram:\n```sequence\nAlice->Bob: Hello Bob, how are you?\nNote right of Bob: Bob thinks\nBob-->Alice: I am good thanks!\n```',
  },
  {
    role: 'USER',
    message:
      'Gantt chart:\n```gantt\nsection Section\nA task           :a1, 2022-01-01, 30d\nAnother task     :after a1  , 20d\nsection Another\nTask in sec      :2022-01-12  , 12d\nanother task      : 24d\n```',
  },
  {
    role: 'XT',
    message:
      'Gantt chart:\n```gantt\nsection Section\nA task           :a1, 2022-01-01, 30d\nAnother task     :after a1  , 20d\nsection Another\nTask in sec      :2022-01-12  , 12d\nanother task      : 24d\n```',
  },
  {
    role: 'USER',
    message: "Python code block:\n```python\nprint('Hello, World!')\n```",
  },
  {
    role: 'XT',
    message: "Python code block:\n```python\nprint('Hello, World!')\n```",
  },
  {
    role: 'USER',
    message: "Java code block:\n```java\nSystem.out.println('Hello, World!');\n```",
  },
  {
    role: 'XT',
    message: "Java code block:\n```java\nSystem.out.println('Hello, World!');\n```",
  },
  {
    role: 'USER',
    message: "JavaScript code block:\n```javascript\nconsole.log('Hello, World!');\n```",
  },
  {
    role: 'XT',
    message: "JavaScript code block:\n```javascript\nconsole.log('Hello, World!');\n```",
  },
  {
    role: 'USER',
    message:
      'HTML code block:\n```html\n<!DOCTYPE html>\n<html>\n<head>\n<title>Title of the document</title>\n</head>\n<body>\n\n<h1>This is a Heading</h1>\n<p>This is a paragraph.</p>\n\n</body>\n</html>\n```',
  },
  {
    role: 'XT',
    message:
      'HTML code block:\n```html\n<!DOCTYPE html>\n<html>\n<head>\n<title>Title of the document</title>\n</head>\n<body>\n\n<h1>This is a Heading</h1>\n<p>This is a paragraph.</p>\n\n</body>\n</html>\n```',
  },
  {
    role: 'USER',
    message:
      'CSS code block:\n```css\nbody {\n  background-color: lightblue;\n}\n\nh1 {\n  color: white;\n  text-align: center;\n}\n```',
  },
  {
    role: 'XT',
    message:
      'CSS code block:\n```css\nbody {\n  background-color: lightblue;\n}\n\nh1 {\n  color: white;\n  text-align: center;\n}\n```',
  },
  {
    role: 'USER',
    message: 'SQL code block:\n```sql\nSELECT * FROM table_name;\n```',
  },
  {
    role: 'XT',
    message: 'SQL code block:\n```sql\nSELECT * FROM table_name;\n```',
  },
  { role: 'USER', message: "Bash code block:\n```bash\necho 'Hello, World!'\n```" },
  { role: 'XT', message: "Bash code block:\n```bash\necho 'Hello, World!'\n```" },
  {
    role: 'USER',
    message: 'JSON code block:\n```json\n{\n  "key": "value"\n}\n```',
  },
  { role: 'XT', message: 'JSON code block:\n```json\n{\n  "key": "value"\n}\n```' },
  { role: 'USER', message: 'YAML code block:\n```yaml\nkey: value\n```' },
  { role: 'XT', message: 'YAML code block:\n```yaml\nkey: value\n```' },
  {
    role: 'USER',
    message:
      'XML code block:\n```xml\n<?xml version="1.0" encoding="UTF-8"?>\n<note>\n  <to>Tove</to>\n  <from>Jani</from>\n  <heading>Reminder</heading>\n  <body>Don\'t forget me this weekend!</body>\n</note>\n```',
  },
  {
    role: 'XT',
    message:
      'XML code block:\n```xml\n<?xml version="1.0" encoding="UTF-8"?>\n<note>\n  <to>Tove</to>\n  <from>Jani</from>\n  <heading>Reminder</heading>\n  <body>Don\'t forget me this weekend!</body>\n</note>\n```',
  },
  {
    role: 'USER',
    message:
      'Markdown code block:\n```markdown\n# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6\n```',
  },
  {
    role: 'XT',
    message:
      'Markdown code block:\n```markdown\n# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6\n```',
  },
  {
    role: 'USER',
    message:
      'LaTeX code block:\n```latex\n\\documentclass{article}\n\\begin{document}\n\n\\section{Section}\n\n\\subsection{Subsection}\n\n\\subsubsection{Subsubsection}\n\n\\paragraph{Paragraph}\n\n\\subparagraph{Subparagraph}\n\n\\end{document}\n```',
  },
  {
    role: 'XT',
    message:
      'LaTeX code block:\n```latex\n\\documentclass{article}\n\\begin{document}\n\n\\section{Section}\n\n\\subsection{Subsection}\n\n\\subsubsection{Subsubsection}\n\n\\paragraph{Paragraph}\n\n\\subparagraph{Subparagraph}\n\n\\end{document}\n```',
  },
  {
    role: 'USER',
    message:
      'C code block:\n```c\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n```',
  },
  {
    role: 'XT',
    message:
      'C code block:\n```c\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n```',
  },
  {
    role: 'USER',
    message:
      'C++ code block:\n```cpp\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n```',
  },
  {
    role: 'XT',
    message:
      'C++ code block:\n```cpp\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n```',
  },
  {
    role: 'USER',
    message:
      'C# code block:\n```csharp\nusing System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello, World!");\n    }\n}\n```',
  },
  {
    role: 'XT',
    message:
      'C# code block:\n```csharp\nusing System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello, World!");\n    }\n}\n```',
  },
].map((message) => ({ ...message, timestamp: '2024-07-03T14:16:00Z', children: [] }));

export const moreMockConversations = [
  {
    role: 'USER',
    message: 'What can you tell me about the Mitsubishi 3000GT?',
    timestamp: '2024-07-03T14:16:00Z',
    children: [],
  },
  {
    role: 'BOT',
    message: '[ACTIVITY] Deciding if additional research is required.',
    timestamp: '2024-07-03T14:16:10Z',
    children: [],
  },
  {
    role: 'BOT',
    message: '[ACTIVITY] Searching the web.',
    timestamp: '2024-07-03T14:16:15Z',
    children: [
      {
        role: 'BOT',
        message: '[SUBACTIVITY] Searching for Mitsubishi 3000GT specifications June 21, 2024 02:16 PM.',
        timestamp: '2024-07-03T14:16:20Z',
        children: [
          {
            role: 'BOT',
            message: '[SUBACTIVITY] Browsing https://www.ultimatespecs.com/car-specs/Mitsubishi/m11135/3000GT.',
            timestamp: '2024-07-03T14:16:25Z',
            children: [
              {
                role: 'BOT',
                message: '[SUBACTIVITY] Searching for Mitsubishi 3000GT specifications June 21, 2024 02:16 PM.',
                timestamp: '2024-07-03T14:16:20Z',
                children: [
                  {
                    role: 'BOT',
                    message: '[SUBACTIVITY] Browsing https://www.ultimatespecs.com/car-specs/Mitsubishi/m11135/3000GT.',
                    timestamp: '2024-07-03T14:16:25Z',
                    children: [],
                  },
                  {
                    role: 'BOT',
                    message:
                      '[SUBACTIVITY] Browsing https://www.thedrive.com/news/this-mitsubishi-3000gt-lm-edition-is-a-gran-turismo-legend-made-real.',
                    timestamp: '2024-07-03T14:16:30Z',
                    children: [],
                  },
                  {
                    role: 'BOT',
                    message: '[SUBACTIVITY] Browsing https://www.auto-data.net/en/mitsubishi-3000-gt-model-1713.',
                    timestamp: '2024-07-03T14:16:35Z',
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            role: 'BOT',
            message:
              '[SUBACTIVITY] Browsing https://www.thedrive.com/news/this-mitsubishi-3000gt-lm-edition-is-a-gran-turismo-legend-made-real.',
            timestamp: '2024-07-03T14:16:30Z',
            children: [],
          },
          {
            role: 'BOT',
            message: '[SUBACTIVITY] Browsing https://www.auto-data.net/en/mitsubishi-3000-gt-model-1713.',
            timestamp: '2024-07-03T14:16:35Z',
            children: [],
          },
        ],
      },
      {
        role: 'BOT',
        message: '[SUBACTIVITY] Searching for Mitsubishi 3000GT history and performance June 21, 2024 02:16 PM.',
        timestamp: '2024-07-03T14:16:40Z',
        children: [
          {
            role: 'BOT',
            message: '[SUBACTIVITY] Browsing https://www.ultimatespecs.com/car-specs/Mitsubishi/m11135/3000GT.',
            timestamp: '2024-07-03T14:16:25Z',
            children: [],
          },
          {
            role: 'BOT',
            message:
              '[SUBACTIVITY] Browsing https://www.thedrive.com/news/this-mitsubishi-3000gt-lm-edition-is-a-gran-turismo-legend-made-real.',
            timestamp: '2024-07-03T14:16:30Z',
            children: [],
          },
          {
            role: 'BOT',
            message: '[SUBACTIVITY] Browsing https://www.auto-data.net/en/mitsubishi-3000-gt-model-1713.',
            timestamp: '2024-07-03T14:16:35Z',
            children: [],
          },
        ],
      },
      {
        role: 'BOT',
        message: '[SUBACTIVITY] Searching for Mitsubishi 3000GT reviews and ratings June 21, 2024 02:16 PM.',
        timestamp: '2024-07-03T14:16:45Z',
        children: [],
      },
    ],
  },
  {
    role: 'BOT',
    message:
      "The Mitsubishi 3000GT was a sports car produced by Mitsubishi Motors between 1989 and 2000. It was designed as a luxury performance vehicle, with a focus on handling and acceleration. The car featured a twin-turbocharged V6 engine that produced up to 320 horsepower in some models. The 3000GT was available in both coupe and convertible body styles, with the convertible version being known as the Spyder. It had a sleek design with aerodynamic features such as a rear spoiler and air dams. The car also featured four-wheel steering for improved handling and stability at high speeds. One of the unique aspects of the 3000GT was its all-wheel-drive system, which helped provide better traction and performance on various road conditions. It also had an electronically controlled suspension system that could adjust the ride height and damping rate based on driving conditions. The car's interior was designed with comfort and luxury in mind, featuring leather seats, a premium audio system, and advanced climate control systems. The 3000GT was also equipped with various safety features such as anti-lock brakes, electronic stability control, and airbags. Overall, the Mitsubishi 3000GT was a high-performance sports car that offered a combination of luxury, style, and performance. It was well-regarded for its handling, acceleration, and overall driving experience.",
    timestamp: '2024-07-03T14:19:00Z',
    children: [],
  },
  {
    role: 'USER',
    message: 'Did they come in rear-wheel drive?',
    timestamp: '2024-07-03T14:20:00Z',
    children: [],
  },
  {
    role: 'BOT',
    message: '[ACTIVITY] Generating audio response.',
    timestamp: '2024-07-03T14:20:05Z',
    children: [],
  },
  {
    role: 'BOT',
    message: '<audio controls><source src="audio_link.wav" type="audio/wav"></audio>',
    timestamp: '2024-07-03T14:20:10Z',
    children: [],
  },
  {
    role: 'BOT',
    message:
      'No, the Mitsubishi 3000GT did not come with a rear-wheel-drive option. It was primarily available with an all-wheel-drive system, which was one of its distinguishing features.',
    timestamp: '2024-07-03T14:21:00Z',
    children: [],
  },
  {
    role: 'BOT',
    message:
      'This has the word markdown after the 3 backticks\n\n```markdown\n| Header 1    | Header 2    | Header 3    |\n|-------------|-------------|-------------|\n| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |\n| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |\n| Row 3 Col 1 | Row 3 Col 2 | Row 3 Col 3 |\n```\n\n',
    timestamp: '2024-07-03T14:22:00Z',
    children: [],
  },
  {
    role: 'BOT',
    message:
      "This doesn't have the word markdown after the 3 backticks\n\n```\n| Header 1    | Header 2    | Header 3    |\n|-------------|-------------|-------------|\n| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |\n| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |\n| Row 3 Col 1 | Row 3 Col 2 | Row 3 Col 3 |\n```\n\n",
    timestamp: '2024-07-03T14:22:00Z',
    children: [],
  },
  {
    id: '3b541ebb-e042-4a4b-b744-0887dd52940f',
    role: 'USER',
    message: 'How many of the letter R is in the word Strawberry?\n\n',
    timestamp: '2024-10-09T14:25:34+00:00',
    updated_at: '2024-10-09T14:25:34+00:00',
    updated_by: null,
    feedback_received: false,
    children: [],
  },
  {
    id: 'aad5cb1d-df6e-4af6-9ee6-3d1611ff2487',
    role: 'Biointerpreter',
    message: '[ACTIVITY] Analyzing.',
    timestamp: '2024-10-09T14:25:34+00:00',
    updated_at: '2024-10-09T14:25:34+00:00',
    updated_by: null,
    feedback_received: false,
    children: [],
  },
  {
    id: 'd61eaf45-1647-4faa-9438-c9c224228927',
    role: 'Biointerpreter',
    message:
      "The letter 'r' appears 3 times in the word \"strawberry\".\n\n![Occurrences of 'r' in the word 'strawberry'](https://api.az.mfatwin.com/outputs/33e47176-402d-4c69-901c-8d6c4791b106/5940b3bc-46ed-407a-9872-d66ee2fc1f51/strawberry_r_count.png)",
    timestamp: '2024-10-09T14:26:46+00:00',
    updated_at: '2024-10-09T14:26:46+00:00',
    updated_by: null,
    feedback_received: false,
    children: [],
  },
  {
    id: '8c42d329-28ce-4fa1-991b-207a17839c83',
    role: 'Biointerpreter',
    message: '[ACTIVITY][INFO] Conversation renamed to `Counting Rs in Strawberry`.',
    timestamp: '2024-10-09T14:26:52+00:00',
    updated_at: '2024-10-09T14:26:52+00:00',
    updated_by: null,
    feedback_received: false,
    children: [],
  },
];

export const mockConversation = [...mockUITestConversations, ...moreMockConversations];
