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
  options: TextToJsonOptions,
  existingData?: Record<string, unknown>
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
      const existingDataStr = existingData ? JSON.stringify(existingData, null, 2) : 'No existing data';
      
      prompt = `
Please parse the following text and extract therapist profile information. Format the output according to the provided JSON schema structure.

IMPORTANT: You are updating an existing therapist profile. Only return fields that contain NEW or UPDATED information from the text. Do not repeat existing information unless it's being modified.

Text to Parse:
${text}

Current Existing Therapist Data:
${existingDataStr}

Required Schema Structure:
The output must follow this exact structure with these main sections:
- personalInfo: Basic personal and contact information
- professionalInfo: Professional qualifications and specializations  
- styleAndApproach: Therapeutic styles and approaches
- availability: Schedule and timezone information (as a readable text string)

Schema Example:
${schemaExample}

Interested Items to Consider:
${interestedInfo.map((item: string, index: number) => `${index + 1}. ${item}`).join('\n')}

Instructions:
1. DELTA UPDATE MODE: Only extract NEW or CHANGED information from the text
2. Compare against the existing data above - do not repeat unchanged information
3. Focus on the interested items but organize them into the proper schema sections
4. Use the exact field names from the schema (firstName, lastName, email, etc.)
5. For primaryConcerns, use only values from the allowed enum list in the schema
6. For therapistStyles, use only values from the allowed enum list in the schema
7. If information already exists and hasn't changed, omit those fields entirely
8. Only include fields where the text provides NEW, ADDITIONAL, or UPDATED information
9. For availability, MERGE with existing availability using intelligent conflict resolution:
   - ADDING NEW DAYS: If text mentions new days, add them: "Monday 9-5pm" + "available Wednesday too" → "Monday 9-5pm, Wednesday 9-5pm"
   - CONFLICTING TIME SLOTS: If new time overlaps/conflicts with existing time on same day, REPLACE the conflicting slot:
     * "Friday 10-12pm" + "Friday change to 10-3pm" → "Friday 10-3pm" (replaces 10-12pm because 10-3pm covers it)
     * "Friday 9-2pm" + "Friday now 10-3pm" → "Friday 10-3pm" (replaces because times overlap)
   - NON-CONFLICTING TIME SLOTS: If new time doesn't conflict with existing time on same day, ADD both:
     * "Friday 10-12pm" + "Friday 3-5pm" → "Friday 10-12pm, 3-5pm" (no overlap, so add both)
     * "Monday 9-12pm" + "Monday 2-5pm" → "Monday 9-12pm, 2-5pm" (gap between times, so add both)
   - MODIFICATION KEYWORDS: Look for words like "change to", "now", "instead", "replace" to identify replacements vs additions
   - Always preserve existing availability for days/times not mentioned in the text
   - Return as a simple text string describing the COMPLETE merged schedule
10. Return only valid JSON with DELTA changes matching the schema structure

Example scenarios:
- If existing data has firstName: "John" and text mentions "John", omit firstName from output
- If existing data has email: "old@email.com" and text mentions "new@email.com", include the new email
- If existing primaryConcerns: ["Anxiety"] and text mentions "Depression", include both: ["Anxiety", "Depression"]
- If existing availability: "Monday 9-5pm" and text says "I'm also available Wednesday 10-4pm", return "Monday 9-5pm, Wednesday 10-4pm"
- If existing availability: "Friday 10-12pm" and text says "Friday change to 10-3pm", return "Friday 10-3pm" (replaces conflicting time)
- If existing availability: "Friday 10-12pm" and text says "Friday 3-5pm", return "Friday 10-12pm, 3-5pm" (adds non-conflicting time)
- If existing availability: "Monday 9-2pm, Wednesday 10-4pm" and text says "Monday now 10-3pm", return "Monday 10-3pm, Wednesday 10-4pm" (replaces overlapping Monday time)
- If existing availability: "Tuesday 9-12pm" and text says "Tuesday also 2-5pm", return "Tuesday 9-12pm, 2-5pm" (adds separate time slot)
- If no new information is found, return an empty object: {}

Example delta output format (only new/changed fields):
{
  "professionalInfo": {
    "specializations": "Added: Trauma Therapy, Family Counseling",
    "primaryConcerns": ["Anxiety", "Depression", "PTSD"]
  },
  "personalInfo": {
    "phone": "Updated phone number"
  },
  "availability": "Monday 9-5pm, Wednesday 10-4pm, Friday 10-12pm, 3-5pm"
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