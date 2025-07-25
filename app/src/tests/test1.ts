// Integrated Test: textToJson -> alignToSpec Pipeline
// This test demonstrates the full workflow of parsing interview text and aligning it to a spec

import { textToJson } from '../function/textToJson/textToJson.js';
import { alignToSpec } from '../function/alignToSpec/alignToSpec.js';
import { loadSampleSpec } from '../function/alignToSpec/loadSpec.js';

// Hardcoded OpenAI API key for deployment
const OPENAI_API_KEY = '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';

// Sample interview transcript for testing
const interviewTranscript = `
Interviewer: Hi there! Could you please introduce yourself?

Candidate: Hello! My name is Emma Rodriguez. I'm 32 years old and currently living in Austin, Texas. I have a Master's degree in Computer Science from UT Austin, which I completed in 2019. Before that, I got my Bachelor's in Software Engineering from Texas A&M in 2017.

Interviewer: Great! Tell me about your current work situation.

Candidate: I'm currently working as a Senior Full Stack Developer at Microsoft, where I've been for the past 2 years. Before Microsoft, I worked at a fintech startup called PayFlow for 3 years as a Backend Developer. So I have about 5 years of total professional experience.

Interviewer: What technologies do you work with?

Candidate: I'm proficient in JavaScript, TypeScript, Python, and C#. I work extensively with React for frontend, Node.js and .NET for backend, and I'm comfortable with both SQL and NoSQL databases. I also have experience with Azure cloud services and Docker containerization.

Interviewer: Any hobbies or interests outside of work?

Candidate: I love rock climbing and mountain biking. I also enjoy cooking and I volunteer at local tech meetups to help mentor junior developers. Oh, and I'm originally from San Antonio, Texas.

Interviewer: What's your ideal work arrangement?

Candidate: I prefer hybrid work - maybe 3 days in office and 2 days remote. I'm also open to full remote opportunities for the right role.
`;

// Interested information for textToJson parsing
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
  'hometown',
  'work preference'
];

async function runIntegratedTest(): Promise<void> {
  console.log('🔄 Integrated Test: textToJson → alignToSpec Pipeline');
  console.log('=' .repeat(60));
  
  // Use hardcoded API key
  const apiKey = OPENAI_API_KEY;

  try {
    // Step 1: Parse interview text with textToJson
    console.log('\n📝 Step 1: Parsing Interview Text with textToJson');
    console.log('-' .repeat(50));
    console.log('Interview Transcript:');
    console.log(interviewTranscript.trim());
    
    console.log('\n🎯 Interested Information:');
    interestedInfo.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });
    
    console.log('\n⏳ Processing with OpenAI...');
    
    const textToJsonResult = await textToJson(interviewTranscript, interestedInfo, {
      apiKey,
      model: 'gpt-3.5-turbo',
      temperature: 0.3
    });

    if (!textToJsonResult.success) {
      console.log('❌ textToJson failed:', textToJsonResult.error);
      return;
    }

    console.log('\n✅ textToJson Result:');
    console.log(JSON.stringify(textToJsonResult.data, null, 2));

    // Step 2: Load the specification
    console.log('\n📋 Step 2: Loading Specification');
    console.log('-' .repeat(50));
    
    const spec = loadSampleSpec();
    console.log('Spec loaded from /src/spec/sampleSpec.json:');
    console.log(JSON.stringify(spec, null, 2));

    // Step 3: Align parsed data to specification
    console.log('\n🔧 Step 3: Aligning Data with alignToSpec');
    console.log('-' .repeat(50));
    
    const alignResult = alignToSpec(spec, textToJsonResult.data || {});

    if (!alignResult.success) {
      console.log('❌ alignToSpec failed:', alignResult.error);
      return;
    }

    console.log('✅ Final Merged JSON Result:');
    console.log(JSON.stringify(alignResult.mergedData, null, 2));

    if (alignResult.newColumns && alignResult.newColumns.length > 0) {
      console.log('\n🆕 New Columns Added:');
      alignResult.newColumns.forEach((col: string, index: number) => {
        console.log(`${index + 1}. ${col}`);
      });
    }

    // Step 4: Analysis Summary
    console.log('\n📊 Step 4: Pipeline Analysis');
    console.log('-' .repeat(50));
    
    const specKeys = Object.keys(spec);
    const parsedKeys = Object.keys(textToJsonResult.data || {});
    const finalKeys = Object.keys(alignResult.mergedData || {});

    console.log(`📋 Spec template fields: ${specKeys.length}`);
    console.log(`📝 Parsed fields from text: ${parsedKeys.length}`);
    console.log(`🔧 Final merged fields: ${finalKeys.length}`);
    console.log(`🆕 New fields discovered: ${alignResult.newColumns?.length || 0}`);

    // Show field mapping
    console.log('\n🔗 Field Mapping Analysis:');
    specKeys.forEach(specKey => {
      const finalValue = alignResult.mergedData?.[specKey];
      const specValue = (spec as unknown as Record<string, unknown>)[specKey];
      const wasUpdated = JSON.stringify(finalValue) !== JSON.stringify(specValue);
      const status = wasUpdated ? '✅ Updated' : '📋 Kept default';
      console.log(`  ${specKey}: ${status}`);
    });

    console.log('\n✨ Pipeline Test Completed Successfully!');
    console.log('🎯 The interview text was successfully parsed and aligned to the specification.');

  } catch (error) {
    console.log('❌ Pipeline Error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Additional test with different interview data
async function runSecondTest(): Promise<void> {
  console.log('\n\n🔄 Additional Test: Different Interview Data');
  console.log('=' .repeat(60));

  const shortInterview = `
  My name is Alex Kim, I'm 26, living in Seattle. I work as a DevOps Engineer at Amazon. 
  I love gaming and photography. I studied Computer Engineering at UW.
  `;

  const simpleInfo = ['name', 'age', 'title', 'company', 'hobbies'];

  const apiKey = OPENAI_API_KEY;
  
  try {
    console.log('\n📝 Short Interview Text:');
    console.log(shortInterview.trim());

    const result1 = await textToJson(shortInterview, simpleInfo, { apiKey });
    
    if (result1.success) {
      console.log('\n✅ Parsed Data:');
      console.log(JSON.stringify(result1.data, null, 2));

      const spec = loadSampleSpec();
      const result2 = alignToSpec(spec, result1.data || {});

      if (result2.success) {
        console.log('\n🔧 Aligned Result:');
        console.log(JSON.stringify(result2.mergedData, null, 2));
      }
    }

  } catch (error) {
    console.log('❌ Second test error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Run the tests
console.log('🧪 Starting Integrated Pipeline Tests\n');

runIntegratedTest()
  .then(() => runSecondTest())
  .then(() => {
    console.log('\n🎉 All integrated tests completed!');
  })
  .catch(error => {
    console.log('❌ Test suite error:', error.message);
  });