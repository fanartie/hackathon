// Simple TypeScript script to run the test
// Usage: tsx src/function/textToJson/runTest.ts

import { textToJson } from './textToJson.js';

// Load OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key-here';

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

    // Test with schema (default)
    console.log('\n⏳ Processing with Schema-based format...\n');
    const schemaResult = await textToJson(sampleInterviewText, {
      apiKey,
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      useSchema: true
    });

    if (schemaResult.success) {
      console.log('✅ Schema-based result:');
      console.log(JSON.stringify(schemaResult.data, null, 2));
    } else {
      console.log('❌ Schema-based error:', schemaResult.error);
    }

    // Test with schema and existing data (delta update)
    const existingData = {
      personalInfo: {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.old@email.com"
      },
      professionalInfo: {
        primaryConcerns: ["Anxiety"]
      },
      availability: "Monday 9-5pm, Friday 10-12pm"
    };

    console.log('\n⏳ Processing with Schema-based format + Existing Data (Delta Update)...\n');
    
    // Use text that specifically tests sophisticated availability merging
    const availabilityUpdateText = `
    Sarah mentioned she's also available on Wednesday from 2-6pm now. 
    She's added Depression to her specializations and can also work with PTSD clients.
    Her new contact email is sarah.johnson@newclinic.com.
    She also said Friday she can do 3-5pm in addition to her morning slot.
    `;
    
    const deltaResult = await textToJson(availabilityUpdateText, {
      apiKey,
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      useSchema: true
    }, existingData);

    if (deltaResult.success) {
      console.log('✅ Delta Update result:');
      console.log(JSON.stringify(deltaResult.data, null, 2));
    } else {
      console.log('❌ Delta Update error:', deltaResult.error);
    }

    // Test availability conflict resolution
    const conflictData = {
      personalInfo: {
        firstName: "Dr. Mike",
        lastName: "Wilson"
      },
      availability: "Friday 10-12pm, Monday 9-5pm"
    };

    console.log('\n⏳ Testing Availability Conflict Resolution...\n');
    
    const conflictText = `
    Dr. Wilson mentioned that Friday he's changing to 10-3pm instead of his current morning slot.
    He's also adding Tuesday 2-5pm to his schedule.
    `;
    
    const conflictResult = await textToJson(conflictText, {
      apiKey,
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      useSchema: true
    }, conflictData);

    if (conflictResult.success) {
      console.log('✅ Conflict Resolution result (should replace Friday 10-12pm with 10-3pm and add Tuesday):');
      console.log(JSON.stringify(conflictResult.data, null, 2));
    } else {
      console.log('❌ Conflict Resolution error:', conflictResult.error);
    }

    // Test without schema (interested items only)
    console.log('\n⏳ Processing with Interested Items only...\n');
    const itemsResult = await textToJson(sampleInterviewText, {
      apiKey,
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      useSchema: false
    });

    if (itemsResult.success) {
      console.log('✅ Interested Items result:');
      console.log(JSON.stringify(itemsResult.data, null, 2));
    } else {
      console.log('❌ Interested Items error:', itemsResult.error);
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error);
  }
}

runTest();