# Патч для CRM Backend — Публичный API объектов

Чтобы сайт мог подтягивать одобренные объекты из CRM, нужно добавить публичный endpoint в backend.

## Что добавить

В файл `backend/src/routes/properties.ts` после строки `router.get('/photo-data/:photoId', servePhotoData);` (примерно строка 258) добавь:

```typescript
// ─── PUBLIC: approved properties for website ──────────────────────────
router.get('/public/approved', async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
        const offset = parseInt(req.query.offset as string) || 0;

        const sql = `
            SELECT p.id, p.category, p.city, p.address, p.price,
                   p.area_total, p.area_living, p.area_kitchen,
                   p.rooms, p.floor, p.floors_total, p.description,
                   p.status, p.created_at,
                   pr.full_name as owner_name,
                   (SELECT COUNT(*) FROM property_photos ph WHERE ph.property_id = p.id) as photo_count,
                   (SELECT ph.file_url FROM property_photos ph WHERE ph.property_id = p.id ORDER BY ph.sort_order LIMIT 1) as cover_url,
                   (SELECT ph.id FROM property_photos ph WHERE ph.property_id = p.id ORDER BY ph.sort_order LIMIT 1) as cover_photo_id
            FROM properties p
            LEFT JOIN profiles pr ON p.owner_id = pr.id
            WHERE p.status IN ('approved', 'avito_approved', 'published_avito', 'in_feed')
            ORDER BY p.created_at DESC
            LIMIT $1 OFFSET $2
        `;

        const result = await query(sql, [limit, offset]);

        const rows = result.rows.map((r: any) => {
            if (r.cover_photo_id) {
                r.cover_url = `${getBaseUrl(req)}/api/properties/photo-data/${r.cover_photo_id}`;
            } else if (r.cover_url && r.cover_url.startsWith('/uploads')) {
                r.cover_url = resolveLocalUrl(r.cover_url, req);
            }
            delete r.cover_photo_id;
            return r;
        });

        res.json({ data: rows });
    } catch (error) {
        console.error('Error fetching public properties:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});
```

## Как это работает

- `GET /api/properties/public/approved` — отдаёт одобренные объекты без авторизации
- Параметры: `?limit=20&offset=0`
- Возвращает: `id, category, city, address, price, area_total, rooms, floor, cover_url, ...`
- Фото отдаются через уже существующий публичный endpoint `/api/properties/photo-data/:id`

## Деплой

После добавления кода пересобери backend:
```bash
cd backend
npm run build
# или перезапусти Docker / PM2
```

Сайт автоматически начнёт подтягивать реальные объекты — компонент `Catalog` уже настроен на `GET /api/properties/public/approved`.
