import { XMLParser } from 'fast-xml-parser';

export const getNodeNames = async (xmlFileName) => {
  const nodeNames = [];

  // Read XML file
  const xmlData = await window.file.readFile(xmlFileName);

  // Initialize XML parser
  const parser = new XMLParser();
  const result = parser.parse(xmlData);

  // Extract node names
  if (result.nodes && result.nodes.node) {
    result.nodes.node.forEach(node => {
      nodeNames.push(node.name);
    });
  }
  
  return nodeNames;
};