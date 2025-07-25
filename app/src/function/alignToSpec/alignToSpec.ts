interface AlignResult {
  success: boolean;
  mergedData?: Record<string, unknown>;
  newColumns?: string[];
  error?: string;
}

/**
 * Aligns additional information to a specification format and returns merged JSON
 * @param spec - JSON sample that defines the expected structure
 * @param addInfo - JSON data to be merged with the spec
 * @returns AlignResult with merged JSON data, new columns, and status
 */
export function alignToSpec(
  spec: Record<string, unknown>,
  addInfo: Record<string, unknown>
): AlignResult {
  try {
    if (!spec || typeof spec !== 'object') {
      return {
        success: false,
        error: 'Spec must be a valid object'
      };
    }

    if (!addInfo || typeof addInfo !== 'object') {
      return {
        success: false,
        error: 'Additional info must be a valid object'
      };
    }

    const mergedData: Record<string, unknown> = {};
    const newColumns: string[] = [];
    const specKeys = Object.keys(spec);
    const addInfoKeys = Object.keys(addInfo);

    // First, merge spec keys with matching addInfo data
    for (const specKey of specKeys) {
      // Try to find exact match first
      if (addInfo.hasOwnProperty(specKey)) {
        mergedData[specKey] = addInfo[specKey];
        continue;
      }

      // Try to find case-insensitive match
      const matchingKey = addInfoKeys.find(
        key => key.toLowerCase() === specKey.toLowerCase()
      );
      
      if (matchingKey) {
        mergedData[specKey] = addInfo[matchingKey];
        continue;
      }

      // Try to find partial match (contains)
      const partialMatch = addInfoKeys.find(key => 
        key.toLowerCase().includes(specKey.toLowerCase()) ||
        specKey.toLowerCase().includes(key.toLowerCase())
      );

      if (partialMatch) {
        mergedData[specKey] = addInfo[partialMatch];
        continue;
      }

      // If no match found, use spec default value or set to null
      mergedData[specKey] = spec[specKey] || null;
    }

    // Add new columns that don't exist in spec to the merged data
    for (const addInfoKey of addInfoKeys) {
      const keyUsed = specKeys.some(specKey => {
        const exactMatch = specKey === addInfoKey;
        const caseInsensitiveMatch = specKey.toLowerCase() === addInfoKey.toLowerCase();
        const partialMatch = specKey.toLowerCase().includes(addInfoKey.toLowerCase()) ||
                           addInfoKey.toLowerCase().includes(specKey.toLowerCase());
        
        return exactMatch || caseInsensitiveMatch || partialMatch;
      });

      if (!keyUsed) {
        mergedData[addInfoKey] = addInfo[addInfoKey];
        newColumns.push(addInfoKey);
      }
    }

    return {
      success: true,
      mergedData,
      newColumns
    };

  } catch (error) {
    return {
      success: false,
      error: `Alignment error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Sample specification for interview data
export const sampleInterviewSpec = {
  name: 'abc',
  age: 58,
  title: 'programmer',
  company: 'layla',
  hobbies: ['basketball', 'tennis']
};