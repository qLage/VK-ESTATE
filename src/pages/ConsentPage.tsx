import { LegalLayout } from "@/components/layout/LegalLayout";
import { useSite } from "@/hooks/useSite";
import { Link } from "react-router-dom";
import { operatorRequisites, primaryEmail, primaryPhone } from "@/lib/site";

export default function ConsentPage() {
  const { profile } = useSite();
  const email = primaryEmail(profile);
  const phone = primaryPhone(profile);
  const operator = operatorRequisites(profile);

  return (
    <LegalLayout title="Согласие на обработку персональных данных" updatedDate="06 октября 2026 г.">
      <section>
        <h2 className="text-lg font-bold text-white mb-3">1. Оператор</h2>
        <p>
          Оператор персональных данных: <strong>{operator}</strong>.
        </p>
        {(email || phone) && (
          <p className="mt-2">
            Контакты для обращений субъекта персональных данных:
            {email ? <> e-mail <strong>{email}</strong></> : null}
            {email && phone ? ";" : null}
            {phone ? <> телефон <strong>{phone}</strong></> : null}.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3">2. Когда запрашивается согласие</h2>
        <p>
          Настоящий текст описывает согласие, которое Пользователь даёт отдельно при отправке форм
          на сайте <strong>vkrysha.ru</strong> (заявка на консультацию, реферальная форма).
          Согласие не считается данным только фактом посещения сайта или нажатием кнопки без
          соответствующего действия в форме.
        </p>
        <p className="mt-2">
          Согласие оформляется отдельно от{" "}
          <Link to="/privacy" className="text-primary/70 hover:text-primary underline underline-offset-2">
            Политики конфиденциальности
          </Link>{" "}
          и{" "}
          <Link to="/terms" className="text-primary/70 hover:text-primary underline underline-offset-2">
            Пользовательского соглашения
          </Link>{" "}
          (часть 3 статьи 9 Федерального закона № 152-ФЗ).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3">3. Состав данных</h2>
        <p>В зависимости от формы Оператор может обрабатывать:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>имя / ФИО;</li>
          <li>номер телефона;</li>
          <li>текст сообщения / комментария;</li>
          <li>для реферальной формы — данные рекомендателя и указанные им данные друга (имя, телефон), а также предпочтительный мессенджер;</li>
          <li>технические сведения о странице отправки (путь URL) и служебные метаданные заявки.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3">4. Цели обработки</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>обработка обращения и обратная связь по заявке;</li>
          <li>оказание риэлторских и сопутствующих услуг по запросу;</li>
          <li>учёт реферальных обращений (если заполнена реферальная форма).</li>
        </ul>
        <p className="mt-2">
          Согласие на рекламные рассылки этим документом <strong>не охватывается</strong> и
          отдельно на сайте не запрашивается.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3">5. Действия с данными и получатели</h2>
        <p>
          Сбор, запись, систематизация, хранение, уточнение, использование, передача
          (предоставление) уполномоченным лицам Оператора и отзыв — в объёме, необходимом для
          целей обращения.
        </p>
        <p className="mt-2">Заявки сохраняются на сервере сайта и могут передаваться:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>в информационную систему CRM Оператора (vkrysha-crm.ru) и/или сотрудникам Оператора;</li>
          <li>агенту/подрядчику, уполномоченному забирать заявки через защищённый API сайта.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3">6. Срок и отзыв</h2>
        <p>
          Согласие действует до достижения целей обработки либо до отзыва. Отозвать согласие
          можно, направив обращение на контакты Оператора с пометкой «Отзыв согласия на обработку
          персональных данных». После отзыва обработка, необходимая для исполнения закона или
          уже возникших обязательств, может продолжаться в пределах, допускаемых 152-ФЗ.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3">7. Данные третьих лиц (реферальная форма)</h2>
        <p>
          Отправляя реферальную форму, Пользователь подтверждает, что указал данные другого
          человека (друга) правомерно и проинформировал его о передаче контактов Оператору для
          связи по реферальной программе, либо имеет иное законное основание на указание таких данных.
        </p>
      </section>
    </LegalLayout>
  );
}
