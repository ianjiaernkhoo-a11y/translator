# translator

MVP: type legal advice in English, click Translate, get a conversational Mandarin
translation suitable for explaining the matter to a layperson client in the
Singapore legal context.

No database, auth, or WhatsApp sending yet — those are planned for later phases.

## Setup

```
npm install
cp .env.local.example .env.local   # then fill in ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.
