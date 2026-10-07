# LEGAL_REVIEW — независимый критический review аудита vkrysha.ru

Дата review: 2026-10-06.  
Объект: production `https://vkrysha.ru/` + репозиторий.  
Источники предыдущих выводов: `LEGAL_AUDIT.md`, `LEGAL_AUDIT_FINAL.md`, `LEGAL_ASSUMPTIONS.md`.

> **Авторитетная версия (2026-10-06):**  
> [`LEGAL_REVIEW_FINAL.md`](LEGAL_REVIEW_FINAL.md) — Executive Summary, матрица B1–B8, **EVIDENCE/FACTS**, **UNKNOWN**, **FINAL CLEARANCE POSITION**.  
> [`BLOCKERS_BEFORE_PRODUCTION.md`](BLOCKERS_BEFORE_PRODUCTION.md) — критерии закрытия каждого блокера.  
> При противоречии с текстом ниже приоритет у FINAL/BLOCKERS.  
> ABSENCE OF EVIDENCE ≠ PROVEN VIOLATION. Repository ≠ production.  
> Prod recheck: `POST /api/leads` без consent / с `false` → **201** (gate **NOT DEPLOYED**).

**Правило review:** статусы «fixed» / «compliant» / баллы не принимаются на веру. Каждый пункт: норма → код → production behavior → новый вывод.

Результаты (история пунктов): `CONFIRMED` | `PARTIALLY_CONFIRMED` | `INCORRECT` | `NOT_VERIFIABLE`.

---

## 0. Области — см. финальную матрицу в LEGAL_REVIEW_FINAL

Промежуточная сводка ниже **не** использует compliance scores и **не** объявляет proven violation там, где статус verification/unknown.

| Область | Рабочий ярлык (см. FINAL) |
|---------|---------------------------|
| Server consent control | 🔴 confirmed gap on prod (API → 201 без consent) |
| UI consent (contact) | 🟢 в проверенном сценарии |
| Legal sufficiency of consent | LEGAL REVIEW REQUIRED |
| Referral legal model | 🟠 VERIFICATION BLOCKER (violation **not** proven) |
| First-party storage vs declared | 🟢 (localStorage ≠ cookie; analytics не обнаружены) |
| Maps / Yandex | FACT: iframe request; полный состав обработки NOT VERIFIABLE |
| Advertising substantiation | 🟠 (unverified ≠ false) |
| Mortgage/finance ads | 🟠 B8 |
| Security headers | 🔴 technical baseline gap (≠ auto 152-ФЗ) |
| CRM role | 🟠 role UNKNOWN |
| Localization (ст. 18) | 🟠 geography NOT VERIFIABLE — violation **not** proven |
| RKN (ст. 22) | 🟠 status UNKNOWN — «не подано» из repo **не** следует |
| Reviews / photos | authenticity / rights NOT VERIFIABLE |

Итоговые числовые «баллы» из `LEGAL_AUDIT_FINAL` (**70/100** и т.п.) **отклоняются**.

---

## 1. Таблица review предыдущих выводов

| ID | Старый вывод | Проверка | Результат | Почему | Требуемое действие |
|----|--------------|----------|-----------|--------|-------------------|
| L01 | Referral fixed (checkbox) | Норма 152-ФЗ ст. 6/9; код `ReferralModal`; prod POST без consent → **201**; данные друга в jsonl | **INCORRECT** (как «fixed»). Статус проблемы: **NOT FIXED / PARTIALLY FIXED** (UI checkbox есть; правовая модель третьего лица и server gate — нет). **PREVIOUS AUDIT INCORRECT** | Checkbox отправителя ≠ согласие субъекта-друга; API принимал заявку без любого consent | Юридическая модель referral; до утверждения — не считать закрытым; server `consentAccepted` (внесено в репо, нужен деплой) |
| L02 | ContactForm fixed | Browser: checkbox=false → submit disabled, fetch=0; checkbox=true → POST `/api/leads`; текст без «нажимая кнопку»; API без consent → 201 | **PARTIALLY_CONFIRMED** | UI gate работает; сервер не требовал consent → обход возможен | Деплой server consent gate; фиксация согласия |
| L03 | Privacy «сайт=согласие» fixed | `PrivacyPage` текст | **CONFIRMED** | Явно: просмотр ≠ согласие | Утвердить документ у Оператора |
| L04 | Cookie policy / Метрика fixed | `CookiesPage` + Network главная (нет metrika/pixel) | **CONFIRMED** для документов/факта отсутствия Метрики | Метрики нет; localStorage описан | — |
| L05 | Cookie UI под факт + footer | Баннер «Понятно»/«Подробнее»; нет Accept/Reject аналитики; footer «Настройки cookie» | **PARTIALLY_CONFIRMED** | Соответствует отсутствию analytics; **нет** кнопки «Отклонить» как отдельного действия (только «Понятно»=necessary). Не баг при отсутствии необязательных cookie | Не позиционировать как opt-in analytics |
| L06 | Получатели раскрыты | Privacy/Consent: CRM, API agent, Яндекс.Карты | **PARTIALLY_CONFIRMED** | Текст раскрывает; договоры/роль CRM **UNKNOWN** | OWNER: договоры / роль |
| L07 | Состав ПДн ≈ формы | Privacy vs Contact/Referral | **CONFIRMED** (основные поля) | Email регистрации нет — согласовано | — |
| L08 | `/consent` fixed | Страница есть; содержание частично; фиксация согласия слабая | **PARTIALLY_CONFIRMED** | Документ есть ≠ полное соответствие ст. 9; нет durable evidence кроме jsonl после gate | LEGAL REVIEW текста; server timestamp (добавлен в репо) |
| L09 | Рассылки не запрашиваются | Формы + Privacy | **CONFIRMED** в UI/docs | Рекламные рассылки явно исключены | Не подключать без отдельного согласия |
| L10–L11 | Рисковые формулировки fixed | Hero «500+ сделок» **на prod**; Stats 500+/120+/24/7; Services смягчены; «Ключи за 3 дня»/«от 4%» в бандле не найдены как старые абсолюты | **INCORRECT** как полное «fixed». **PREVIOUS AUDIT INCORRECT** для Stats/Hero digits | Непроверенные количественные утверждения остались | Soften в репо; OWNER подтвердить цифры до возврата; деплой |
| L12 | Оферта ПП 2463 | `OfferPage` | **CONFIRMED** (по коду репо) | Отсылка убрана | OWNER утвердить оферту |
| L13 | Реквизиты банка | Hardcoded OfferPage | **CONFIRMED** как owner TODO | Не проверяемо из кода | OWNER |
| L14 | Отзывы partial | Hardcode + disclaimer на prod | **PARTIALLY_CONFIRMED** | Disclaimer ≠ доказательство подлинности → **NOT VERIFIABLE** authenticity | OWNER подтвердить/заменить |
| L15 | Token query fixed | `GET ?token=` → **401**; Bearer invalid → **401**; missing → **401** | **CONFIRMED** | Query token не работает на prod | Следить за access logs (токен в Authorization, не в URL) |
| L16 | Honeypot + rate-limit | Код есть; captcha нет | **PARTIALLY_CONFIRMED** | Спам всё ещё возможен | Рассмотреть captcha (не блокер сам по себе) |
| L17 | Локализация owner | Нет доказательств ЦОД | **NOT_VERIFIABLE** | «VPS в РФ» из репо недоказуемо | OWNER infra list |
| L18 | РКН owner | Нет номера в проекте | **NOT_VERIFIABLE** / **REQUIRES OWNER VERIFICATION** | Нельзя заключить «подано/не подано» из кода; исключения ст. 22 — юрист | OWNER + lawyer |
| L19 | Подпись карт | `PropertyMap` warning + iframe | **CONFIRMED** warning; передача данных — см. § Maps | Предупреждение есть; карта грузится сразу | LEGAL REVIEW основания; опционально click-to-load |
| L20 | Footer cookie button | Есть на prod | **CONFIRMED** | Кнопка присутствует | — |
| L21 | Security headers partial | `curl -sI https://vkrysha.ru/`: нет CSP, X-CTO, X-FO, Referrer-Policy, Permissions-Policy | **INCORRECT** как «частично закрыто на сайте». Snippet ≠ prod. **PREVIOUS AUDIT INCORRECT** если читатель считает headers применёнными | Репозиторий содержит conf; nginx production — нет | Include + reload; verify curl |
| L22 | Права на фото | CRM media | **NOT_VERIFIABLE** | Происхождение из CRM ≠ права | OWNER |
| Score 70/100 | Overall score | Методология | **INCORRECT** | Юридическое соответствие не измеряется одним числом из repo audit | Удалить практику scores |

---

## 2. Правовые основания по операциям (152-ФЗ)

Не предполагается автоматически «ПДн → обязательно согласие». Где основание нельзя установить без владельца — **NOT VERIFIABLE**.

| Операция | Данные | Цель | Правовое основание | Необходимость согласия | Получатель | Хранение |
|----------|--------|------|--------------------|------------------------|------------|----------|
| Contact form | имя, телефон, сообщение, page | Обратная связь / предобщение к услуге | Заявлено: согласие (ст. 6 п.1 + ст. 9). Альтернативы (договор/преддоговор) **возможны**, но не формализованы Оператором → **NOT VERIFIABLE** без политики Оператора | Для модели «только согласие» — да, до записи. UI требует; API (до деплоя) — нет | leads-api → CRM agent / CRM | jsonl на VPS; retention **NOT VERIFIABLE** |
| Referral (рекомендатель) | ФИО, телефон рекомендателя | Учёт реферала | Согласие отправителя (UI) | Да для его ПДн (если основание = согласие) | то же | то же |
| Referral (друг / третье лицо) | имя, телефон друга, messenger | Связь с третьим лицом | **NOT VERIFIABLE**. Согласие отправителя **не является** автоматически согласием друга. Иные основания (ст. 6) не подтверждены | Часто требуется согласие **субъекта-друга** либо иная законная модель; текущая форма этого не обеспечивает | то же | хранение чужих контактов **до** уведомления субъекта |
| Callback / телефонный клик | нет передачи сайтом (tel:) | Связь | n/a для формы | — | — | — |
| CRM transfer (GET leads) | полный lead JSON | Импорт в CRM | Поручение / собственная ИС Оператора — **UNKNOWN** | Зависит от роли CRM | Bearer agent → vkrysha-crm.ru | CRM — **NOT VERIFIABLE** |
| Cookie banner choice | localStorage `vkrysha_cookie_consent` | UX уведомления | Технические данные браузера; согласие как cookie marketing **не применяется** (скриптов нет) | Для necessary localStorage — обычно не marketing consent | только браузер пользователя | localStorage |
| Яндекс.Карты iframe | координаты/адрес в URL виджета; технические данные соединения | Показ карты | Договор с Яндексом / интерес / согласие — **REQUIRES LEGAL REVIEW** | Зависит от квалификации данных и политики Яндекса | yandex.ru | у Яндекса |
| Технические логи nginx/Node | IP, User-Agent, URL (возможно) | безопасность/отладка | ст. 6 (законные интересы / обеспечение работы) — **NOT VERIFIABLE** без политики логов | Не всегда согласие | хостинг | **NOT VERIFIABLE** retention |
| Каталог/фото с CRM | без ПДн посетителя в запросе каталога | показ объектов | n/a к ПДн пользователя | — | vkrysha-crm.ru (images) | CRM |

---

## 3. REFERRAL — специальный аудит

### 3.1. Фактическая модель

Форма собирает: имя друга, телефон друга, ФИО рекомендателя, телефон рекомендателя, messenger.

Production Network (curl, 2026-10-06):

```http
POST /api/leads {"type":"referral", ...без consent...} → 201
```

Тело сохраняет `friendName`, `friendPhone`, `referrerName`, `referrerPhone`, `messenger`.

### 3.2. Ответы на контрольные вопросы

| # | Вопрос | Вывод |
|---|--------|--------|
| 1 | Кто субъект ПДн? | Как минимум **два**: рекомендатель и друг |
| 2 | Кто оператор? | По сайту — ИП Матвеева А.В. (заявлено). Подтверждение процессов — OWNER |
| 3 | Кто предоставляет данные друга? | Отправитель формы (не субъект-друг) |
| 4 | Имеет ли отправитель право передавать? | **NOT VERIFIABLE** из кода; UI лишь заявляет подтверждение |
| 5 | Основание обработки данных друга? | **NOT VERIFIABLE** / **REQUIRES LEGAL REVIEW** |
| 6 | Как друг узнаёт об обработке? | Механизма уведомления субъекта **нет** |
| 7 | Нужно ли согласие друга? | Часто да, если нет иного основания ст. 6 — **юрист** |
| 8 | Можно ли текущей формой без доп. механизма? | **Нет** как юридически устойчивую модель только с checkbox отправителя |

### 3.3. Вердикт

**PREVIOUS AUDIT INCORRECT** в части статуса «fixed».  
Финал: 🟠 VERIFICATION BLOCKER — positive compliance conclusion невозможен; **PROVEN VIOLATION: NO** (см. LEGAL_REVIEW_FINAL / BLOCKERS B1).

Предлагаемая (не внедрённая без юр. проверки) модель:

1. Собрать только контакты рекомендателя + согласие рекомендателя.  
2. Не хранить телефон/имя друга **или** хранить минимально до подтверждения.  
3. Отправить другу приглашение/ссылку, где **он сам** оставляет заявку и согласие.  
4. Либо получить отдельное доказуемое согласие друга до звонка/хранения.

---

## 4. Согласие `/consent` и момент получения

| Элемент ст. 9 (проверка) | Статус |
|--------------------------|--------|
| Что принимает пользователь | Текст согласия + checkbox формы |
| Субъект | Пользователь-отправитель; для друга — размыто |
| Оператор | Указан |
| Цели | Указаны |
| Состав ПДн | Указан |
| Действия | Общо |
| Срок | «до целей / отзыва» — без точных сроков хранения |
| Отзыв | Контакты указаны |
| Получатели | CRM / agent / maps упомянуты |
| Способ фиксации | Checkbox + (после деплоя) `consentAcceptedAt` в lead; нет отдельного журнала согласий, ЭП и т.п. → **REQUIRES LEGAL REVIEW** достаточности |

### Browser / Network (ContactForm, production UI)

| Шаг | Результат |
|-----|-----------|
| checkbox=false | submit **disabled**; клик не даёт fetch |
| checkbox=true | submit enabled; `POST /api/leads` с body name/phone/page (**без** `consentAccepted` на текущем prod бандле) |
| API без UI | `POST` без consent → **201** (prod до деплоя gate) |

Вывод: UI-момент согласия для contact **работает**; серверная обязательность на prod **не работала** на момент review. Исправление в репозитории: `consentAccepted === true` обязателен.

---

## 5. Contact form — итог

- Checkbox обязателен в UI — **CONFIRMED**.  
- Ссылки на `/consent`, `/privacy` — **CONFIRMED**.  
- Нет ложного «нажимая кнопку соглашаетесь» — **CONFIRMED**.  
- Нет скрытого/автосогласия — **CONFIRMED**.  
- Server-side enforcement на prod на момент теста — **NOT CONFIRMED** (исправлено в коде, ждёт деплоя).

---

## 6. Referral form — Network

| Проверка | Результат |
|----------|-----------|
| Поля в POST | friendName, friendPhone, referrerName, referrerPhone, messenger, page |
| Обязательность | friend* + referrer* required в API |
| Данные третьего лица уходят | **Да** |
| POST до consent (API) | **Да, возможен** на prod на момент review |
| localStorage ПДн формы | Не обнаружено |
| sessionStorage | только `vkrysha_referral_dismissed` |
| UI без checkbox | submit disabled (код) |

---

## 7. Cookies — чистый профиль (главная)

| Проверка | Результат |
|----------|-----------|
| `document.cookie` до клика | пусто |
| localStorage до клика | пусто (после clear) |
| sessionStorage | пусто до referral timer |
| Third-party requests на главной | **изображения** `vkrysha-crm.ru` (фото каталога); analytics **нет** |
| «Понятно» | пишет `vkrysha_cookie_consent` в **localStorage** (не HTTP cookie) |
| «Отклонить» | отдельной кнопки нет |
| Повторный заход | баннер скрыт при наличии ключа |
| Настройки cookie | сброс через footer |

localStorage ≠ cookie — учтено. Отсутствие HTTP-cookie ≠ отсутствие third-party запросов (CRM images, maps на объекте).

---

## 8. Яндекс.Карты

Факт на `/catalog/{id}`:

- iframe URL: `https://yandex.ru/map-widget/v1/?ll={lng},{lat}&z=16&pt={lng},{lat},pm2rdm`
- `referrerPolicy`: `no-referrer-when-downgrade`
- Автозагрузка при открытии карточки объекта
- Подпись о стороннем сервисе — есть

**Вопрос:** передаёт ли сайт пользователя/ПДн в Яндекс при загрузке карты?

- **Доказано:** браузер пользователя инициирует запрос к `yandex.ru` с координатами объекта в query.  
- **NOT VERIFIABLE из нашего кода:** полный состав данных, которые Яндекс связывает с пользователем (IP, cookie Яндекса внутри iframe, fingerprint и т.д.) и их квалификация как ПДн в конкретной обработке.  
- Не делается вывод «только потому что iframe видит IP» как единственное доказательство; факт запроса к third-party с координатами — установлен.

---

## 9. CRM архитектура

```
vkrysha.ru → POST /api/leads (jsonl)
vkrysha-crm.ru ← GET /api/leads Authorization: Bearer (agent)
Каталог/фото: браузер ↔ vkrysha-crm.ru
```

| Вопрос | Статус |
|--------|--------|
| Какие ПДн | contact/referral fields |
| HTTPS | да (сайт) |
| Authorization | Bearer only для GET |
| Body/response | JSON lead |
| Logs/retries/backups/retention | **NOT VERIFIABLE** |
| Юридическая роль CRM | **UNKNOWN — REQUIRES OWNER/LAWYER** (свой контур Оператора vs обработчик vs самостоятельный оператор) |

Не называть CRM автоматически «третьим лицом» без анализа договоров.

---

## 10. Локализация

**NOT VERIFIABLE.** Список для владельца:

1. Страна/ЦОД VPS сайта  
2. Путь и страна диска `leads.jsonl` / `LEADS_DATA_DIR`  
3. Страна размещения CRM и БД CRM  
4. Политика и география бэкапов  
5. Где логи nginx/Node/monitoring  
6. Есть ли реплики/CDN вне РФ  

«VPS в России» без документов/панели хостинга **не доказательство**.

---

## 11. Роскомнадзор (ст. 22)

- В проекте: **нет** номера записи оператора.  
- Итог «уведомление подано/не подано» из кода **не устанавливается**.  
- Статус: **REQUIRES OWNER VERIFICATION** + **REQUIRES LEGAL REVIEW** применимости исключений актуальной редакции ст. 22.

---

## 12. Реклама — по утверждениям

| Утверждение | Рекламное? | Подтверждение | Условия | Нужна конкретизация? | Можно без риска? |
|-------------|------------|---------------|---------|----------------------|------------------|
| «Ключи за 3 дня» | да | не найдено на prod как абсолют | — | — | только с фактами/оговорками |
| «Ипотека от 4%» | да | не найдено как абсолют; в объектах могут быть банковские оферты | TODO OWNER | да | TODO OWNER |
| «15+ банков» | да | не в текущих Services | TODO OWNER | да | TODO OWNER |
| «до 50 млн» | да | не в Services; в Referral rewards «до 50.000₽» | TODO OWNER | да | TODO OWNER |
| «лучшие цены» | да | не найдено | — | — | избегать |
| «юридическая защита/чистота» | да (как гарантия) | смягчено до «проверка документов» / «поддержка» | TODO OWNER | да | осторожные формулировки |
| «500+ сделок» / Stats | да | **на prod было**; без доказательств | TODO OWNER | да | убрано в репо до подтверждения |
| Referral выплаты 15/50/30/5 тыс. | да | **NOT VERIFIABLE** | условия программы не раскрыты полно | да | TODO OWNER + оферта программы |

---

## 13. Отзывы

Hardcode в `Reviews.tsx`, авторы «Александр К.» и т.п., disclaimer на сайте.  
Подлинность / клиентский статус / происхождение: **NOT VERIFIABLE**.  
Disclaimer недостаточен как доказательство достоверности.

---

## 14. Фото

Источники: CRM `photo-data`, галерея. Права: **NOT VERIFIABLE**. «Из CRM» ≠ наличие прав на публикацию.

---

## 15. Security (факт)

| Тема | Prod / код |
|------|------------|
| Authorization GET leads | Bearer; query token **401** — CONFIRMED |
| Authentication пользователей сайта | нет ЛК |
| IDOR | GET отдаёт все leads по секрету — модель агента; утечка токена = полная выгрузка |
| Rate-limit | 20/min/IP на POST |
| CORS | OPTIONS без `Allow-Origin` (same-origin OK) |
| CSRF | same-site POST JSON; классический cookie-session CSRF не применим |
| XSS / injection | стандартный React escape; сервер trim строк |
| Secrets in frontend | CRM token без `VITE_` — OK |
| Source maps | `.js.map` → 404 |
| Security headers | **отсутствуют** на prod |
| CSP | **отсутствует**; черновик в `deploy/nginx-security-headers.conf` (закомментирован) |

---

## 16. API token — матрица

| Запрос | HTTP |
|--------|------|
| `GET ?token=` / `?token=x` / `?access_token=x` | 401 |
| `GET` без Authorization | 401 |
| `Authorization: Bearer ` / Basic | 401 |
| Valid Bearer | 200 (ранее подтверждено) |

Попадание токена в Referer при query — снято. Access/error logs сервера: **NOT VERIFIABLE** без infra.

---

## 17. Документы vs код

| Документ | Соответствие |
|----------|--------------|
| `/privacy` | В целом ≈ код; referral основание завышено как «согласие» для всех данных |
| `/consent` | Усилен disclaimer third-party (репо); на prod может быть старая версия |
| `/cookies` | ≈ факт (нет Метрики; maps раскрыты) |
| `/terms` / `/offer` | OWNER утверждение; банк реквизиты TODO |

Расхождения → **DOCUMENTATION MISMATCH** где prod бандл отстаёт от репо после правок review.

---

## 18. Исправления, сделанные в этом review (код)

Только подтверждённые технические / doc mismatches:

1. Server: обязательный `consentAccepted: true` + `consentAcceptedAt` в lead.  
2. Frontend: передача `consentAccepted` из форм.  
3. Убраны непроверенные «500+» / Stats-цифры из UI-кода.  
4. Уточнён `/consent` §7 про третьих лиц.  
5. Помечен CSP draft + факт отсутствия headers на prod в deploy conf.  
6. Обновлён устаревший блок LEGAL_ASSUMPTIONS про Метрику.

**Не трогалось автоматически:** юридическая роль CRM, локализация, РКН, договоры, права на контент, банковские реквизиты → OWNER_ACTION_REQUIRED.

**Деплой на production на момент отчёта не выполнен** — prod поведение API/баннера Stats может отличаться от репо до выкладки.
