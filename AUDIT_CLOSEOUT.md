# AUDIT CLOSEOUT — vkrysha.ru / related CRM host isolation

**Дата closeout:** 06.10.2026  
**Scope:** существующая матрица P0 + B1–B8; без расширения аудита  
**Принцип:** не доказано ≠ нарушено; best practice ≠ blocker; repository-only ≠ production fix

---

## Финальная таблица

| ID | Issue | Previous status | Current evidence | Current status | Required action |
|----|-------|-----------------|------------------|----------------|-----------------|
| P0 | X-Forwarded-Host tenant spoofing | OPEN | Trusted host = `Request.Host.Host`; client XFH ignored; tests TrustedHostXxfSpoof 10/10, PublicHost 10/10, TenantIsolation 56/56; build 0 errors; nginx `Host`/`X-Forwarded-Host` = `$host`; `XForwardedHost` не в ForwardedHeaders | 🟢 CLOSED | none |
| B1 | Referral / third-party PD | 🟠 | friendName/friendPhone по-прежнему собираются; правовое основание не предоставлено | 🟠 VERIFICATION BLOCKER | legal memo / redesign / основание субъекта |
| B2 | Server-side consent | 🔴 | **Prod retest 06.10.2026 after deploy:** missing→**400**, false→**400**, `"true"`→**400**, true→**201** + `consentAcceptedAt`; referral same. Frontend deployed with `consentAccepted`. | 🟢 CLOSED | none |
| B3 | Localization | 🟠 | география БД/инфры не предоставлена | 🟠 VERIFICATION BLOCKER | infra evidence pack |
| B4 | RKN notification | 🟠 | статус уведомления не подтверждён материалами | 🟠 VERIFICATION BLOCKER | реестр / exemption package |
| B5 | CRM role/contracts | 🟠 | договоры/роль не предоставлены | 🟠 VERIFICATION BLOCKER | договоры + схема обработки |
| B6 | Security hardening / HTTP headers | 🔴 | **Prod 06.10.2026 after apply:** CSP, X-CTO, X-FO, Referrer-Policy, Permissions-Policy present on `/` and `/assets/`; home/catalog/property/API/CRM img/leads OK | 🟢 CLOSED | none |
| B7 | Advertising claims | 🟠 | Prod JS всё ещё содержит `500+ сделок`, Stats/`24/7`; soften только в repo | 🟠 VERIFICATION BLOCKER | substantiation **или** deploy soften + verify |
| B8 | Mortgage advertising | 🟠 | услуга ипотеки есть; claim «от 4%» на frontend не зафиксирован; CRM content audit не выполнен владельцем | 🟠 VERIFICATION BLOCKER | content audit / legal memo |

---

## A. CLOSED

### P0 — X-Forwarded-Host tenant spoofing — 🟢 CLOSED

Защита от tenant spoofing через клиентский `X-Forwarded-Host` устранена. Tenant определяется через `Request.Host.Host` посредством централизованного trusted-host механизма. Клиентский `X-Forwarded-Host` не влияет на выбор tenant. Регрессионные тесты проходят: TrustedHostXfhSpoofTests 10/10, PublicHost 10/10, TenantIsolation 56/56. Сборка успешна, 0 ошибок.

Прямой доступ к Kestrel в обход nginx (подмена `Host`) **не** переоткрывает P0 XFH → см. residual risks.

### B2 — Server-side consent enforcement — 🟢 CLOSED

Deployed `server/leads-api/index.js` to `/var/www/vkrysha-leads/` + `systemctl restart vkrysha-leads`. Frontend `dist/` deployed to `/var/www/vkrysha-estate/` (UI sends `consentAccepted: true`).

Production acceptance (https://vkrysha.ru/api/leads):

| Request | Result |
|---------|--------|
| missing consent | **400** `consent_required` |
| `consentAccepted: false` | **400** |
| `consentAccepted: "true"` (string) | **400** |
| `consentAccepted: true` (contact) | **201** + `consentAcceptedAt` |
| referral missing | **400** |
| referral `true` | **201** + `consentAcceptedAt` |

### B6 — Production security hardening (HTTP headers) — 🟢 CLOSED

Applied `/etc/nginx/snippets/vkrysha-security-headers.conf` (include in HTTPS `server` + `/assets/`). `nginx -t` OK, reload OK.

Production `curl -sI https://vkrysha.ru/` returns: Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.

Functional smoke: home/catalog/property **200**; site-catalog API **200**; CRM image **200**; leads missing **400** / true **201**; map-widget URL present in bundle.

Qualification: production security hardening was insufficient; after applying configuration the **technical** blocker is closed. Absence of headers was not treated as an automatic 152-FZ violation.

### Ранее подтверждённые NO ISSUE (без повторного открытия)

| Item | Evidence | Status |
|------|----------|--------|
| Query token на GET `/api/leads` | `?token=x` → 401 | 🟢 |
| Missing Authorization | → 401 | 🟢 |
| Contact UI checkbox gate | false → POST нет (ранее browser) | 🟢 UI-level |
| Analytics/Metric на главной | не идентифицированы в выполненной проверке | 🟢 в проверенном контуре |
| localStorage ≠ HTTP cookie | cookie notice в localStorage | 🟢 |
| Source maps | `.js.map` → 404 | 🟢 |

---

## B. OPEN

### 🔴 CONFIRMED PRODUCTION BLOCKERS

*Нет открытых 🔴 на момент closeout после B2/B6.*

### 🟠 VERIFICATION BLOCKERS

#### B1 — Referral / third-party PD

| | |
|--|--|
| **Почему открыт** | Данные друга собираются; правовая модель (ст. 6/9/18) не подтверждена |
| **Evidence отсутствует** | Legal memo / redesign |
| **Кто** | Владелец + юрист |
| **Closure** | memo **или** отсутствие хранения чужих контактов без основания |

#### B3 — Localization

| | |
|--|--|
| **Почему открыт** | Местонахождение БД при сборе ПДн не подтверждено → положительный вывод по ст. 18 ч. 5 невозможен |
| **Evidence отсутствует** | Infra pack (server, leads, CRM, backups, logs, replicas) |
| **Кто** | Владелец / DevOps |
| **Closure** | Документальное подтверждение geography |

#### B4 — RKN notification

| | |
|--|--|
| **Почему открыт** | Статус уведомления не подтверждён (отсутствие номера в repo ≠ «не уведомлён») |
| **Evidence отсутствует** | Запись реестра / exemption package |
| **Кто** | Владелец + юрист |
| **Closure** | Реестр или документированное исключение |

#### B5 — CRM role/contracts

| | |
|--|--|
| **Почему открыт** | Роль CRM из архитектуры не следует |
| **Evidence отсутствует** | Договор / поручение / схема целей и операций |
| **Кто** | Владелец + юрист |
| **Closure** | Документы + юр. квалификация роли |

#### B7 — Advertising claims

| | |
|--|--|
| **Почему открыт** | Claims на prod без substantiation; soften не deployed |
| **Evidence отсутствует** | Методика/источник цифр **или** production без этих claims |
| **Кто** | Владелец (+ DevOps для deploy soften) |
| **Closure** | Documents **или** prod UI без непроверенных цифр. Неподтверждённое ≠ ложное |

#### B8 — Mortgage / financial advertising

| | |
|--|--|
| **Почему открыт** | Квалификация CRM/динамических финансовых claims не подтверждена |
| **Evidence отсутствует** | Content audit + роль/оффер |
| **Кто** | Владелец + юрист |
| **Closure** | Memo «нет rate-claims» **или** соответствие применимым требованиям по каждому claim |

---

## C. RESIDUAL RISKS / RECOMMENDATIONS (не blockers)

| Item | Note |
|------|------|
| Прямой доступ к Kestrel / подмена `Host` в обход nginx | 🟡 Residual infrastructure risk; не reopen P0 XFH без proof недоверенного доступа |
| Компрометация valid Bearer → полный dataset leads | 🟡 Рекомендации: rotation, logs, least privilege, IR |
| Captcha | 🟡 Hardening против spam |
| Yandex Maps vendor assessment | 🟡 Состав данных у Yandex не установлен |
| Reviews authenticity / media rights | 🟡 Not independently verified |
| CSP (после headers baseline) | 🟡 Включать только после совместимости |
| Legal sufficiency текста `/consent` (ст. 9) | 🟡 После закрытия B2 |

---

## D. FINAL DECISION

# CONDITIONAL — VERIFICATION REQUIRED

Технические production blockers **B2** и **B6** закрыты (🟢).  
Открыты только **🟠** documentary/legal verification: B1, B3, B4, B5, B7, B8.

Не означает «100% compliant». Positive compliance sign-off возможен после закрытия 🟠.

---

## E. STOP CONDITION

Аудит по матрице P0 + B1–B8 **закрыт как closeout-снимок**.

Новые blockers **не добавляются**, пока в материалах не появится новый **подтверждённый production-факт**, который непосредственно меняет результат (например: deploy B2/B6 → retest и перевод в 🟢 CLOSED).

Не удерживать аудит открытым ради теоретической полноты или best practices.
