import { Link } from "react-router-dom";
import { LegalLayout } from "@/components/layout/LegalLayout";
import { useSite } from "@/hooks/useSite";
import { primaryEmail, primaryPhone } from "@/lib/site";

export default function CookiesPage() {
  const { profile } = useSite();
  const email = primaryEmail(profile);
  const phone = primaryPhone(profile);

  return (
    <LegalLayout title="Политика использования cookie" updatedDate="06 октября 2026 г.">
      <section>
        <h2 className="text-lg font-bold text-white mb-3">1. Общие положения</h2>
        <p>
          Настоящая Политика описывает, какие технологии хранения и сторонние сервисы фактически
          использует сайт <strong>vkrysha.ru</strong>. Она является дополнением к{" "}
          <Link to="/privacy" className="text-primary/70 hover:text-primary underline underline-offset-2">
            Политике конфиденциальности
          </Link>{" "}
          {profile.legalName}.
        </p>
        <p className="mt-2">
          Просмотр Сайта сам по себе не означает согласие на установку необязательных
          аналитических или маркетинговых cookie: такие скрипты на Сайте сейчас не подключены.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3">2. Что используется сейчас</h2>
        <p className="font-bold text-white/80 mt-2">2.1. Локальное хранение браузера (first-party)</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>localStorage</strong> — ключ <code className="text-white/50">vkrysha_cookie_consent</code>{" "}
            (выбор по уведомлению о cookie);
          </li>
          <li>
            <strong>sessionStorage</strong> — служебный флаг закрытия реферального окна.
          </li>
        </ul>

        <p className="font-bold text-white/80 mt-4">2.2. Аналитические и маркетинговые cookie</p>
        <p className="mt-2">
          Яндекс.Метрика, Google Analytics, рекламные пиксели и аналогичные счётчики{" "}
          <strong>не установлены</strong> в коде Сайта. Если они будут подключены позже, их
          загрузка будет выполняться только после отдельного согласия пользователя.
        </p>

        <p className="font-bold text-white/80 mt-4">2.3. Сторонние виджеты</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>Яндекс.Карты</strong> — iframe на страницах объектов (виджет yandex.ru). При
            загрузке карты браузер обращается к серверам Яндекса; могут обрабатываться технические
            данные (IP, сведения о браузере, параметры запроса). Условия Яндекса:
            yandex.ru/legal/maps_termsofuse/
          </li>
          <li>
            Ссылки на Telegram, WhatsApp, VK, YouTube — переход на внешние сайты по клику
            пользователя.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3">3. Управление</h2>
        <p>
          Повторно открыть уведомление и сбросить сохранённый выбор можно кнопкой «Настройки
          cookie» в футере Сайта. Также можно очистить данные сайта в настройках браузера.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3">4. Контакты</h2>
        <p>
          Вопросы по обработке данных:{" "}
          {email ? <strong>{email}</strong> : "e-mail Оператора"}
          {phone ? (
            <>
              , телефон <strong>{phone}</strong>
            </>
          ) : null}
          .
        </p>
      </section>
    </LegalLayout>
  );
}
