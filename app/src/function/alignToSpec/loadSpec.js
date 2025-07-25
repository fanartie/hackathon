import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads the sample spec from spec/sampleSpec.json
 * @returns {Object} The sample specification object
 */
export function loadSampleSpec() {
  try {
    const specPath = path.join(__dirname, '../../spec/sampleSpec.json');
    const specContent = fs.readFileSync(specPath, 'utf8');
    return JSON.parse(specContent);
  } catch (error) {
    console.error('Error loading sample spec:', error.message);
    // Fallback to hardcoded spec
    return {
      name: 'abc',
      age: 58,
      title: 'programmer',
      company: 'layla',
      hobbies: ['basketball', 'tennis']
    };
  }
}