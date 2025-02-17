import { XMLParser } from 'fast-xml-parser';
import { getNodeFeatureMap } from './nodeFetMap';

export const getNodeByName = async (nodeName) => {
  const fetMap = await getNodeFeatureMap(
    '/Users/jaiminchauhan/Projects/Git/ModelForge/src/frontend/utils/pyTorchNodes.xml',
  );
  return fetMap.get(nodeName);
};
