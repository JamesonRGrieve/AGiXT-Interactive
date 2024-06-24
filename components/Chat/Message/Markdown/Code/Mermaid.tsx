import React from 'react';
import mermaid from 'mermaid';
// https://codesandbox.io/p/sandbox/react-with-mermaid-ex9f7?file=%2Fsrc%2FMermaid.js%3A1%2C1-64%2C1
mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  themeCSS: `
    g.classGroup rect {
      fill: #282a36;
      stroke: #6272a4;
    } 
    g.classGroup text {
      fill: #f8f8f2;
    }
    g.classGroup line {
      stroke: #f8f8f2;
      stroke-width: 0.5;
    }
    .classLabel .box {
      stroke: #21222c;
      stroke-width: 3;
      fill: #21222c;
      opacity: 1;
    }
    .classLabel .label {
      fill: #f1fa8c;
    }
    .relation {
      stroke: #ff79c6;
      stroke-width: 1;
    }
    #compositionStart, #compositionEnd {
      fill: #bd93f9;
      stroke: #bd93f9;
      stroke-width: 1;
    }
    #aggregationEnd, #aggregationStart {
      fill: #21222c;
      stroke: #50fa7b;
      stroke-width: 1;
    }
    #dependencyStart, #dependencyEnd {
      fill: #00bcd4;
      stroke: #00bcd4;
      stroke-width: 1;
    } 
    #extensionStart, #extensionEnd {
      fill: #f8f8f2;
      stroke: #f8f8f2;
      stroke-width: 1;
    }`,
  fontFamily: 'Fira Code',
});
/*
function convertCSV(content, setLoading = null) {
  // Simulate setLoading if provided
  if (setLoading) setLoading(true);
  console.log('Trying to render Mermaid: ');
  console.log(content);
  try {
    // Attempt to parse content as JSON
    const jsonContent = JSON.parse(content);
    console.log('Parsed JSON: ', jsonContent);
    // If parsing succeeds, return the JSON content immediately
    if (setLoading) setLoading(false); // Ensure loading is set to false before returning
    return content;
  } catch (error) {
    // If JSON parsing fails, proceed with the original conversion logic
    console.log('Error parsing JSON: ', error);
    let processedContent = [];

    // Check if content is a single string (assuming content comes as an array with a single string or an array of strings)
    if (content.length === 1 && typeof content[0] === 'string') {
      processedContent = content[0]
        .split('\n') // Split the single string by newline to get rows
        .filter((row) => row.trim()) // Remove empty rows
        .map((row) => row.trim()); // Trim each row
    } else if (content.every && content.every((item) => typeof item === 'string')) {
      // If content is an array of strings
      processedContent = content
        .filter((row) => row.trim()) // Remove empty rows
        .map((row) => row.trim()); // Trim each row
    }
    console.log('Processed content: ', processedContent);
    // Simulate setLoading if provided
    if (setLoading) setLoading(false);

    return processedContent;
  }
}
*/
interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  console.log('Rendering Chart', chart);
  React.useEffect(() => {
    mermaid.contentLoaded();
  }, []);

  return <div className='mermaid'>{chart}</div>;
};

export default Mermaid;
