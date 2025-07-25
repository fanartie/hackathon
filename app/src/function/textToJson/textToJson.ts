import OpenAI from 'openai';

interface TextToJsonOptions {
  apiKey: string;
  model?: string;
  temperature?: number;
}

interface ParsedResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
} 

export async function textToJson(
  text: string,
  interestedInfo: string[],
  options: TextToJsonOptions
): Promise<ParsedResult> {
  try {
    if (!text.trim()) {
      return {
        success: false,
        error: 'Input text cannot be empty'
      };
    }

    if (!interestedInfo.length) {
      return {
        success: false,
        error: 'Interested info list cannot be empty'
      };
    }

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

    const prompt = `
Please parse the following text and extract information ONLY for the specified interested items. Do not include any other data in the output.

Text to Parse:
${text}

Interested Items to Extract (ONLY these items):
${interestedInfo.map((item, index) => `${index + 1}. ${item}`).join('\n')}

Instructions:
1. Extract information ONLY for the items listed above
2. If an interested item is not found in the text, omit that key from the output
3. Do NOT include any other information that is not in the interested items list
4. Use camelCase for JSON keys (e.g., "client name" becomes "clientName")
5. Return only valid JSON without any additional text or formatting
6. Be precise and extract only what is explicitly mentioned for the specified items

Example output format (only include keys that match the interested items):
{
  "clientName": "John Smith",
  "age": "25 years old",
  "primaryConcerns": ["work stress", "sleep issues"]
}
`;

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