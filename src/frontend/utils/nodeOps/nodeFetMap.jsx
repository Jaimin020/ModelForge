import { XMLParser } from 'fast-xml-parser';

export const getNodeFeatureMap = async (xmlFileName) => {
  const nodeFeatureMap = new Map();

  // Read XML file
  const xmlData = await window.file.readFile(xmlFileName);

  // Initialize XML parser
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    allowBooleanAttributes: true,
    parseAttributeValue: true,
    parseTagValue: true,
    trimValues: true
  });
  const result = parser.parse(xmlData);

  // Extract node names and features
  if (result.nodes && result.nodes.node) {
    result.nodes.node.forEach(node => {
      const nodeInfo = {
        name: node.name,
        feature: node.feature,
        library: node.library,
        codeId: node.codeId,
        inport: node.inport,
        outport: node.outport,
        parameters: node.parameters.param,
        code: node.code
      };
      nodeFeatureMap.set(node.name, nodeInfo);
    });
  }
  
  return nodeFeatureMap;
};
