import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

const venice = createOpenAI({
    apiKey: process.env.VENICE_API_KEY || '', // Providing empty string to satisfy SDK
    headers: {
        'X-Venice-Api-Key': process.env.VENICE_API_KEY || '',
    },
    baseURL: 'https://api.venice.ai/api/v1',
});

async function main() {
    const result = streamText({
        model: venice('llama-3.3-70b'),
        prompt: 'Invent a new holiday and describe its traditions.',
    });

    for await (const textPart of result.textStream) {
        process.stdout.write(textPart);
    }

    console.log();
    const usage = await result.usage;
    console.log('Token usage:', usage);
    const finishReason = await result.finishReason;
    console.log('Finish reason:', finishReason);
}

main().catch(console.error);
