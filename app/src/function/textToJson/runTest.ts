// Simple TypeScript script to run the test
// Usage: tsx src/function/textToJson/runTest.ts

import dotenv from 'dotenv';
import { textToJson } from './textToJson.js';

// Load environment variables from .env file
dotenv.config();

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

  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your-openai-api-key-here') {
    console.log('❌ Please set your OpenAI API key in the .env file:');
    console.log('1. Open the .env file in the root directory');
    console.log('2. Replace "your-openai-api-key-here" with your actual API key');
    console.log('3. Your API key should start with "sk-"\n');
    console.log('Then run: node src/function/textToJson/runTest.js\n');
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

runTest();