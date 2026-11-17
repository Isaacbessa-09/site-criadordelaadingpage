# Landing Studio

Plataforma pessoal para criar landing pages a partir de templates, com editor visual,
IA (Claude) para reescrever a copy, publicação com slug (`/p/seu-slug`) e exportação em PDF.

## Rodar no computador

```bash
npm install
cp .env.example .env.local   # coloque sua ANTHROPIC_API_KEY
npm run dev
```

Abra http://localhost:3000. No computador, páginas e imagens ficam na pasta `data/`.

## Colocar na Vercel (acessar de qualquer lugar)

1. **Suba o código no GitHub** (repositório privado) ou use a Vercel CLI (`npx vercel`).
2. Na Vercel: **Add New > Project**, importe o repositório e clique em **Deploy**.
3. No projeto, aba **Storage**:
   - **Create > Upstash for Redis** (plano grátis) e conecte ao projeto → cria `KV_REST_API_URL` e `KV_REST_API_TOKEN`.
   - **Create > Blob** e conecte ao projeto → cria `BLOB_READ_WRITE_TOKEN`.
4. Em **Settings > Environment Variables**, adicione:
   - `ANTHROPIC_API_KEY` — sua chave da Anthropic.
   - `APP_PASSWORD` — a senha para entrar no editor.
5. Vá em **Deployments** e faça **Redeploy** para aplicar as variáveis.

Pronto: o editor fica em `https://seu-projeto.vercel.app` (pede a senha) e as páginas publicadas
ficam públicas em `https://seu-projeto.vercel.app/p/slug`.

> As páginas criadas no computador (pasta `data/`) não sobem junto. Na Vercel você começa do zero.

## Estrutura

- `src/lib/templates.ts` — os 3 templates (esporte, cafeteria, clínica)
- `src/lib/registry.ts` — tipos de dobra e campos editáveis
- `src/components/site/` — componentes das dobras (com animações)
- `src/components/editor/` — editor (painel esquerdo + preview)
- `src/app/api/ai/route.ts` — integração com a IA
- `src/lib/storage.ts` — salva em Redis (Vercel) ou arquivos (local)
