FROM node:18-alpine

# Cria e define o diretório de trabalho do contêiner
WORKDIR /usr/src/app

# Copia package.json e package-lock.json primeiro (aproveita cache do Docker)
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm install --omit=dev

# Copia o restante do código-fonte para o contêiner
COPY . .

# Expõe a porta que a API vai rodar
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
