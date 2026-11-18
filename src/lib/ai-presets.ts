// Atalhos de IAs compatíveis com a API da OpenAI (usado na tela de Configurações e no servidor).
export const PRESETS: { id: string; name: string; baseUrl: string; keyUrl: string; note: string }[] = [
  { id: "groq", name: "Groq", baseUrl: "https://api.groq.com/openai/v1", keyUrl: "https://console.groq.com/keys", note: "Grátis, muito rápido" },
  { id: "openrouter", name: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", keyUrl: "https://openrouter.ai/keys", note: "Vários modelos, alguns grátis (:free)" },
  { id: "deepseek", name: "DeepSeek", baseUrl: "https://api.deepseek.com/v1", keyUrl: "https://platform.deepseek.com/api_keys", note: "Barato" },
  { id: "openai", name: "OpenAI (ChatGPT)", baseUrl: "https://api.openai.com/v1", keyUrl: "https://platform.openai.com/api-keys", note: "Pago" },
  { id: "mistral", name: "Mistral", baseUrl: "https://api.mistral.ai/v1", keyUrl: "https://console.mistral.ai/api-keys", note: "Tem plano grátis" },
  { id: "custom", name: "Outra (personalizada)", baseUrl: "", keyUrl: "", note: "Cole o endereço da API" },
];
