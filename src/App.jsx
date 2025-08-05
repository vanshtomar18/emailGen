import React, { useState } from 'react';

// Helper function to simulate sending an email
const sendEmail = async (recipients, subject, body) => {
  // In a real application, this would involve a backend service to send emails.
  // For this simulation, we'll just log the details and return a success message.
  console.log('Sending email to:', recipients);
  console.log('Subject:', subject);
  console.log('Body:', body);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { success: true, message: 'Email sent successfully!' };
};

// Main App Component
export default function App() {
  const [recipients, setRecipients] = useState('');
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [suggestedSubjects, setSuggestedSubjects] = useState([]);
  
  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  // Function to call Gemini API
  const callGeminiAPI = async (prompt, responseSchema = null) => {
    // --- PASTE YOUR API KEY HERE ---
    // Replace "YOUR_API_KEY_HERE" with your actual Gemini API key.
    const apiKey = "AIzaSyA9e0EeG5CZDaQyCbWE1OV3pD7LnvzKzgo";

    if (apiKey === "YOUR_API_KEY_HERE") {
        throw new Error("API key is not set. Please add your Gemini API key to the code.");
    }
    
    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    if (responseSchema) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        };
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("API Error:", errorBody);
        throw new Error('API call failed. Please check your API key and try again.');
    }
    
    const result = await response.json();
    if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text;
    } else {
        console.error("Invalid API Response:", result);
        throw new Error('Invalid response from API.');
    }
  };


  const handleGenerateEmail = async () => {
    if (!prompt) {
      setError('Please enter a prompt for the email.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedEmail('');
    setSuggestedSubjects([]);
    setSubject('');
    setEmailSent(false);

    try {
      const emailBody = await callGeminiAPI(`Generate a complete email body based on the following prompt: ${prompt}`);
      setGeneratedEmail(emailBody);
      
      // Now, suggest subjects based on the generated body
      await handleSuggestSubjects(emailBody);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestSubjects = async (emailBody) => {
    setIsSuggesting(true);
    try {
        const subjectPrompt = `Based on the following email body, suggest 3 concise and effective subject lines. Email Body: "${emailBody}"`;
        const schema = {
            type: "OBJECT",
            properties: {
                "subjects": {
                    "type": "ARRAY",
                    "items": { "type": "STRING" }
                }
            }
        };
        const suggestionsText = await callGeminiAPI(subjectPrompt, schema);
        const suggestions = JSON.parse(suggestionsText);
        setSuggestedSubjects(suggestions.subjects || []);
    } catch (err) {
        // Don't show subject suggestion error to user, just log it
        console.error("Could not suggest subjects:", err.message);
    } finally {
        setIsSuggesting(false);
    }
  };

  const handleRefineTone = async (tone) => {
    if (!generatedEmail) return;
    setIsRefining(true);
    setError(null);
    try {
        const refinePrompt = `Rewrite the following email to have a much more ${tone} tone. Keep the core message the same:\n\n${generatedEmail}`;
        const refinedBody = await callGeminiAPI(refinePrompt);
        setGeneratedEmail(refinedBody);
    } catch (err) {
        setError(err.message);
    } finally {
        setIsRefining(false);
    }
  };


  const handleSendEmail = async () => {
    if (!recipients || !generatedEmail || !subject) {
      setError('Please provide recipients, a subject, and generate an email before sending.');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const recipientList = recipients.split(',').map(email => email.trim());
      const result = await sendEmail(recipientList, subject, generatedEmail);

      if (result.success) {
        setEmailSent(true);
        setRecipients('');
        setPrompt('');
        setGeneratedEmail('');
        setSubject('');
        setSuggestedSubjects([]);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred while sending the email.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">AI Email Sender</h1>
            <p className="text-gray-500 mt-2">Craft the perfect email with the power of AI</p>
        </div>

        {emailSent && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg">
            <p className="font-bold">Success!</p>
            <p>Your email has been sent successfully.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-lg">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Step 1: Inputs */}
        <div className="space-y-4">
          <div>
            <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 mb-1">Recipients (comma-separated)</label>
            <input type="email" id="recipients" multiple value={recipients} onChange={(e) => setRecipients(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="friend1@example.com, colleague@work.com"/>
          </div>
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">Email Prompt</label>
            <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Write a friendly catch-up email to a friend I haven't seen in a while."/>
          </div>
        </div>

        <div className="text-center">
          <button onClick={handleGenerateEmail} disabled={isGenerating} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all duration-300 shadow-lg">
            {isGenerating ? 'Generating...' : '✨ Generate Email'}
          </button>
        </div>

        {/* Step 2: Edit and Send Email */}
        {(generatedEmail || isGenerating) && (
          <div className="border-t-2 border-gray-100 pt-6 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Compose Your Email</h2>
            
            {/* Subject Suggestions */}
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your email subject"/>
                {isSuggesting && <p className="text-sm text-gray-500 mt-2">✨ Suggesting subjects...</p>}
                {suggestedSubjects.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-600 self-center">Suggestions:</span>
                        {suggestedSubjects.map((s, i) => (
                            <button key={i} onClick={() => setSubject(s)} className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-indigo-200 transition-all">
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Email Body */}
            <div>
                <label htmlFor="email-body" className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea id="email-body" value={generatedEmail} onChange={(e) => setGeneratedEmail(e.target.value)} rows="10" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your email body will appear here..."/>
            </div>

            {/* Tone Refinement */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">✨ Refine Tone</label>
                <div className="flex flex-wrap gap-2">
                    {['Formal', 'Casual', 'Persuasive'].map(tone => (
                        <button key={tone} onClick={() => handleRefineTone(tone)} disabled={isRefining || !generatedEmail} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-indigo-200 disabled:opacity-50 transition-all">
                            Make it {tone}
                        </button>
                    ))}
                </div>
                {isRefining && <p className="text-sm text-gray-500 mt-2">Refining tone...</p>}
            </div>

            <div className="text-center">
              <button onClick={handleSendEmail} disabled={isSending || !subject} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg">
                {isSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
