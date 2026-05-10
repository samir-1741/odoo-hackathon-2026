const asyncHandler = require('express-async-handler');

exports.chatWithAI = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        res.status(400);
        throw new Error('Message is required');
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        res.status(500).json({ 
            message: 'OpenRouter API Key not configured.',
            isError: true 
        });
        return;
    }

    const systemPrompt = {
        role: 'system',
        content: `You are 'Nextrip AI', a premium luxury travel assistant. 
                  You help users plan God-Tier vacations, provide itinerary suggestions, 
                  check average costs, and give deep cultural insights. 
                  Your tone is highly professional, concise, enthusiastic, and sophisticated.
                  You work for Nextrip Premium Holidays.
                  Do not use excessive formatting. Keep answers clear and helpful.`
    };

    const messages = [systemPrompt];
    
    // Add previous history
    if (history && history.length > 0) {
        messages.push(...history);
    }

    // Add user message
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'http://localhost:4200', // Required by OpenRouter
            'X-Title': 'Nextrip Premium Holidays',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'meta-llama/llama-3-8b-instruct:free', // Using a fast, highly capable free tier model as default
            messages: messages,
        })
    });

    if (!response.ok) {
        res.status(response.status);
        throw new Error('Failed to fetch from OpenRouter AI');
    }

    const data = await response.json();

    if (data && data.choices && data.choices.length > 0) {
        res.json({ reply: data.choices[0].message.content });
    } else {
        res.status(500);
        throw new Error('Failed to get a valid response from AI.');
    }
});
