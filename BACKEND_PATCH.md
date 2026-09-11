# Каталог сайта — официальный CRM API

Сайт читает объекты из `GET /api/feed-services/site/catalog`.
В каталог попадают только объекты с публикацией «Сайт» в CRM.

Token из Catalog API URL нельзя класть во фронтенд. Локально его подставляет Vite-прокси из `CRM_SITE_TOKEN` (файл `.env`). На сервере — nginx, см. `deploy/nginx-site-catalog.conf`.
