# ЭТАП 1: Базовый образ и рабочая директория
FROM oven/bun:1-slim AS base
WORKDIR /app

# ЭТАП 2: Установка зависимостей в отдельном слое
FROM base AS install
# Копируем файлы манифестов
COPY package.json bun.lockb ./
# Устанавливаем только production-зависимости с замороженным лок-файлом для стабильности
RUN bun install --production --frozen-lockfile

# ЭТАП 3: Сборка и генерация клиента Prisma
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .
# Генерируем клиент Prisma внутри контейнера
RUN bunx prisma generate
# Выполняем команду сборки, которая у вас прописана в package.json:
# "build": "bun build ./src/index.ts --outdir ./dist"
RUN bun run build

# ЭТАП 4: Финальный продакшн-образ (максимально легкий)
FROM base AS release

# Копируем только необходимые файлы из предыдущих этапов
COPY --from=install /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Копируем схему prisma, чтобы клиент мог ее найти
COPY --from=build /app/prisma ./prisma 

# Переключаемся на непривилегированного пользователя для безопасности
USER bun

# Пробрасываем порт
EXPOSE 3000

# Запуск приложения: запускаем сгенерированный index.js из папки dist
CMD ["bun", "run", "dist/index.js"]
