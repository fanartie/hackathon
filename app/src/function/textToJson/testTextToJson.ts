import { textToJson } from './textToJson';

// Sample interview script
const sampleInterviewText = `
Interviewer: Hi, could you please introduce yourself?

Candidate: Hello! My name is Sarah Johnson. I'm 28 years old and I currently live in San Francisco, California. I graduated from Stanford University in 2018 with a Bachelor's degree in Computer Science, and later completed my Master's degree in Software Engineering from UC Berkeley in 2020.

Interviewer: That's great! What's your current role?

Candidate: I'm currently working as a Senior Software Engineer at Google, where I've been for the past 3 years. Before that, I worked at a startup called TechFlow for 2 years as a Full Stack Developer.

Interviewer: What programming languages are you most comfortable with?

Candidate: I'm primarily skilled in JavaScript, TypeScript, Python, and Java. I also have experience with React, Node.js, and various cloud technologies like AWS and GCP.

Interviewer: Do you have any hobbies or interests outside of work?

Candidate: Yes! I love hiking and photography. I also volunteer at local coding bootcamps on weekends to help teach beginners. I'm originally from Seattle but moved to the Bay Area for my career.
`;

// List of information we want to extract
const interestedInfo = [
  'name',
  'age', 
  'location',
  'education background',
  'current job title',
  'current company',
  'work experience',
  'programming skills',
  'hobbies',
  'hometown'
];

// Test function
async function runTest() {
  console.log('🚀 Testing textToJson function...\n');

  // Note: Replace with your actual OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY || 'your-openai-api-key-here';
  
  if (apiKey === 'your-openai-api-key-here') {
    console.log('❌ Please set your OpenAI API key in the OPENAI_API_KEY environment variable or update the apiKey variable in this file.\n');
    console.log('Example: export OPENAI_API_KEY="sk-your-key-here"\n');
    return;
  }

  try {
    console.log('📝 Sample Interview Text:');
    console.log(sampleInterviewText);
    console.log('\n🎯 Interested Information:');
    interestedInfo.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });
    console.log('\n⏳ Processing with OpenAI...\n');

    const result = await textToJson(sampleInterviewText, interestedInfo, {
      apiKey,
      model: 'gpt-3.5-turbo',
      temperature: 0.3
    });

    if (result.success) {
      console.log('✅ Success! Parsed JSON result:');
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Error:', result.error);
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error);
  }
}

// Test with invalid inputs
async function runErrorTests() {
  console.log('\n🧪 Testing error handling...\n');

  const apiKey = process.env.OPENAI_API_KEY || 'your-openai-api-key-here';

  // Test 1: Empty text
  console.log('Test 1: Empty text');
  const test1 = await textToJson('', interestedInfo, { apiKey });
  console.log('Result:', test1.success ? 'Success' : `Error: ${test1.error}`);

  // Test 2: Empty interested info
  console.log('\nTest 2: Empty interested info');
  const test2 = await textToJson(sampleInterviewText, [], { apiKey });
  console.log('Result:', test2.success ? 'Success' : `Error: ${test2.error}`);

  // Test 3: Missing API key
  console.log('\nTest 3: Missing API key');
  const test3 = await textToJson(sampleInterviewText, interestedInfo, { apiKey: '' });
  console.log('Result:', test3.success ? 'Success' : `Error: ${test3.error}`);
}

// Run the tests
if (require.main === module) {
  console.log('🎯 TextToJson Function Test\n');
  console.log('=' .repeat(50));
  
  runTest().then(() => {
    return runErrorTests();
  }).then(() => {
    console.log('\n✨ Test completed!');
  });
}

export { runTest, runErrorTests, sampleInterviewText, interestedInfo };