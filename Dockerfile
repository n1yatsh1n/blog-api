# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json .
COPY src ./src
COPY .sequelizerc ./
COPY config ./config
COPY migrations ./migrations
RUN npm run build

# ---- Runtime ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/.sequelizerc ./.sequelizerc
EXPOSE 3000
# Healthcheck will hit /health
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD wget -qO- http://localhost:3000/health || exit 1
CMD sh -c "node -v && npm -v && npx sequelize db:migrate && node dist/index.js"
