# B8 — MORTGAGE / FINANCIAL ADS AUDIT

**Дата:** 06.10.2026  
**Объём:** production frontend + CRM catalog via `https://vkrysha.ru/api/site-catalog` (54 объекта)

## Найденные rate/condition claims (CRM source descriptions)

Примеры (до санитизации на публичном сайте):

- «ставка до 6%» + расчёт ежемесячного платежа (семейная ипотека) — несколько объектов
- «семейная ипотека от 3.9%, базовая от 11.9%» — объект `be441f2b-…`
- «минимальной ставкой 6%» — объект `57a9990c-…`

Квалификация: в текстах объектов рекламируются **ставки/условия ипотечного кредитования** (банк как кредитор; агентство — посредничество/помощь с одобрением). Без полного disclosure такие claims на публичном сайте недопустимы как неквалифицированная финансовая реклама.

## ACTION

Публичный сайт: `sanitizeMortgageAdClaims()` в `src/lib/api.ts` при нормализации catalog/property — rate/payment sentences удаляются из отображаемого description.

Retest 06.10.2026: **6** объектов с rate-patterns в raw API → **0** после sanitize.

Frontend статики: ставка «ипотека от X%» в Hero/Services **не** найдена.

## Closure

Production public surface очищена от rate/condition claims.  
**B8 = 🟢 CLOSED**

**Residual:** почистить исходные тексты в CRM (источник всё ещё содержит ставки) — не blocker для публичного сайта после sanitize.
