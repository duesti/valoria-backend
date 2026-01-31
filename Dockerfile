# Используем официальный образ Bun
FROM oven/bun:latest as base
WORKDIR /app

# Устанавливаем зависимости
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Копируем схему Prisma и генерируем клиент
COPY prisma ./prisma
RUN bunx prisma generate

# Копируем остальной код
COPY . .

# Экспортируем порт (Hono по умолчанию использует 3000)
EXPOSE 3030

# Команда запуска с применением миграций перед стартом сервера
CMD bunx prisma migrate deploy && bun src/index.ts
