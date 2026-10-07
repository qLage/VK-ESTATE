# BLOCKERS_BEFORE_PRODUCTION

**Дата среза:** 06.10.2026  
**Объект:** production `https://vkrysha.ru/` + repository  
**Обзор:** [LEGAL_REVIEW_FINAL.md](LEGAL_REVIEW_FINAL.md)  
**Closeout-снимок:** [AUDIT_CLOSEOUT.md](AUDIT_CLOSEOUT.md) — **CONDITIONAL — VERIFICATION REQUIRED** (🔴 нет; B2/B6 🟢 CLOSED; 🟠 B1,B3–B5,B7,B8)  
**Документы для закрытия 🟠:** [LEGAL_VERIFICATION_PACK.md](LEGAL_VERIFICATION_PACK.md)

Документ для владельца, разработчика, DevOps и юриста.  
Содержит вопросы, без закрытия которых **нельзя** выдать положительное compliance-заключение по production.

Правило: отсутствие документа ≠ доказанное нарушение; отсутствие документа **может** блокировать положительный вывод.

| Статус | Смысл |
|--------|--------|
| 🔴 CONFIRMED TECHNICAL PRODUCTION BLOCKER | Техдефект production подтверждён проверкой |
| 🟠 VERIFICATION BLOCKER | Юридический дефект не доказан; clearance без evidence невозможен |

---

## Итоговая матрица

| ID | Topic | Production fact | Legal status | Compliance status | Closure evidence |
|----|-------|-----------------|--------------|-------------------|------------------|
| B1 | Referral / third-party PD | friendName, friendPhone и др. сохраняются | правовая модель не подтверждена | 🟠 | memo / redesign / основание субъекта |
| B2 | Server consent | missing/false → **400**; true → **201** + `consentAcceptedAt` (prod 06.10.2026) | gate on production | 🟢 CLOSED | none |
| B3 | Localization | geography unknown | ст. 18 ч. 5 — вывод о соблюдении невозможен | 🟠 | infra pack |
| B4 | RKN notification | статус не подтверждён материалами | ст. 22 — A/B/C UNKNOWN | 🟠 | реестр / exemption package |
| B5 | CRM role/contracts | Bearer pull leads | роль из архитектуры не следует | 🟠 | договоры + схема |
| B6 | Security headers | CSP + X-CTO + X-FO + Referrer-Policy + Permissions-Policy on prod (06.10.2026) | hardening applied | 🟢 CLOSED | none |
| B7 | Advertising claims | 500+ / Stats / rewards на prod | требуется substantiation | 🟠 | документы или снятие на prod |
| B8 | Mortgage/financial ads | услуга есть; «от 4%» на frontend не зафиксирован; CRM не проаудирован | применимость ст. 28 зависит от claim | 🟠 | content audit + memo |

---

## B1 — Referral / third-party PD

| Поле | Содержание |
|------|------------|
| **Статус** | 🟠 VERIFICATION BLOCKER |
| **CONFIRMED LEGAL DEFECT** | Нет (не доказан) |
| **Подтверждённый production fact** | Форма/API: `friendName`, `friendPhone`, `referrerName`, `referrerPhone`, `messenger`. Данные друга сохраняются. Отправитель ≠ друг. Checkbox отправителя ≠ согласие друга. POST без consent → 201. |
| **Чего не хватает** | Правовое основание обработки данных друга; подтверждение основания при получении от не-субъекта; механизм информирования субъекта; распределение ответственности; решение по архитектуре. |
| **Юридическая квалификация** | **Нормы:** 152-ФЗ ст. 6; ст. 9 (в т.ч. ч. 8 — получение ПДн от лица, не являющегося субъектом, при подтверждении оснований п. 2–11 ч. 1 ст. 6 и указанных в норме случаев); ст. 18 ч. 3 (при получении не от субъекта — при применимости). **Вывод:** *Правовая модель обработки данных третьего лица не подтверждена документально; положительное compliance-заключение невозможно до подтверждения правового основания и соответствующего механизма информирования/получения данных либо изменения архитектуры referral-механизма.* Не писать: «реферальная форма незаконна». |
| **Конкретное действие** | Юрист+владелец: memo. Варианты после memo: убрать friendPhone; invite-link; согласие/основание субъекта-друга до записи; иное основание ст. 6 с процедурой. |
| **Критерий закрытия** | Legal memo Оператора **или** redesign без хранения чужих контактов без основания (Network-подтверждение) **или** доказуемое основание/согласие субъекта-друга до обработки. |

---

## B2 — Server-side consent gate `/api/leads`

| Поле | Содержание |
|------|------------|
| **Статус** | 🟢 CLOSED (production verified 06.10.2026) |
| **CONFIRMED TECHNICAL DEFECT** | Was YES; **fixed and verified on production** |
| **Подтверждённый production fact** | missing/`false`/`"true"` → **400** `consent_required`; boolean `true` → **201** + `consentAcceptedAt` (contact + referral). |
| **Repository / deploy** | Gate in `server/leads-api/index.js`; deployed to `/var/www/vkrysha-leads/` + frontend with `consentAccepted`. |
| **Критерий закрытия** | Выполнен. |

```bash
curl -s -w '%{http_code}\n' -X POST https://vkrysha.ru/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"type":"contact","name":"x","phone":"+7999"}'
# expect отказ (не 201)

curl -s -w '%{http_code}\n' -X POST https://vkrysha.ru/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"type":"contact","name":"x","phone":"+7999","consentAccepted":false}'
# expect отказ

curl -s -X POST https://vkrysha.ru/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"type":"contact","name":"x","phone":"+7999","consentAccepted":true}'
# expect успех + consentAcceptedAt
```

---

## B3 — Localization

| Поле | Содержание |
|------|------------|
| **Статус** | 🟠 VERIFICATION BLOCKER |
| **CONFIRMED LEGAL DEFECT** | Нет |
| **Подтверждённый production fact** | Leads пишутся server-side; CRM/медиа на отдельном origin. **Местонахождение** VPS / leads / CRM / backups / logs / monitoring **не установлено**. |
| **Чего не хватает** | location production server; leads storage; CRM; backups; replicas; logging/monitoring; cloud/CDN при участии в обработке ПДн. |
| **Юридическая квалификация** | **Норма:** 152-ФЗ ст. 18 ч. 5 (ред. с 01.07.2025, ФЗ от 28.02.2025 № 23-ФЗ) — при сборе ПДн, в т.ч. через Интернет, не допускаются запись, систематизация, накопление, хранение, уточнение, извлечение ПДн граждан РФ с использованием БД за пределами РФ, за исключениями п. 2, 3, 4, 8 ч. 1 ст. 6. Локализация ≠ трансграничная передача (ст. 12 — отдельный вопрос). **Вывод:** *география баз данных и инфраструктуры не подтверждена; положительный вывод о соблюдении требования локализации невозможен.* Не писать: «локализация нарушена». |
| **Конкретное действие** | Infra evidence pack → юр. квалификация. |
| **Критерий закрытия** | Pack принят + заключение о соответствии **или** план устранения, если geography вне допустимой модели. |

---

## B4 — RKN / уведомление

| Поле | Содержание |
|------|------------|
| **Статус** | 🟠 VERIFICATION BLOCKER |
| **CONFIRMED LEGAL DEFECT** | Нет |
| **Подтверждённый production fact** | *Статус уведомления в РКН по предоставленным материалам не подтверждён.* Отсутствие номера в repository ≠ доказательство отсутствия уведомления. |
| **Чего не хватает** | Проверка обязанности по актуальной ст. 22; применимые исключения; фактический статус в реестре; соответствие деятельности заявленным сведениям. |
| **Юридическая квалификация** | **Норма:** 152-ФЗ ст. 22. **Вывод:** *Необходимо проверить наличие обязанности по уведомлению с учётом актуальной редакции ст. 22 и применимых исключений, а затем подтвердить фактический статус уведомления/реестра.* Compliance status cannot be positively confirmed without this verification. Не писать: «РКН не уведомлён». |
| **Конкретное действие** | Владелец+юрист: реестр / exemption package / сверка сведений. |
| **Критерий закрытия** | Запись в реестре операторов РКН **или** документированное подтверждение применимого исключения **или** иной официальный evidence package. При подтверждённой обязанности и отсутствии уведомления — пересмотр статуса после фактов. |

---

## B5 — CRM / договорная модель

| Поле | Содержание |
|------|------------|
| **Статус** | 🟠 VERIFICATION BLOCKER |
| **CONFIRMED LEGAL DEFECT** | Нет |
| **Подтверждённый production fact** | `vkrysha.ru → POST /api/leads → JSONL`; CRM/agent ← `GET /api/leads` Bearer; медиа с `vkrysha-crm.ru`. |
| **Чего не хватает** | Кто оператор; кто получает данные; кто определяет цели и способы; действует ли CRM по поручению; договор поручения; состав данных и операций; location CRM/backups; retention; уничтожение; security; incident notification; access control. |
| **Юридическая квалификация** | **Норма:** 152-ФЗ ст. 6 ч. 3 (обработка по поручению — при наличии условий нормы и договора). **Вывод:** *Роль CRM и договорная модель обработки персональных данных документально не подтверждены; юридическая квалификация CRM как лица, осуществляющего обработку по поручению, не может быть сделана только из технической архитектуры.* Не называть автоматически «обработчиком по поручению». |
| **Конкретное действие** | Договоры + схема обработки + сверка с Privacy/Consent. |
| **Критерий закрытия** | Документы и юр. квалификация роли приняты; тексты сайта согласованы с моделью. |

---

## B6 — Security headers

| Поле | Содержание |
|------|------------|
| **Статус** | 🟢 CLOSED (production verified 06.10.2026) |
| **CONFIRMED TECHNICAL DEFECT** | Was YES; **fixed and verified on production** |
| **Подтверждённый production fact** | `curl -sI https://vkrysha.ru/` возвращает CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy. Snippet: `/etc/nginx/snippets/vkrysha-security-headers.conf`. |
| **Deploy** | Include в HTTPS `server` и в `/assets/` (из‑за nginx add_header inheritance). Compatible CSP: self + CRM images + Yandex frame-src. |
| **Functional smoke** | home/catalog/property 200; site-catalog 200; CRM img 200; leads gate intact; map-widget in bundle. |
| **Юридическая квалификация** | Production security hardening был недостаточен; после применения конфигурации **технический** blocker закрыт. Не трактовалось как автоматическое нарушение 152-ФЗ. |
| **Критерий закрытия** | Выполнен. |

---

## B7 — Advertising claims

| Поле | Содержание |
|------|------------|
| **Статус** | 🟠 VERIFICATION / SUBSTANTIATION BLOCKER |
| **CONFIRMED LEGAL DEFECT** | Нет |
| **Подтверждённый production fact** | На prod: «500+ сделок»; Stats 500+ / 120+ / 24/7; referral rewards. Soften в repo — **NOT DEPLOYED**. На сайте также зафиксированы часы вида «Пн–Пт 09:00–20:00». |
| **Чего не хватает** | Период, методика, источник, воспроизводимость, к какому лицу/бренду относится показатель, актуальность; условия referral rewards. |
| **Юридическая квалификация** | **Норма:** 38-ФЗ (достоверность рекламы). *Claim требует документального подтверждения достоверности и определения условий его использования в рекламе.* Неподтверждённый claim ≠ автоматически ложный. По «24/7»: *требует проверки соответствия фактическому режиму работы* (не авто-вывод о недостоверности). |
| **Конкретное действие** | Substantiation **или** снятие/замена claims на production. |
| **Критерий закрытия** | Документы на файле Оператора **или** claims сняты/изменены на production. |

| Claim | Production evidence | Что требуется подтвердить | Status |
|-------|---------------------|---------------------------|--------|
| 500+ сделок | Hero / UI | период, методика, источник, бренд | 🟠 |
| Stats 500+ | Stats block | то же | 🟠 |
| 120+ | Stats block | то же | 🟠 |
| 24/7 | Stats block | соответствие режиму работы (на сайте есть Пн–Пт) | 🟠 |
| Referral rewards | Referral UI | условия выплат, оферта/правила | 🟠 |
| «Ключи за 3 дня» / «15+ банков» / «лучшие цены» | в проверенном frontend Services **не зафиксированы** | — | вне текущего B7 evidence |
| «ипотека от 4%» | на frontend **не зафиксирован** | см. B8 / CRM audit | B8 |

---

## B8 — Mortgage / financial advertising

| Поле | Содержание |
|------|------------|
| **Статус** | 🟠 VERIFICATION BLOCKER |
| **CONFIRMED LEGAL DEFECT** | Нет |
| **Подтверждённый production fact** | Услуга помощи с ипотекой / ипотечное брокерство есть. Конкретный claim **«ипотека от 4%»** на frontend Services/Hero **не зафиксирован** production evidence. Ставки/условия **могут** быть в CRM/динамическом контенте — **требуется полный content audit**. |
| **Чего не хватает** | Перечень всех финансовых claims; кто оказывает услугу; роль сайта (рекламодатель / посредник / инфоплощадка); наличие ставки и условий; необходимость раскрытий; применимость ст. 28 к каждому claim. |
| **Юридическая квалификация** | **Норма:** 38-ФЗ ст. 28 (актуальная редакция на 06.10.2026) — реклама финансовых услуг; спецправила при рекламе услуг, связанных с предоставлением кредита (займа), информацией о ставках и ПСК (см. ч. 2.1, 3, 3.1, 3.2 и связанные положения; отсылка к 353-ФЗ по ПСК). **Не** утверждать автоматически, что любое упоминание ипотечной услуги = применение полного режима ст. 28 ко всему сайту. Квалификация зависит от конкретного объекта рекламирования и роли компании — при отсутствии фактов: UNKNOWN. |
| **Конкретное действие** | Полный content audit динамического/CRM-контента + legal memo. |
| **Критерий закрытия** | Memo «rate-claims отсутствуют» **или** каждый найденный claim соответствует применимым требованиям ст. 28 и фактическому офферу; изменения на production при необходимости. |

---

## Не blockers clearance (🟡 RISK / VERIFY)

| Тема | Формулировка |
|------|----------------|
| Отзывы | Authenticity and provenance of testimonials were not independently verified. |
| Фото | Rights basis for the used media was not verified. |
| Bearer residual | Компрометация действующего Bearer token может привести к раскрытию полного набора leads (компрометация не обнаружена). |
| Yandex Maps | Vendor/privacy assessment; состав пользовательских данных у Yandex не установлен. |
| Captcha / click-to-load maps | Усиления; не замена B2 / юр. модели. |
| Legal sufficiency `/consent` | После B2 — отдельный legal review ст. 9. |

---

## Порядок закрытия

1. **B2** — deploy consent gate + retest.  
2. **B6** — apply headers + retest.  
3. **B1** — legal model или redesign.  
4. **B3 + B4 + B5** — owner/lawyer packs.  
5. **B7 + B8** — substantiation / content audit.  
6. Повторный review по LEGAL_REVIEW_FINAL.

---

## Final clearance (кратко)

**Положительное compliance-заключение по состоянию на 06.10.2026 не выдаётся.**

Причины: 🔴 B2 и B6 — подтверждённые технические production blockers; 🟠 B1, B3, B4, B5, B7, B8 — verification/substantiation blockers до получения необходимого evidence.

Repository-only fixes **не** заменяют production verification.
