import { HfInference } from '@huggingface/inference';

export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const client = new HfInference(process.env.EXPO_PUBLIC_HF_API_KEY);
    
    console.log("Attempting API call with key:", 
                process.env.EXPO_PUBLIC_HF_API_KEY?.substring(0, 5) + "...");
    
    // Use a truly open-access chat model
    const chatCompletion = await client.chatCompletion({
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct", // Open-access chat model
      messages: [
        {
          role: "system",
          content: "You are Baymax AI, a medical assistant. Provide ONLY specific, factual medical information. Keep all responses under 10 sentences. Include a very brief disclaimer when needed. Do not add greetings, explanations, or ask follow-up questions. Focus only on answering the user's question directly."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 200
    });

    return chatCompletion.choices[0].message.content || 
           'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
};
