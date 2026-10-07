# LEGAL_REVIEW_FINAL

**Дата среза:** 06.10.2026  
**Объект:** production `https://vkrysha.ru/` + repository  
**Аудитория:** владелец, разработчик, DevOps, юрист  
**Сопутствующий документ:** [BLOCKERS_BEFORE_PRODUCTION.md](BLOCKERS_BEFORE_PRODUCTION.md)  
**Closeout:** [AUDIT_CLOSEOUT.md](AUDIT_CLOSEOUT.md) · **Final:** [FINAL_PRODUCTION_CLOSEOUT.md](FINAL_PRODUCTION_CLOSEOUT.md) — **CONDITIONAL — VERIFICATION REQUIRED**  
**Verification pack:** [LEGAL_VERIFICATION_PACK.md](LEGAL_VERIFICATION_PACK.md)  
**Исторический evidence log:** [LEGAL_REVIEW.md](LEGAL_REVIEW.md)

При расхождении с `LEGAL_AUDIT*.md` и промежуточными редакциями приоритет у настоящего файла и `BLOCKERS_BEFORE_PRODUCTION.md`.

---

## Методология

| Слой | Значение |
|------|----------|
| PRODUCTION CONFIRMED | Установлено проверкой живого `https://vkrysha.ru/` |
| REPOSITORY ONLY | Есть в git; deployment на production **не подтверждён** |
| OWNER CONFIRMATION | Требуются документы/факты владельца |
| NOT ESTABLISHED / UNKNOWN | Из имеющихся материалов установить нельзя |
| LEGAL QUALIFICATION REQUIRED | Нужна юридическая оценка при известных/дополнительных фактах |

**Цепочка вывода:** FACT → EVIDENCE → UNKNOWN → LEGAL TEST → RISK → STATUS → ACTION  

**Правило:** отсутствие доказательства ≠ доказательство нарушения. Repository-only fix ≠ production compliance.

| Статус | Смысл |
|--------|--------|
| 🔴 CONFIRMED TECHNICAL PRODUCTION BLOCKER | Подтверждённый технический дефект production; устраняется до положительного compliance-заключения. Юридическая квалификация по 152-ФЗ — **отдельно**, если не следует напрямую из фактов |
| 🟠 VERIFICATION BLOCKER | Недостаток evidence/документов: положительное compliance-заключение невозможно; юридический дефект **не доказан** |
| 🟡 RISK / VERIFY | Риск/вопрос для проверки; сам по себе не блокирует вывод |
| 🟢 NO ISSUE FOUND | В проверенной области дефект/проблема не обнаружены |

Не используются: numeric compliance scores; формулировки «сертификация невозможна» (в данном контексте речь о **compliance-заключении**, не о государственной сертификации).

---

# 1. EXECUTIVE SUMMARY

## 1.1. Подтверждено в production (06.10.2026)

| # | FACT | EVIDENCE | STATUS |
|---|------|----------|--------|
| 1 | `POST /api/leads` без `consentAccepted` → HTTP **201**, данные принимаются | curl | 🔴 CONFIRMED TECHNICAL PRODUCTION BLOCKER |
| 2 | `POST /api/leads` с `"consentAccepted": false` → HTTP **201** | curl (повтор 06.10.2026) | 🔴 то же |
| 3 | В ответе nginx отсутствуют CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy | `curl -sI https://vkrysha.ru/` | 🔴 CONFIRMED TECHNICAL PRODUCTION BLOCKER |
| 4 | Referral сохраняет данные третьего лица (`friendName`, `friendPhone` и др.) | код + API | FACT; правовой статус — 🟠 B1 |
| 5 | На главной: «500+ сделок», Stats (500+ / 120+ / 24/7); referral rewards | production UI | FACT; статус — 🟠 B7 |

## 1.2. Verification blockers (положительное заключение невозможно без evidence)

B1 · B3 · B4 · B5 · B7 · B8

## 1.3. Repository-only (не считать реализованным в production)

| Change | Status |
|--------|--------|
| Server: `consentAccepted === true` + `consentAcceptedAt` | **IMPLEMENTED IN REPOSITORY — NOT DEPLOYED TO PRODUCTION** |
| Soften Stats / Hero «500+» | **IMPLEMENTED IN REPOSITORY — NOT DEPLOYED TO PRODUCTION** |
| Disclaimer third-party в `/consent` | **IMPLEMENTED IN REPOSITORY — NOT DEPLOYED TO PRODUCTION** |
| nginx security headers snippet | **IN REPOSITORY — NOT APPLIED ON PRODUCTION** |

Повторный curl 06.10.2026: server-side consent gate на production **не действует**.

## 1.4. Что нужно от владельца

География инфраструктуры · статус уведомления по ст. 22 / применимость исключений · договоры и роль CRM · substantiation marketing claims · полный audit CRM/динамического контента на финансовые ставки · утверждение правовых текстов · provenance отзывов и rights на медиа.

## 1.5. Final clearance position

**Положительное compliance-заключение по состоянию на 06.10.2026 не выдаётся.**

**На основании проверенных материалов невозможно дать положительное заключение о compliance production-сайта**, пока:

- открыты 🔴 B2 и B6;
- не закрыты 🟠 B1, B3, B4, B5, B7, B8.

После устранения B2/B6 и закрытия verification blockers требуется **повторный production verification**.

---

# 2. ИТОГОВАЯ МАТРИЦА B1–B8

| ID | Topic | Production fact | Legal status | Compliance status | Closure evidence |
|----|-------|-----------------|--------------|-------------------|------------------|
| B1 | Referral / third-party PD | friendName, friendPhone и др. сохраняются; отправитель ≠ субъект-друг | Правовая модель не подтверждена (ст. 6, 9, 18) | 🟠 VERIFICATION BLOCKER | Legal memo / redesign / основание субъекта |
| B2 | Server consent | POST без consent / false → 201 | Техдефект контроля заявленной модели согласия; не авто-квалификация «нарушение 152-ФЗ» | 🔴 CONFIRMED TECHNICAL PRODUCTION BLOCKER | Deploy + HTTP/UI retest |
| B3 | Localization | География БД/инфры не установлена | Ст. 18 ч. 5: положительный вывод о соблюдении невозможен | 🟠 | Infra evidence pack |
| B4 | RKN notification | Статус уведомления не подтверждён материалами | Ст. 22: обязанность/исключение/факт — UNKNOWN | 🟠 | Реестр / exemption package |
| B5 | CRM role/contracts | GET leads Bearer; CRM origin для медиа | Роль CRM из архитектуры не следует | 🟠 | Договоры + схема обработки |
| B6 | Security headers | Headers отсутствуют на prod | Security hardening gap; юр. оценка по ст. 18.1/19 отдельно | 🔴 CONFIRMED TECHNICAL PRODUCTION BLOCKER | Apply + retest |
| B7 | Advertising claims | 500+ / Stats / rewards на prod | Требуется substantiation (38-ФЗ); неподтверждённый ≠ ложный | 🟠 | Документы или снятие claims на prod |
| B8 | Mortgage/financial ads | Услуга ипотеки есть; claim «ипотека от 4%» на frontend **не зафиксирован**; CRM-контент не проаудирован полностью | Применимость ст. 28 38-ФЗ зависит от конкретного claim и роли | 🟠 | Content audit + legal memo |

---

# 3. EVIDENCE / FACTS (PRODUCTION CONFIRMED)

## 3.1. API / leads

| Проверка | Результат |
|----------|-----------|
| POST без `consentAccepted` | **201** |
| POST `"consentAccepted": false` | **201** |
| GET `?token=x` | **401** |
| GET без Authorization | **401** |
| Invalid / empty Bearer / Basic | **401** |
| Valid Bearer | **200**, полный массив leads |
| Rate limit в коде | 20/min/IP (отдельный load-тест не проводился) |
| CORS `Access-Control-Allow-Origin` | в OPTIONS **не обнаружен** |

## 3.2. Consent — три уровня (не смешивать)

| Уровень | Результат на 06.10.2026 |
|---------|-------------------------|
| **UI-level** | Contact: checkbox=false → submit disabled, fetch=0; checkbox=true → POST. Текст «нажимая кнопку, соглашаетесь» отсутствует. Ссылки `/consent`, `/privacy` есть. → 🟢 в проверенном сценарии |
| **Server-level** | API принимает и сохраняет без валидного consent. → 🔴 |
| **Legal-level** | Надлежащая правовая основа и достаточность согласия/фиксации по ст. 6/9 — **LEGAL QUALIFICATION REQUIRED** (не закрывается одним UI checkbox) |

## 3.3. Storage / third-party requests

| Проверка | Результат |
|----------|-----------|
| `document.cookie` (чистый сценарий главной) | пусто |
| Механизм cookie notice | **localStorage** ключ `vkrysha_cookie_consent` (не HTTP-cookie) |
| Analytics / Metric / пиксели на главной | **не идентифицированы** в выполненной Network-проверке (*was not identified during the performed check*) |
| Third-party на главной | изображения `vkrysha-crm.ru` |

## 3.4. Maps

| FACT | Установлено |
|------|-------------|
| iframe Yandex Maps | да |
| URL содержит координаты объекта | да |
| Подпись о стороннем сервисе | да |
| Полный состав пользовательских данных у Yandex | **NOT ESTABLISHED** |

Формулировка: *Передача/обработка данных сторонним сервисом требует отдельного privacy/vendor assessment; конкретный состав пользовательских данных, который получает Yandex в данном сценарии, из имеющихся материалов не установлен.*

## 3.5. Security / build

| Проверка | Результат |
|----------|-----------|
| Security headers (список B6) | отсутствуют |
| `.js.map` | **404** |
| Valid Bearer residual risk | компрометация токена **может** раскрыть полный набор leads (факт компрометации **не** обнаружен) |

## 3.6. Content

| Элемент | FACT |
|---------|------|
| «500+ сделок», Stats 500+/120+/24/7 | на production UI |
| Referral rewards (15/50/30/5 тыс.) | на production UI |
| Услуга «ипотечное брокерство» / помощь с ипотекой | есть |
| Claim «ипотека от 4%» в frontend Services/Hero | **не зафиксирован** evidence |
| Отзывы | hardcoded + disclaimer; authenticity not independently verified |
| Фото | из CRM/media; rights basis not verified |
| Privacy: просмотр ≠ согласие | текст `/privacy` |
| Часы работы на сайте | в production UI зафиксированы интервалы вида «Пн–Пт 09:00–20:00» (требует сверки с claim «24/7» — см. B7) |

## 3.7. Архитектура (FACT)

```
Пользователь → vkrysha.ru → POST /api/leads → leads-api → JSONL
CRM/agent    ← GET /api/leads Authorization: Bearer
Браузер      ↔ vkrysha-crm.ru (каталог/фото)
Браузер      → yandex.ru (map widget на объекте)
```

## 3.8. REPOSITORY ONLY

Consent gate · soften Stats/Hero · disclaimer `/consent` · nginx headers snippet — **не подтверждены на production**.

---

# 4. UNKNOWN / VERIFICATION ITEMS

| ID | UNKNOWN | Связь |
|----|---------|-------|
| U1 | Правовое основание обработки данных друга; подтверждение основания отправителем (см. ст. 9 ч. 8) | B1 |
| U2 | Информирование субъекта при получении данных не от него (ст. 18 ч. 3) и фактические процессы | B1 |
| U3 | Location: production server, leads JSONL, CRM, backups, replicas, logs, monitoring, CDN | B3 |
| U4 | Обязанность/исключение/факт уведомления РКН (ст. 22) | B4 |
| U5 | Оператор vs лицо по поручению; договор; access; retention; deletion CRM | B5 |
| U6 | Методика и источник цифр 500+/120+/24/7; условия referral rewards | B7 |
| U7 | Все rate/condition claims в CRM/динамическом контенте; роль сайта; банк/ПСК | B8 |
| U8 | Достаточность текста `/consent` и фиксации согласия | Legal-level consent |
| U9 | Состав данных у Yandex | Maps |
| U10 | Token rotation, access logs, IR | API residual |
| U11–U12 | Provenance отзывов; rights на медиа | 🟡 |

---

# 5. ЮРИДИЧЕСКИЕ КАРТОЧКИ B1–B8 (кратко)

### B1 — Referral

**FACT:** данные третьего лица принимаются и сохраняются.  
**UNKNOWN:** основание и механизм.  
**LEGAL TEST:** ст. 6 (основания); ст. 9 (согласие; ч. 8 — получение от не-субъекта при подтверждении оснований п. 2–11 ч. 1 ст. 6 и др.); ст. 18 ч. 3 (обязанности при получении не от субъекта — при применимости).  
**RISK:** обработка без подтверждённой модели.  
**STATUS:** 🟠  
**Формулировка:** *Правовая модель обработки данных третьего лица не подтверждена документально; положительное compliance-заключение невозможно до подтверждения правового основания и соответствующего механизма информирования/получения данных либо изменения архитектуры referral-механизма.*  
Согласие отправителя **не** является автоматически согласием друга.

### B2 — Server consent

**FACT:** API → 201 без валидного consent.  
**CONFIRMED TECHNICAL DEFECT — YES.**  
**STATUS:** 🔴 CONFIRMED TECHNICAL PRODUCTION BLOCKER  
Не квалифицируется автоматически как окончательно доказанное нарушение 152-ФЗ только на основании HTTP-теста; при этом дефект **блокирует** положительное заключение до устранения.

### B3 — Localization

**FACT:** geography NOT ESTABLISHED.  
**LEGAL TEST:** ст. 18 ч. 5 152-ФЗ (ред. с 01.07.2025, ФЗ от 28.02.2025 № 23-ФЗ): при сборе ПДн, в т.ч. через Интернет, запись/систематизация/накопление/хранение/уточнение/извлечение ПДн граждан РФ с использованием БД **за пределами РФ** не допускаются, за исключениями п. 2, 3, 4, 8 ч. 1 ст. 6.  
Локализация и последующая трансграничная передача — **разные** вопросы.  
**STATUS:** 🟠 — *география баз данных и инфраструктуры не подтверждена; положительный вывод о соблюдении требования локализации невозможен.*

### B4 — RKN

**FACT:** статус уведомления материалами **не подтверждён** (отсутствие номера в repo ≠ «не уведомлён»).  
**LEGAL TEST:** ст. 22 — необходимо проверить наличие обязанности с учётом актуальной редакции и применимых исключений, затем подтвердить фактический статус.  
**STATUS:** 🟠

### B5 — CRM

**FACT:** техническая передача/доступ к leads.  
**LEGAL TEST:** ст. 6 ч. 3 (обработка по поручению оператора — при наличии оснований и договора).  
**STATUS:** 🟠 — *Роль CRM и договорная модель документально не подтверждены; квалификация как лица, обрабатывающего по поручению, не может быть сделана только из технической архитектуры.*

### B6 — Headers

**FACT:** headers отсутствуют; snippet в repo не применён.  
**STATUS:** 🔴  
**Формулировка:** *security hardening production недостаточен; технический дефект подтверждён. Самостоятельная юридическая квалификация по 152-ФЗ требует оценки мер по ст. 18.1 и 19, угроз и архитектуры ИСПДн.*

### B7 — Advertising

**FACT:** claims на prod без предоставленного substantiation.  
**LEGAL TEST:** 38-ФЗ (достоверность рекламы).  
**STATUS:** 🟠 — *Claim требует документального подтверждения достоверности и определения условий использования.* Неподтверждённый ≠ ложный.  
По «24/7»: на сайте зафиксированы часы «Пн–Пт…» → **требует проверки соответствия** фактическому режиму (не авто-вывод о недостоверности).

### B8 — Mortgage / financial advertising

**FACT:** услуга ипотеки есть; конкретный claim «ипотека от 4%» на frontend **не зафиксирован**; полный CRM content audit **не выполнен**.  
**LEGAL TEST:** ст. 28 38-ФЗ применяется к рекламе финансовых услуг и, при наличии соответствующих условий, к рекламе услуг, связанных с предоставлением кредита (займа), в т.ч. обеспеченного ипотекой (см. ч. 2.1, 3, 3.1, 3.2 и связанные нормы актуальной редакции); связь с 353-ФЗ при ПСК. Применимость зависит от **конкретного** объекта рекламирования, наличия ставки/условий и роли сайта.  
**STATUS:** 🟠 — требуется полный content audit динамического/CRM-контента.

### Reviews / Photos

🟡 RISK / VERIFY — authenticity / rights not verified. Не «фейковые» / не «незаконное использование доказано».

---

# 6. FINAL CLEARANCE POSITION

| Вопрос | Ответ |
|--------|-------|
| Положительное compliance-заключение на 06.10.2026? | **Не выдаётся** |
| Почему | 🔴 B2, B6; 🟠 B1, B3–B5, B7, B8 |
| Что после закрытия | Повторный production verification (HTTP, UI, headers, content) |

Минимум для повторного рассмотрения:

1. B2: no consent / false → отказ (400/422); true → успех + timestamp; UI и API отдельно.  
2. B6: headers на prod; без критичных регрессий.  
3. B1, B3–B5, B7, B8: требуемый evidence / redesign / content fixes.

---

# 7. Нормативные источники

Сверка редакций — своды ConsultantPlus / ГАРАНТ и официальные тексты на дату среза **06.10.2026**. При работе с конкретной офертой/уведомлением юристу рекомендуется повторно открыть актуальную карточку нормы.

| Источник | Статья / часть | Краткий смысл (для выводов отчёта) | Ссылка / свод | Связь с выводом |
|----------|----------------|-------------------------------------|---------------|-----------------|
| 152-ФЗ | ст. 5 | Законность, цель, объём, достоверность обработки | [ConsultantPlus 152-ФЗ](https://www.consultant.ru/document/cons_doc_LAW_61801/) | Общие принципы; B7 пересекается с достоверностью заявляемых сведений |
| 152-ФЗ | ст. 6 | Условия (основания) обработки; ч. 3 — обработка по поручению | то же | B1, B5, legal-level consent |
| 152-ФЗ | ст. 9 | Согласие; ч. 8 — получение ПДн от лица, не являющегося субъектом, при подтверждении оснований п. 2–11 ч. 1 ст. 6 (и указанных в норме иных случаев) | [ГАРАНТ ст. 9](https://base.garant.ru/12148567/493aff9450b0b89b29b367693300b74a/) | B1, B2 (legal-level) |
| 152-ФЗ | ст. 18 ч. 3 | Обязанности при получении ПДн не от субъекта (при применимости) | [ГАРАНТ ст. 18](https://base.garant.ru/12148567/a573badcfa856325a7f6c5597efaaedf/) | B1 |
| 152-ФЗ | ст. 18 ч. 5 | Локализация: при сборе запрещены запись/хранение и др. с использованием БД вне РФ (с 01.07.2025 — ред. ФЗ № 23-ФЗ), с исключениями п. 2, 3, 4, 8 ч. 1 ст. 6 | то же | B3 |
| 152-ФЗ | ст. 18.1 | Организационные меры оператора | ConsultantPlus | B6 (в связке с оценкой мер) |
| 152-ФЗ | ст. 19 | Меры обеспечения безопасности ПДн | ConsultantPlus | B6, API token residual |
| 152-ФЗ | ст. 22 | Уведомление уполномоченного органа об обработке ПДн; исключения — по актуальной редакции | ConsultantPlus | B4 |
| 38-ФЗ | общие положения о рекламе (достоверность) | Запрет недостоверной рекламы | [ConsultantPlus 38-ФЗ](https://www.consultant.ru/document/cons_doc_LAW_58968/) | B7 |
| 38-ФЗ | ст. 28 | Реклама финансовых услуг; спецправила для рекламы кредита/займа, ПСК, ставок; распространение на отдельные ипотечные конструкции — по тексту ч. 2.1, 3, 3.1, 3.2 актуальной редакции | [ConsultantPlus ст. 28](https://www.consultant.ru/document/cons_doc_LAW_58968/0021818db8b93ae5fbd38076074a7182e157186c/) | B8 |
| 353-ФЗ | нормы о ПСК (по отсылке ст. 28 38-ФЗ) | Определение полной стоимости кредита (займа) | ConsultantPlus | B8 при наличии rate-claims |
| Роскомнадзор | реестр операторов / разъяснения по уведомлению и локализации | Фактический статус уведомления; практика по локализации | rkn.gov.ru (реестр); разъяснения — при закрытии B3/B4 | B3, B4 |
| ФАС России | руководства по рекламе финансовых услуг (приказ ФАС от 21.06.2024 № 412/24 и актуальные разъяснения) | Практика раскрытия условий/ПСК при ставках | [ГАРАНТ / ФАС](https://base.garant.ru/409422773/) | B8 |

Если закон допускает несколько квалификаций без фактов: **LEGAL QUALIFICATION REQUIRES ADDITIONAL FACTS.**

---

**Конец LEGAL_REVIEW_FINAL.**
