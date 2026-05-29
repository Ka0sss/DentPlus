# Etapa 1: Instalar dependencias
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Etapa 2: Compilar TypeScript
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN node node_modules/typescript/bin/tsc

# Etapa 3: Imagen final para ejecución
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src/views ./src/views
COPY --from=build /app/prisma.config.ts ./
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
