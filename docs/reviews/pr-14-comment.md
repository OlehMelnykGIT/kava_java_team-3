Post-merge review Team Lead: перевірено #14 (`06fb378`) у поточному
`main de9b752`. Семантичні label/input, autocomplete, required та mailto/tel —
добра основа HTML-етапу.

- **BLOCKER для готової Contacts — `src/partials/contacts.html:41`,
  `src/main.js:1`: немає submit/API logic.** Форма без method/action і без
  preventDefault виконує GET на поточну сторінку. У Chrome відтворено спробу
  переходу `?name=A&phone=abc&message=`; реальний запит перехоплено, замовлення
  не створювалися. Потрібен async submit-handler: validation → POST
  `https://wedding-photographer.b.goit.study/api/orders` → перевірка response.ok
  → Success Modal. На validation/API/network error модалка не відкривається;
  pending submit блокується, loader прибирається у finally. Контракт модалки
  підготовлений Team Lead окремо.
- **MAJOR — `src/partials/contacts.html:44–66`: HTML-обмеження не відповідають
  API.** `name="A"`, `phone="abc"` проходять checkValidity(). Додайте name
  minlength=2/maxlength=64, phone pattern для 12 цифр (і зрозумілу підказку
  формату), message minlength=5/maxlength=256. Порожній необов'язковий message
  слід не включати в payload; додатково перевіряйте trim/дані перед POST.
  Джерело:
  https://wedding-photographer.b.goit.study/api-docs/#/Order/post_orders.
- _*MAJOR для готової секції — `src/css/contacts.css:1`: є лише
  `.section { padding: 72px 0; }`, styles для contacts-* відсутні._* У browser
  input має Arial, body — Mulish; responsive layout, states, loader/error
  display ще не реалізовані. Типографіку form controls варто вирішити спільно
  через font: inherit, стилі секції — у Contacts CSS за Figma.
- **SUGGESTION — scope:** зміни `src/icons-test.html` і whitespace
  `src/img/icons.svg` не потрібні для Contacts. Спільний sprite не форматувати
  разом із секцією; надалі такі зміни відокремлювати.

`npm run build` PASS, HTML partial проходить Prettier. Це коректний початковий
HTML-етап, але не завершена функціональність Contacts. Повне порівняння макета
ще не виконано через ліміт Figma MCP. Зауваження про відсутню поведінку —
release/integration blockers, а не твердження, що PR обіцяв готовий JS.
