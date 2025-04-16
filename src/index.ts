import { z } from "zod";
import { config } from "dotenv";
import OpenAI from "openai";
import { zodFunction } from "openai/helpers/zod";
import { Hyperbrowser } from "@hyperbrowser/sdk";

config();

const hb = new Hyperbrowser();
const oai = new OpenAI();

const CuaTool = zodFunction({
  name: "browser_using_agent",
  description: `A tool for browser automation and interaction. Provide detailed step-by-step instructions for the actions you want to perform. Specify the desired format for results, as the agent will return the final output after task completion. Supports navigation, form filling, data extraction, and other web interactions.`,
  parameters: z.object({
    task: z.string().describe("The task you want the browser agent to perform"),
  }),
  function: async ({ task }) => {
    try {
      const { jobId, liveUrl } = await hb.agents.cua.start({
        task,
        sessionOptions: {
          useProxy: true,
          useStealth: true,
          acceptCookies: true,
          adblock: true,
          annoyances: true,
        },
      });

      console.log(`🤖 CUA agent working on ${task} at ${liveUrl}`);

      while (true) {
        const response = await hb.agents.cua.get(jobId);
        if (response.status === "completed") {
          return response.data?.finalResult ?? "";
        }
        await new Promise((resolve) => setTimeout(resolve, 2_000));
      }
    } catch (error) {
      console.error(error);
      return "An error occurred while performing the task.";
    }
  },
});

async function agent(prompt: string) {
  const runner = oai.beta.chat.completions
    .runTools({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      tools: [CuaTool],
    })
    .on("message", (msg) => console.log(JSON.stringify(msg, null, 2)));

  const finalResponse = await runner.finalContent();
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n✅ Task Completed Successfully:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(finalResponse);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

const systemPrompt = `
You are a specialized comparison assistant with access to a browser agent. Your task is to help users make informed decisions by comparing products across multiple websites.

When a user asks you to compare products:

1. Use your browser agent to navigate to relevant e-commerce and review sites
2. Search for the specific products mentioned
3. Extract key information including:
   - Pricing across different retailers
   - Product specifications
   - User ratings and expert reviews
   - Available features and options
   - Shipping/availability information
   - Key differentiators between products

4. Organize this information into a structured, easy-to-understand comparison
5. Provide thoughtful analysis of the tradeoffs between options
6. Make recommendations based on the user's stated preferences

Your browser agent can:
- Navigate to websites
- Fill in search forms
- Extract data from product pages
- Switch between multiple sites to gather comprehensive information
- Take screenshots of relevant visual information when helpful

Important guidelines:
- Explain your reasoning and browser actions clearly
- Cite specific sources for your information
- Present a balanced view of the options
- Acknowledge limitations in your comparison
- Focus on factual differences rather than subjective opinions
- When you're uncertain about information, be transparent
- Prioritize reputable sources over sponsored content

Example user requests:
- "Compare the latest iPhone Pro vs Samsung Galaxy S models"
- "What's the best robot vacuum under $300?"
- "Compare Adobe Photoshop vs Affinity Photo for professional photographers"
- "Help me choose between a Vitamix and Ninja blender for smoothies"
`.trim();

async function main() {
  await agent(
    `Compare the latest iPhone Pro Max vs Samsung Galaxy S Ultra - I care most about camera quality and battery life.`
  );
}

main();
