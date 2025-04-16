# CUA as Tool

An example TypeScript application that integrates OpenAI's Computer Using Agent (CUA) as a tool for an LLM - to give an LLM a 'remote worker'.

## 🚀 Features
- Integrates Hyperbrowser SDK for browser automation
- Implements CUA as a custom tool for OpenAI's LLMs
- Provides autonomous web navigation, data extraction, and comparison capabilities
- Supports complex web interactions like form filling and data extraction


## 📋 Prerequisites
- Node.js (v16 or higher)
- TypeScript
- OpenAI API key
- Hyperbrowser API key

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cua_as_tool.git
   cd cua_as_tool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your API keys:
     ```
     OPENAI_API_KEY=your_openai_api_key
     HYPERBROWSER_API_KEY=your_hyperbrowser_api_key
     ```

## 💻 Usage

Run the application:

```bash
npx tsx src/index.ts
```

The example test run demonstrates a product comparison between iPhone and Samsung devices, focusing on camera quality and battery life.

## 🔧 Configuration

The tool is configured with the following browser session options:
- Proxy support
- Stealth mode
- Automatic cookie acceptance
- Ad and annoyance blocking

## 📚 API Reference

### CUA Tool

The main tool implements browser automation with the following parameters:
```typescript
{
  task: string // The detailed task for the browser agent to perform
}
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
