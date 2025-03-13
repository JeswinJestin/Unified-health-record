import { HfInference } from '@huggingface/inference';

export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const client = new HfInference(process.env.EXPO_PUBLIC_HF_API_KEY);
    
    console.log("Attempting API call with key:", 
                process.env.EXPO_PUBLIC_HF_API_KEY?.substring(0, 5) + "...");
    
    // Try with a more accessible model
    const chatCompletion = await client.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2", // More accessible model
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "You are Baymax AI, a medical assistant. Provide helpful medical information and always include appropriate disclaimers."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message
            }
          ]
        }
      ],
      max_tokens: 500
    });

    return chatCompletion.choices[0].message.content || 
           'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
};
