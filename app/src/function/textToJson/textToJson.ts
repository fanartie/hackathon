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
    });

    const prompt = `
Please parse the following interview script text and extract information based on the specified interested items. Return the result as a valid JSON object.

Interview Script:
${text}

Interested Information to Extract:
${interestedInfo.map((item, index) => `${index + 1}. ${item}`).join('\n')}

Instructions:
1. Extract only the information that is explicitly mentioned in the text
2. If information is not found, use null as the value
3. Use camelCase for JSON keys (e.g., "their age" becomes "theirAge")
4. Return only valid JSON without any additional text or formatting
5. Be precise and don't make assumptions about information not clearly stated

Example output format:
{
  "theirAge": "25 years old",
  "theirLocation": "New York",
  "theirEducationBackground": "Bachelor's in Computer Science"
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