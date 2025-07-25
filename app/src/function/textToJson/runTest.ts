// Simple TypeScript script to run the test
// Usage: tsx src/function/textToJson/runTest.ts

import { textToJson } from './textToJson.js';

// Hardcoded OpenAI API key for deployment
const OPENAI_API_KEY = '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';

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

async function runTest() {
  console.log('🚀 Testing textToJson function...\n');

  const apiKey = OPENAI_API_KEY;

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

runTest();