# Team Lead review: PR та спільна основа

Дата: 2026-09-23. Remote main: `de9b752bfac7f2d1fa46f5bd54f63c0a766e1456`.
Локальна feature/success-modal базується на `1255619` і має незакомічені зміни;
їх не перемішували із завантаженими PR. Review виконано в `/tmp/kava-pr-review`
та `/tmp/kava-pr15`. Усі наявні PR завантажено: #13, #14, #15.

## Статуси

| PR                                                                              | Статус на момент перевірки | Результат                                                                    |
| ------------------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| [#15 Portfolio](https://github.com/OlehMelnykGIT/kava_java_team-3/pull/15)      | Відкритий, `b862adc`       | HTML-каркас; потрібні якір, контракт section spacing, опис наступних етапів  |
| [#14 Contacts](https://github.com/OlehMelnykGIT/kava_java_team-3/pull/14)       | Уже merged, `06fb378`      | HTML-етап; відсутні POST, API validation, стилі та стани                     |
| [#13 Footer/Success](https://github.com/OlehMelnykGIT/kava_java_team-3/pull/13) | Уже merged, `4b324bd`      | Runtime defects: broken assets/srcset, видима модалка, непрацюючий logo link |

Детальні review-коментарі з файлами, місцями, порушеними вимогами й
виправленнями: [PR 15](pr-15-comment.md), [PR 14](pr-14-comment.md),
[PR 13](pr-13-comment.md). Відсутні CSS/JS у явно названих HTML-only PR —
незавершені етапи; їх не слід помилково називати новими регресіями. Однак такі
етапи не є готовими секціями для release. 404/некоректний srcset/порожнє
logo-посилання — конкретні дефекти HTML.

## Підтверджені проблеми спільної основи

### MAJOR: немає modern-normalize

`package.json:17`, `src/css/styles.css:1`: залежність і імпорт відсутні, хоча це
пряма вимога загального завдання. Поточний reset не є modern-normalize. В
окремому foundation PR додати пакет та його імпорт першим, потім reset/base.
Зміна зачіпає всю сторінку, тому повторно перевірити секції після підключення.

### MAJOR: різна типографіка тексту та controls

`src/css/reset.css:26`, `src/css/base.css:13`: задано font для root, але немає
успадкування на input/textarea/button/select. У Chrome production input = Arial,
body = Mulish. У base/reset додати
`button, input, textarea, select { font: inherit; }`; колір controls також
узгодити. Heading utility або локальний heading-клас має використовувати
Cormorant; зараз Contacts/Portfolio h2 залишаються браузерними Mulish bold, бо
section CSS не реалізовано. Не встановлювати один довільний розмір усім h1/h2 —
шкалу розмірів потрібно перевірити в Figma.

### MAJOR: невизначений власник вертикальних відступів

`src/css/about.css:1`, `benefits.css:1`, `feedbacks.css:1`, `portfolio.css:1`,
`faq.css:1`, `contacts.css:1` дублюють `.section { padding: 72px 0; }`. Це
глобальне правило повинно мати одне місце визначення; зміна порядку імпортів не
має змінювати відступи всіх секцій. 72px — scaffold, не підтверджене
універсальне значення Figma. В уже прочитаному desktop-макеті є секції з 92px,
Hero — 48px, тому один global 112px чи 72px для всіх секцій буде неправильним.

Окремо: незакомічена користувацька версія `src/css/container.css:6` має
`padding: 64px 16px`, на desktop — `112px 64px`. Якщо об'єднати її з Contacts,
що має `.section`, зверху/знизу сумуються 72+64=136px або 72+112=184px. Для
Header/Footer такі вертикальні поля контейнера теж небажані. Цю користувацьку
зміну не редагували.

Рішення: `.container` тільки width/max-width/margin та padding-inline; section
або її modifier відповідає за padding-block. Єдиний базовий `.section` визначити
в base, а відхилення конкретних секцій — у їхніх CSS.

### MAJOR: container не відповідає заданій адаптивній моделі

Remote `src/css/container.css:4,11`: один max-width 1440px на всіх ширинах і
24px mobile padding при 375px. На 1024px контейнер тягнеться до 1024px замість
tablet adaptive max-width 768px. У раніше отриманих mobile шарах Figma є 335px
контент при viewport 375px: бокові поля 20px, а не 24px.

Узгоджений контракт для foundation PR: fluid від 320px, max-width 375px до
768px; tablet max-width 768px; desktop max-width 1440px. Поля 20/32/64px слід
підтвердити для всіх загальних layout-контейнерів; не переносити специфічні поля
modal на всі секції без перевірки. Header/Footer та full-bleed backgrounds мають
окремі зовнішні оболонки.

### MAJOR: спільні стани controls не визначені

`src/css/base.css`, `src/css/reset.css`, `src/css/contacts.css:1`: немає
спільного контракту для button/link/input hover, focus-visible, disabled,
invalid, pending. Браузерний outline не видалено — сам по собі це не
accessibility defect. Однак стани UI Kit не реалізовані. Потрібно зняти значення
з Figma, додати повторно використовувані classes/tokens і застосувати у секціях.
Visually-hidden utility додавати для реальних прихованих підписів; не ховати
через display:none текст, потрібний screen readers.

### MAJOR: CI не перевіряє PR до merge

`.github/workflows/deploy.yml:3–5` запускається лише на push у main.
`package.json:6–10` не містить format-check/lint. Є `.prettierrc.json`, але
автоматичної перевірки немає. Додати окремий pull_request job з `npm ci`, build,
format-check і перевіркою HTML/assets; deploy залишити тільки для main. Не
вважати зелений build доказом відсутності runtime 404 або працездатності форми.

### MINOR: formatting drift

Prettier check показав проблеми у `base.css`, `styles.css`, `contacts.css`,
`portfolio.css`, `modal.css` remote main. Виправляти цільовим foundation PR; не
форматувати sprite і чужі HTML разом з окремою feature.

## Правила розмітки та стилів для наступних review

1. Partial містить семантичний section/footer/header, не дублює html/head/body.
   В одному документі один головний h1; секції мають h2 та стабільні ids для
   nav.
2. Внутрішній `.container` керує горизонтальною сіткою. Section — вертикальними
   відступами. Не використовувати контейнер як універсальний padding для всього.
3. Section CSS використовує власні класи; глобальні element selectors і
   utilities залишаються в reset/base. Не дублювати `.section` у файлах різних
   авторів.
4. Mobile First, тільки погоджені 768/1440 breakpoint; 320px fluid і 375px
   adaptive. Перевіряти також проміжні 767/1024/1439px, а не тільки точки
   макета.
5. Fonts/colors/radii — поточні CSS variables з уточненням за Figma. Не
   створювати окремі набори кольорів або typography без причини. Не
   застосовувати глобально `outline: none`; інтерактивні елементи мають видимий
   keyboard focus.
6. Action = button з type; navigation = a з реальним href. SVG не замінює
   button; icon-only controls мають aria-label. Label пов'язаний з input, errors
   доступні.
7. Assets partial розраховуються від index: `./img/...`; raster має alt, width,
   height, коректний srcset x1/x2. Спрайт через use; декоративні SVG
   aria-hidden.
8. Form request має validation, pending/duplicate protection, success/error
   paths. Success Modal викликається лише після успішного response, не з submit
   як такого.
9. Статичний HTML, styling та API integration — явно зазначені етапи PR.
   Порожній UI чи дія без реалізації не позначаються як завершена секція.
10. Перед merge: build, format-check, production base-path smoke test, browser
    console, responsive, keyboard, assets та перевірка state/error scenarios.

## Порядок виправлень

1. Інтегрувати одну Team Lead Success Modal в актуальний main із ручним
   розв'язанням overlap у success-modal.html, зберігши Footer/Contacts. Видалити
   дубль фото лише після перевірки всіх посилань; не зливати гілки наосліп.
2. Виправити Footer paths, logo-link і rel/srcset (якщо стара модалка ще живе).
3. Foundation PR: normalize, control typography, container contract, один
   `.section`, typography/state tokens після звірки Figma, PR CI.
4. Завершити Contacts submit/validation/loader/error і інтегрувати
   openSuccessModal.
5. Доробити Portfolio data/styles та навігаційні anchors усіх секцій.

## Перевірки й обмеження

- Актуальний main і окремі heads PR13/PR14/PR15: `npm run build` PASS.
- Prettier для трьох нових HTML partials та Portfolio PASS; перелічені CSS FAIL.
- PR15 production build перевірено в Chrome на 320/375/768/1024/1440px.
- Зібраний сайт змонтований саме під `/kava_java_team-3/`, як GitHub Pages.
- Підтверджено 404 `/img/icons.svg` та `/img/success-content-image.jpg`, browser
  warning `srcset unknown descriptor`, logo-link 0×0, видиму модалку,
  неправильний GET submit та прийняття невалідних API значень.
- Реальний POST не робився; навігаційний GET із тестовими значеннями
  перехоплено.
- Візуальні screenshots: `/tmp/kava-review-375.png`,
  `/tmp/kava-review-1440.png`.
- Повне ТЗ окремим документом не надано: використано завдання користувача,
  CONTRIBUTING, Swagger і доступні раніше прочитані Figma дані.
- Figma MCP-ліміт вичерпано: повна pixel-accurate звірка цих секцій і UI Kit
  pending. Немає вигаданих тверджень про точні кольори/типографіку недоступних
  компонентів.
- Safari/Firefox, реальна Contacts інтеграція та API Portfolio ще не перевірені.
- Код чужих секцій, remote main, merge status і користувацькі зміни не змінено.

## Публікація

Коментарі підготовлено локально. Публікація у GitHub очікує завершення
авторизації користувача через GitHub device login; станом на завершення аудиту
жодного коментаря ще не опубліковано.
