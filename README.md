📧 AI Email Sender with Gemini API
This is a React-based web application that allows users to generate professional email content using Google's Gemini AI API. The app takes a user prompt and generates a complete email body, suggests subject lines, allows tone refinement, and simulates sending the email.




🚀 Features
✅ Generate email content from natural language prompts

🧠 Gemini 2.5 Flash API integration

✨ Suggest concise subject lines

🎨 Refine tone (Formal, Casual, Persuasive)

📤 Simulate sending email to multiple recipients

🧼 Clean and responsive UI with Tailwind CSS

🖼️ Live Demo
🔗 Live Site: (https://vanshtomar18.github.io/emailGen/)


📂 Project Structure
bash
Copy
Edit
📁 src/
├── App.jsx            # Main component
├── index.js           # Entry point
├── styles.css         # Tailwind (optional)
└── ...
🔑 Setup & Installation
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/YOUR-USERNAME/ai-email-sender.git
cd ai-email-sender
2. Install dependencies
bash
Copy
Edit
npm install
3. Add your Gemini API Key
Replace the placeholder in App.jsx:

js
Copy
Edit
const apiKey = "YOUR_API_KEY_HERE"; // 🔁 Replace with your key
You can get your Gemini API key from: https://aistudio.google.com/app/apikey

4. Run the app
bash
Copy
Edit
npm run dev
Or with plain React:

bash
Copy
Edit
npm start
The app should now be running at http://localhost:3000/

📦 Built With
React

Tailwind CSS

Google Gemini API (gemini-2.5-flash-preview)

JavaScript (ES6+)

✨ Example Prompts
"Write a professional follow-up email for a job application."

"Send a casual invite to my college friends for a cricket match."

"Write an apology email for missing a meeting."

💡 Improvements to Try
🌐 Deploy using GitHub Pages / Vercel / Netlify

✅ Add form validation for email input

📬 Use actual email APIs like SendGrid, Resend, or Gmail API

💾 Add localStorage support to save drafts

🙌 Acknowledgements
Google AI Studio for Gemini API

Tailwind CSS

React

🧑‍💻 Author
Vansh Tomar


📜 License
This project is open-source and available under the MIT License.
