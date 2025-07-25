// Simple Node.js script to run alignToSpec test
// Usage: node src/function/alignToSpec/runTest.js

import { alignToSpec } from '../../../dist/alignToSpec.js';
import { loadSampleSpec } from './loadSpec.js';

// Sample test data
const testData = {
  name: "John Smith",
  age: 30,
  title: "Frontend Developer",
  company: "TechCorp",
  hobbies: ["reading", "coding"],
  // Additional fields not in spec
  location: "Boston, MA",
  education: "Bachelor's in CS",
  experience: "5 years",
  skills: "React, TypeScript, Node.js"
};

// Load the sample spec from JSON file
const sampleSpec = loadSampleSpec();

console.log('🎯 AlignToSpec Function Test\n');
console.log('📋 Spec (loaded from sampleSpec.json):');
console.log(JSON.stringify(sampleSpec, null, 2));

console.log('\n📝 Test Data:');
console.log(JSON.stringify(testData, null, 2));

console.log('\n⚙️ Running alignment...\n');

const result = alignToSpec(sampleSpec, testData);

if (result.success) {
  console.log('✅ Final Merged JSON:');
  console.log(JSON.stringify(result.mergedData, null, 2));
  
  if (result.newColumns && result.newColumns.length > 0) {
    console.log('\n🆕 New Columns:');
    result.newColumns.forEach((col, index) => {
      console.log(`${index + 1}. ${col}`);
    });
  }
} else {
  console.log('❌ Error:', result.error);
}

console.log('\n✨ Test completed!');