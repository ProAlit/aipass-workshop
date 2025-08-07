addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// --- NEW: Smart function to detect language and wrap text in spans ---
function autoFont(text) {
  // This regex finds continuous blocks of Persian/Arabic characters OR anything else.
  const regex = /([\u0600-\u06FF\s\d,.-]+|[^\u0600-\u06FF]+)/g;
  const parts = text.match(regex) || [];

  return parts.map(part => {
    // Check if the part contains any Persian characters
    if (/[\u0600-\u06FF]/.test(part)) {
      return `<span lang="fa">${part}</span>`;
    } else {
      // Otherwise, treat it as English (or neutral characters like numbers/emoji)
      return `<span lang="en">${part}</span>`;
    }
  }).join('');
}

function generateCard({ emoji, title, description, link }) {
  // Use the autoFont function on the title
  const formattedTitle = autoFont(title);

  return `
    <a href="${link}" class="card" target="_blank" rel="noopener noreferrer">
      <div class="card-title">${emoji} ${formattedTitle}</div>
      <div class="card-description">${description}</div>
    </a>
  `
}

async function handleRequest(request) {
  const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>مدیریت فناوری و سلامت نقره ای 🤍</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg: #f0f0f0;
      --text: #222;
      --card-bg: rgba(255, 255, 255, 0.6);
      --border: rgba(255, 255, 255, 0.4);
      --highlight: #4a90e2;
      
      --font-fa: 'Vazirmatn', sans-serif;
      --font-en: 'Pacifico', cursive;
    }

    body.dark {
      --bg: #111;
      --text: #eee;
      --card-bg: rgba(30, 30, 30, 0.8);
      --border: rgba(255, 255, 255, 0.1);
      --highlight: #8ab4f8;
    }

    body {
      margin: 0;
      padding: 0;
      color: var(--text);
      font-family: var(--font-fa); /* Default to Persian font */
      transition: all 0.5s ease-in-out;
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
    }

    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    /* --- NEW: Use :lang() to automatically apply the correct font --- */
    :lang(fa) { font-family: var(--font-fa); }
    :lang(en) { font-family: var(--font-en); }

    .container {
      padding: 2rem;
      max-width: 1100px;
      margin: auto;
    }

    .logo-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 2.2rem;
      margin-top: 1.5rem;
      color: var(--highlight);
      animation: fadeIn 1s ease-in-out;
    }
    
    /* Ensure the logo title always uses the English font */
    .logo-title :lang(en) {
        font-family: var(--font-en);
    }

    header {
      text-align: center;
      font-size: 1.6rem;
      font-weight: 700;
      margin-top: 1rem;
      margin-bottom: 2rem;
      animation: slideIn 0.8s ease-out;
    }

    button.toggle {
      position: fixed;
      top: 1rem;
      left: 1rem;
      background: var(--card-bg);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      border: 1px solid var(--border);
      color: var(--text);
      font-family: var(--font-fa); 
      cursor: pointer;
      font-size: 1rem;
      z-index: 999;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease-in-out;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 1.5rem;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      animation: fadeUp 0.6s ease-in-out both;
    }
    
    .card:nth-child(1) { animation-delay: 0.1s; }
    .card:nth-child(2) { animation-delay: 0.2s; }
    .card:nth-child(3) { animation-delay: 0.3s; }
    .card:nth-child(4) { animation-delay: 0.4s; }
    .card:nth-child(5) { animation-delay: 0.5s; }

    .card:hover {
      transform: translateY(-8px) scale(1.03);
      box-shadow: 0 18px 35px rgba(0,0,0,0.18),
                  0 0 25px var(--highlight);
    }
    
    .card:focus-visible, button.toggle:focus-visible {
      outline: 2px solid var(--highlight);
      outline-offset: 3px;
      box-shadow: 0 18px 35px rgba(0,0,0,0.18),
                  0 0 25px var(--highlight);
    }

    .card-title {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    /* Make sure the card title fonts are applied correctly via lang spans */
    .card-title :lang(en) {
      font-family: var(--font-en);
    }

    .card-description {
      font-size: 1rem;
      font-weight: 400;
      color: var(--text);
    }

    footer {
      text-align: center;
      padding: 1.5rem;
      font-size: 0.9rem;
      color: #888;
    }

    /* Media Queries and other keyframes remain the same */
    @media (max-width: 600px) {
      .logo-title { font-size: 2rem; flex-direction: column; }
      header { font-size: 1.3rem; padding: 0 1rem; }
    }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>
  <button class="toggle" id="theme-toggle">🌙 حالت شب</button>

  <div class="container">
    <div class="logo-title">🤖 <span lang="en">AiPass</span></div>
    <header>کارگاه هوش مصنوعی آی پاس</header>

    <div class="cards">
      ${generateCard({
        emoji: "🧠",
        title: "NoteBookLM",
        description: "هوش مصنوعی نوت بوک گوگل",
        link: "https://notebooklm.google.com"
      })}
      ${generateCard({
        emoji: "🧠",
        title: "Gemini",
        description: "هوش مصنوعی جمنای گوگل",
        link: "https://gemini.google.com"
      })}
      ${generateCard({
        emoji: "🧠",
        title: "Qwen",
        description: "هوش مصنوعی علی بابا",
        link: "https://chat.qwen.ai"
      })}
      ${generateCard({
        emoji: "🧠",
        title: "ChatGPT",
        description: "هوش مصنوعی چت جی پی تی",
        link: "https://chatgpt.com"
      })}
      ${generateCard({
        emoji: "🧠",
        title: "DeepSeek",
        description: "هوش مصنوعی دیپ سیک",
        link: "https://chat.deepseek.com"
      })}
      ${generateCard({
        emoji: "🧠",
        title: "ChatPDF",
        description: "هوش مصنوعی چت پی دی اف",
        link: "https://www.chatpdf.com"
      })}
      ${generateCard({
        emoji: "🧠",
        title: "Mappify",
        description: "هوش مصنوعی مپیفای",
        link: "https://mapify.so"
      })}
	  ${generateCard({
        emoji: "🧠",
        title: "Grok",
        description: "هوش مصنوعی ایکس",
        link: "https://grok.com/?referrer=x"
      })}
	  ${generateCard({
        emoji: "🧠",
        title: "Z",
        description: "هوش مصنوعی تِنسِنت",
        link: "https://chat.z.ai/"
      })}
	  ${generateCard({
        emoji: "🧠",
        title: "Kimi",
        description: "هوش مصنوعی تِنسِنت",
        link: "https://www.kimi.com"
      })}
	  ${generateCard({
        emoji: "🧠",
        title: "Duck",
        description: "هوش مصنوعی داک",
        link: "https://duck.ai"
      })}
      ${generateCard({
        emoji: "🤖",
        title: "Feedough",
        description: "هوش مصنوعی تولید پرامپت اتومات",
        link: "https://feedough.com"
      })}
      ${generateCard({
        emoji: "📃",
        title: "Anthropic",
        description: "داکیومنت های آموزش پرامپت آنتروپیک",
        link: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"
      })}
      ${generateCard({
        emoji: "📃",
        title: "Google",
        description: "داکیومنت های آموزش پرامپت نویسی گوگل",
        link: "https://ai.google.dev/gemini-api/docs/prompting-strategies"
      })}
      ${generateCard({
        emoji: "📹",
        title: "Google",
        description: "دوره مقدماتی آموزش پرامپت نویسی گوگل",
        link: "https://youtube.com/playlist?list=PLTZYG7bZ1u6puy4VGgQXYVycNL16xDTeO&feature=shared"
      })}
      ${generateCard({
        emoji: "🥇",
        title: "HuggingFace",
        description: "رنکینگ مدل های هوش مصنوعی",
        link: "https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard#/"
      })}
      ${generateCard({
        emoji: "🥇",
        title: "LLM Stats",
        description: "رنکینگ مدل های هوش مصنوعی",
        link: "https://llm-stats.com/"
      })}
	  ${generateCard({
        emoji: "💎",
        title: "Prompts",
        description: "پرامپت های ارائه شده",
        link: "https://llm-stats.com/"
      })}
      ${generateCard({
        emoji: "📞",
        title: "Contact Us",
        description: "اطلاعات تماس و شبکه های اجتماعی",
        link: "https://t.me/silverhealthmanagmentt"
      })}
    </div>
  </div>

  <footer>© ${new Date().getFullYear()} AiPass ❤️ Made By Silver Innovations & Health Management Team</footer>

  <script>
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    function setTheme(isDark) {
      if (isDark) {
        body.classList.add('dark');
        toggleButton.innerHTML = '🌞 حالت روشن';
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.remove('dark');
        toggleButton.innerHTML = '🌙 حالت شب';
        localStorage.setItem('theme', 'light');
      }
    }

    toggleButton.addEventListener('click', () => {
      setTheme(!body.classList.contains('dark'));
    });

    (function () {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);
      }
    })();
  </script>
</body>
</html>
  `

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' },
  })
}