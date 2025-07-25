import { alignToSpec } from '../../../dist/alignToSpec.js';
import { loadSampleSpec } from './loadSpec.js';

interface TestData {
  [key: string]: any;
}

// Sample additional info data (similar to what textToJson might return)
const sampleAddInfo1 = {
  name: "Sarah Johnson",
  age: 28,
  title: "Senior Software Engineer",
  company: "Google",
  hobbies: ["hiking", "photography"],
  // New fields not in spec
  location: "San Francisco, California",
  educationBackground: "Bachelor's degree in Computer Science from Stanford University",
  workExperience: "2 years at TechFlow, 3 years at Google",
  programmingSkills: "JavaScript, TypeScript, Python, Java, React, Node.js",
  hometown: "Seattle"
};

// Sample with case differences and partial matches
const sampleAddInfo2 = {
  Name: "Mike Chen", // Different case
  AGE: 32, // Different case
  jobTitle: "Tech Lead", // Partial match with 'title'
  company: "Amazon", // Exact match
  interests: ["rock climbing", "cooking"], // Different from 'hobbies'
  // New fields
  location: "Austin, Texas",
  education: "Master's in Software Engineering",
  experience: "8 years total",
  spokenLanguages: "English, Mandarin"
};

// Sample with missing data
const sampleAddInfo3 = {
  name: "Alex Rivera",
  age: 26,
  company: "Startup Inc",
  // Missing title and hobbies from spec
  // New fields
  location: "Miami, FL",
  programmingSkills: "React, Vue.js, Node.js",
  portfolio: "https://alexrivera.dev",
  availability: "Available immediately"
};

function runAlignmentTest(testName: string, spec: any, addInfo: TestData): void {
  console.log(`\n🧪 ${testName}`);
  console.log('=' .repeat(50));
  
  console.log('\n📋 Spec:');
  console.log(JSON.stringify(spec, null, 2));
  
  console.log('\n📝 Additional Info:');
  console.log(JSON.stringify(addInfo, null, 2));
  
  const result = alignToSpec(spec, addInfo);
  
  if (result.success) {
    console.log('\n✅ Merged JSON Result:');
    console.log(JSON.stringify(result.mergedData, null, 2));
    
    if (result.newColumns && result.newColumns.length > 0) {
      console.log('\n🆕 New Columns Found:');
      result.newColumns.forEach((col, index) => {
        console.log(`${index + 1}. ${col}`);
      });
    } else {
      console.log('\n✨ No new columns found');
    }
  } else {
    console.log('\n❌ Error:', result.error);
  }
}

function runAllTests(): void {
  // Load the sample spec from JSON file
  const sampleSpec = loadSampleSpec();
  
  console.log('🎯 AlignToSpec Function Tests');
  console.log('=' .repeat(60));
  
  // Test 1: Perfect alignment with new columns
  runAlignmentTest(
    'Test 1: Perfect Alignment + New Columns',
    sampleSpec,
    sampleAddInfo1
  );
  
  // Test 2: Case differences and partial matches
  runAlignmentTest(
    'Test 2: Case Differences + Partial Matches',
    sampleSpec,
    sampleAddInfo2
  );
  
  // Test 3: Missing data
  runAlignmentTest(
    'Test 3: Missing Data + New Columns',
    sampleSpec,
    sampleAddInfo3
  );
  
  // Test 4: Error handling - invalid inputs
  console.log('\n🧪 Test 4: Error Handling');
  console.log('=' .repeat(50));
  
  const errorTest1 = alignToSpec(null, sampleAddInfo1);
  console.log('Invalid spec test:', errorTest1.success ? 'FAILED' : `PASSED - ${errorTest1.error}`);
  
  const errorTest2 = alignToSpec(sampleSpec, null);
  console.log('Invalid addInfo test:', errorTest2.success ? 'FAILED' : `PASSED - ${errorTest2.error}`);
  
  console.log('\n✨ All tests completed!');
}

// Run tests
runAllTests();