import { XMLParser } from 'fast-xml-parser';
import { getNodeFeatureMap } from './nodeFetMap';
import { PYTORCH_NODE_PATH } from '../../../envPath';


export const getNodeByName = async (nodeName) => {
  const fetMap = await getNodeFeatureMap(
    PYTORCH_NODE_PATH,
  );
  return fetMap.get(nodeName);
};
