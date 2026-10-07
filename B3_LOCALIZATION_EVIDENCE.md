# B3 — LOCALIZATION EVIDENCE PACK

**Дата:** 06.10.2026  
**Нормативная рамка:** 152-ФЗ ст. 18 ч. 5 (базы при сборе ПДн граждан РФ)  
**Вывод:** положительный по проверенным контурам сбора/хранения leads и CRM host.

| Контур | Provider | Country / region | База / путь | Операции | Источник |
|--------|----------|------------------|-------------|---------|----------|
| Production site VPS | JSC TIMEWEB (AS9123) | RU / Moscow (`msk-1-vm-mubj`, ipinfo country=RU) | `/var/www/vkrysha-estate` | раздача SPA | SSH + ipinfo 06.10.2026 |
| Leads storage | тот же VPS TIMEWEB | RU / Moscow | `/var/lib/vkrysha-leads/leads.jsonl` (`LEADS_DATA_DIR`) | append / read | SSH ls + env 06.10.2026 |
| Leads API process | тот же VPS | RU / Moscow | `/var/www/vkrysha-leads` | запись заявок | SSH |
| CRM host `vkrysha-crm.ru` | JSC TIMEWEB (AS9123) | RU / Moscow (IP `81.200.158.123`, ipinfo country=RU) | CRM application DB на этом host (по размещению origin) | каталог / site-profile / обработка заявок CRM | dig + ipinfo 06.10.2026 |
| Replicas | не обнаружены | N/A | — | — | SSH/cron без реплик |
| OS backups на site VPS | локальные `/var/backups` (apt) | RU / тот же диск | системные | не содержат leads.jsonl как целевой бэкап ПДн | SSH |

**Не утверждается:** «вся инфраструктура любых подрядчиков гарантированно в РФ навсегда».  
**Утверждается:** по применимому требованию локализации для контуров сбора leads и хоста CRM на дату проверки базы/хинги размещения находятся в РФ (TIMEWEB, Москва).

**Residual (non-blocking):** политика off-site снимков TIMEWEB / явная выписка ЦОД из панели — рекомендация, не blocker.
