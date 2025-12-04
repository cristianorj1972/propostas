# Deploy para GitHub e Vercel

## 📤 Subir para o GitHub

O código já foi commitado localmente. Para fazer o push, você precisa autenticar:

### Opção 1: Usar GitHub CLI (Recomendado)
```bash
# Instalar GitHub CLI (se não tiver)
winget install --id GitHub.cli

# Fazer login
gh auth login

# Fazer push
git push -u origin main
```

### Opção 2: Usar Token de Acesso Pessoal
1. Vá em: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Dê um nome (ex: "Propostas App")
4. Marque o escopo `repo`
5. Clique em "Generate token"
6. **Copie o token** (você só verá uma vez!)
7. No terminal, quando pedir senha, cole o token

```bash
git push -u origin main
# Username: cristianorj1972
# Password: [cole o token aqui]
```

## 🚀 Deploy na Vercel (Acesso Global)

Depois que o código estiver no GitHub:

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em "Add New Project"
4. Selecione o repositório `propostas`
5. **Configure as variáveis de ambiente:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`
   - **NÃO adicione** `NEXT_PUBLIC_APP_URL` (a Vercel define automaticamente)
6. Clique em "Deploy"

Após o deploy, você terá uma URL como `https://propostas-xyz.vercel.app` que funciona de qualquer lugar do mundo! 🌍

## 📝 Próximos Passos

1. Faça o push para o GitHub
2. Deploy na Vercel
3. Atualize o `NEXT_PUBLIC_APP_URL` nas variáveis de ambiente da Vercel para a URL do deploy
4. Teste criando uma nova proposta - o email terá a URL pública!
