# Leads API — заявки с сайта для CRM-агента

Базовый URL: `https://vkrysha.ru/api/leads`

Токен выдаётся отдельно (секрет `LEADS_API_TOKEN` на сервере). Во фронтенд он не попадает.

## Создать заявку (сайт)

Публичный endpoint, вызывается формами сайта.

```bash
curl -X POST https://vkrysha.ru/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "type": "contact",
    "name": "Иван",
    "phone": "+7 (999) 123-45-67",
    "message": "Ищу квартиру",
    "page": "/"
  }'
```

Рефералка:

```bash
curl -X POST https://vkrysha.ru/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "type": "referral",
    "friendName": "Пётр",
    "friendPhone": "+7(900)111-22-33",
    "referrerName": "Иван Иванов",
    "referrerPhone": "+7(900)222-33-44",
    "messenger": "whatsapp",
    "page": "/"
  }'
```

Ответ `201`:

```json
{ "ok": true, "lead": { "id": "...", "type": "contact", "createdAt": "..." } }
```

## Получить все заявки (CRM-агент)

Требуется заголовок `Authorization: Bearer <TOKEN>`.

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://vkrysha.ru/api/leads"
```

Только новые с момента:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://vkrysha.ru/api/leads?since=2026-09-01T00:00:00.000Z"
```

Ответ `200`:

```json
{
  "ok": true,
  "count": 1,
  "leads": [
    {
      "id": "uuid",
      "type": "contact",
      "createdAt": "2026-09-30T07:00:00.000Z",
      "name": "Иван",
      "phone": "+7...",
      "message": "Ищу квартиру",
      "source": "contact_form",
      "page": "/"
    }
  ]
}
```

Поля рефералки дополнительно: `friendName`, `friendPhone`, `referrerName`, `referrerPhone`, `messenger`, `source: "referral_form"`.

Без токена — `401`.

## Типы

| type | source | Откуда |
|------|--------|--------|
| `contact` | `contact_form` | Модалка «Оставить заявку» |
| `referral` | `referral_form` | Реферальное окно |

## Важно

В хранилище попадают заявки только с момента запуска сервиса. Исторических контактных заявок нет — раньше форма их не сохраняла.

## Сервер (один раз)

- systemd: `vkrysha-leads` (`deploy/vkrysha-leads.service`)
- env: `/etc/vkrysha-leads.env` (токен создаётся при первом деплое)
- nginx: `include /etc/nginx/snippets/vkrysha-leads.conf;` внутри `server { }` сайта **до** прокси `/api` на CRM
- данные: `/var/lib/vkrysha-leads/leads.jsonl`

После первого деплоя скопируйте `LEADS_API_TOKEN` из логов Actions (или с сервера из `/etc/vkrysha-leads.env`) и отдайте CRM-агенту.
