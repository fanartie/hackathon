import OpenAI from 'openai';
import interestedItems from '../../spec/interested.json';
import therapistFormSchema from '../../schemas/therapistFormSchema.json';

interface TextToJsonOptions {
  apiKey: string;
  model?: string;
  temperature?: number;
  useSchema?: boolean;
}

interface ParsedResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
} 

export async function textToJson(
  text: string,
  options: TextToJsonOptions
): Promise<ParsedResult> {
  try {
    if (!text.trim()) {
      return {
        success: false,
        error: 'Input text cannot be empty'
      };
    }

    const interestedInfo = interestedItems;
    const useSchema = options.useSchema !== false; // Default to true

    if (!options.apiKey) {
      return {
        success: false,
        error: 'OpenAI API key is required'
      };
    }

    const openai = new OpenAI({
      apiKey: options.apiKey,
      dangerouslyAllowBrowser: true,
    });

    let prompt = '';

    if (useSchema) {
      // Generate schema-based prompt
      const schemaExample = JSON.stringify(therapistFormSchema.examples[0], null, 2);
      
      prompt = `
Please parse the following text and extract therapist profile information. Format the output according to the provided JSON schema structure.

Text to Parse:
${text}

Required Schema Structure:
The output must follow this exact structure with these main sections:
- personalInfo: Basic personal and contact information
- professionalInfo: Professional qualifications and specializations  
- styleAndApproach: Therapeutic styles and approaches
- availability: Schedule and timezone information

Schema Example:
${schemaExample}

Interested Items to Consider:
${interestedInfo.map((item: string, index: number) => `${index + 1}. ${item}`).join('\n')}

Instructions:
1. Extract information that fits into the schema structure above
2. Focus on the interested items but organize them into the proper schema sections
3. Use the exact field names from the schema (firstName, lastName, email, etc.)
4. For primaryConcerns, use only values from the allowed enum list in the schema
5. For therapistStyles, use only values from the allowed enum list in the schema
6. If specific information is not found, omit those optional fields
7. Required fields: personalInfo.firstName and personalInfo.lastName must be present if found
8. Return only valid JSON matching the schema structure
9. Do not include availability section unless schedule information is explicitly mentioned

Example output format:
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Smith", 
    "email": "john@example.com"
  },
  "professionalInfo": {
    "licenses": "Licensed Clinical Social Worker",
    "specializations": "Cognitive Behavioral Therapy",
    "primaryConcerns": ["Anxiety", "Depression"]
  },
  "styleAndApproach": {
    "therapistStyles": ["logical_teaching", "solution_oriented"]
  }
}
`;
    } else {
      // Original interested items only prompt
      prompt = `
Please parse the following text and extract information ONLY for the specified interested items. Do not include any other data in the output.

Text to Parse:
${text}

Interested Items to Extract (ONLY these items):
${interestedInfo.map((item: string, index: number) => `${index + 1}. ${item}`).join('\n')}

Instructions:
1. Extract information ONLY for the items listed above
2. If an interested item is not found in the text, omit that key from the output
3. Do NOT include any other information that is not in the interested items list
4. Use camelCase for JSON keys (e.g., "client name" becomes "clientName")
5. Return only valid JSON without any additional text or formatting
6. Be precise and extract only what is explicitly mentioned for the specified items

Example output format (only include keys that match the interested items):
{
  "specializations": "Cognitive Behavioral Therapy",
  "location": "Toronto, ON",
  "clientConcerns": ["Anxiety", "Depression"]
}
`;
    }

    const completion = await openai.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.3,
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      return {
        success: false,
        error: 'No response from OpenAI API'
      };
    }

    try {
      const parsedData = JSON.parse(responseContent);
      return {
        success: true,
        data: parsedData
      };
    } catch (parseError) {
      return {
        success: false,
        error: `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
      };
    }

  } catch (error) {
    return {
      success: false,
      error: `OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}