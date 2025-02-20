# Etapa de build: compila o código TypeScript
FROM node:18-alpine as builder
WORKDIR /app

# Copia os arquivos de dependência para aproveitar cache
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do código do projeto
COPY . .

# Compila o projeto (utilizando o tsc, que está disponível via devDependency)
RUN npx tsc --project tsconfig.json

# Etapa de produção
FROM node:18-alpine
WORKDIR /app

# Copia os arquivos de dependência e instala apenas as dependências de produção
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copia os arquivos compilados da etapa de build
COPY --from=builder /app/build ./build

# Define variável de ambiente para produção
ENV NODE_ENV=production

# Expõe a porta em que o servidor estará ouvindo (conforme definido no código, geralmente 3000)
EXPOSE 3000

# Inicia a aplicação usando o arquivo compilado (local.ts gera build/local.js)
CMD ["node", "build/local.js"]
