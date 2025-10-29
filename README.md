# Blog API (Node.js + TypeScript + Express + Sequelize)

Лабораторная работа №1 — упрощённая блог-платформа с аутентификацией на JWT, CRUD для статей и комментариев, PostgreSQL, Docker и CI/CD через GHCR.

## Стек
- Node.js 18+, TypeScript
- Express
- Sequelize (ORM + миграции)
- PostgreSQL
- JSON Web Tokens (`jsonwebtoken`)
- Валидация: `zod`
- Документация: Swagger UI (`/docs`)

## Быстрый старт (Docker)
```bash
# 1) Скопируйте .env
cp .env.example .env

# 2) Сборка и запуск
docker compose up --build

# 3) Откройте:
# API: http://localhost:3000/api/articles
# Swagger UI: http://localhost:3000/docs
```
> При запуске контейнера автоматически применяются миграции (`sequelize db:migrate`).

## Локальная разработка (без контейнера приложения)
```bash
# Поднимаем только БД локально
docker compose --profile dev up -d db-dev

# Устанавливаем зависимости
npm ci

# Настраиваем .env (DATABASE_URL указывает на локальный Postgres)
cp .env.example .env

# Применяем миграции
npm run migrate

# Запускаем в dev-режиме
npm run dev
```

## Переменные окружения
- `DATABASE_URL` — строка подключения к PostgreSQL
- `JWT_SECRET` — секрет для подписи JWT
- `PORT` — порт HTTP сервера

## Основные эндпоинты

### Пользователи
- `POST /api/users` — регистрация
```json
{ "email": "a@b.c", "username": "alice", "password": "secret", "bio": "About me", "image_url": "https://..." }
```
- `POST /api/users/login` — вход
```json
{ "email": "a@b.c", "password": "secret" }
```
- `GET /api/user` — текущий пользователь (требуется `Authorization: Bearer <token>`)
- `PUT /api/user` — обновление профиля (требуется токен)

### Статьи
- `POST /api/articles` — создать статью (требуется токен)
```json
{ "title": "string", "description": "string", "body": "string", "tagList": ["tag1","tag2"] }
```
- `GET /api/articles` — список статей (query: `limit`, `offset`)
- `GET /api/articles/{slug}` — статья по slug
- `PUT /api/articles/{slug}` — обновить (только автор)
- `DELETE /api/articles/{slug}` — удалить (только автор)

### Комментарии
- `POST /api/articles/{slug}/comments` — добавить комментарий (требуется токен)
```json
{ "body": "string" }
```
- `GET /api/articles/{slug}/comments` — список комментариев
- `DELETE /api/articles/{slug}/comments/{id}` — удалить комментарий (только автор комментария)

## Docker
- `Dockerfile` — многоэтапная сборка
- `docker-compose.yaml`
  - `app` — веб‑сервис
  - `db` — PostgreSQL с `healthcheck`
  - `db-dev` — БД для локальной разработки (профиль `dev`)

## CI/CD (GitHub Actions → GHCR)
Файл [`.github/workflows/docker-publish.yaml`](.github/workflows/docker-publish.yaml) публикует образ в GHCR на каждый push в ветку `main`.

### Render (пример деплоя)
Создайте Web Service, выберите "Deploy from Docker Registry" и укажите:
```
ghcr.io/<ваш_пользователь>/<ваш_репозиторий>:latest
```
Переменные окружения:
```
DATABASE_URL=postgres://...
JWT_SECRET=your-secret-key
PORT=3000
```

## Acceptance Criteria (чек-лист)
- Приложение: все требуемые эндпоинты, JWT-аутентификация, корректные связи, базовая обработка ошибок
- Контейнеризация: оптимизированный `Dockerfile`, `docker-compose.yaml` с healthchecks и профилем dev
- Документация: README + Swagger UI (`/docs`)
- CI/CD: GitHub Actions публикует образ в GHCR; деплой на выбранный хостинг
- Общее: приложение поднимается локально/в облаке и готово к демонстрации

---

© Шаблон для учебных целей
