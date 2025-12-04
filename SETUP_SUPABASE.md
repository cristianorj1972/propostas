# Configuração do Supabase

## Passos Necessários

### 1. Executar o Schema SQL

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (no menu lateral)
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `supabase/schema.sql`
6. Cole no editor e clique em **Run**

### 2. Criar o Bucket de Storage

1. No Supabase Dashboard, vá em **Storage** (no menu lateral)
2. Clique em **Create a new bucket**
3. Nome do bucket: `proposals`
4. **IMPORTANTE**: Marque a opção **Public bucket** ✓
5. Clique em **Create bucket**

### 3. Criar o Primeiro Usuário Admin

1. Vá em **Authentication** > **Users**
2. Clique em **Add user**
3. Escolha **Create new user**
4. Email: `cristianospaula1972@gmail.com`
5. Password: (escolha uma senha)
6. Clique em **Create user**

**Nota**: O trigger do banco de dados automaticamente criará o perfil com role 'admin' para este email.

### 4. Configurar Email (Opcional)

Para enviar emails reais, adicione ao arquivo `.env.local`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM="Sistema de Propostas <seu-email@gmail.com>"
```

**Nota**: Se não configurar, os emails serão logados no console do servidor.

## Verificação

Após completar os passos acima:

1. Reinicie o servidor de desenvolvimento (`npm run dev`)
2. Acesse http://localhost:3000
3. Faça login com `cristianospaula1972@gmail.com`
4. Tente criar uma nova proposta

O erro "Bucket not found" deve estar resolvido!
