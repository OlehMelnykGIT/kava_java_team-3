# Командна робота

## Запуск

```bash
npm install
npm run dev
```

Перевірка production-збірки:

```bash
npm run build
```

## Структура

- `src/partials` — HTML секцій;
- `src/css` — стилі секцій;
- `src/js` — JavaScript-логіка;
- `src/img` — зображення та SVG;
- `src/index.html` — головна сторінка;
- `src/main.js` — головний JS-файл.

## Git workflow

`main` захищена. Працюйте у власній гілці:

```bash
git switch main
git pull origin main
git switch -c feature/назва-задачі
```

Після роботи:

```bash
git add .
git commit -m "опис змін"
git push -u origin feature/назва-задачі
```

Створіть Pull Request у `main`. Merge виконується після review та успішного
`npm run build`.

## Правила

- Один розробник — одна feature-гілка.
- Одне завдання — один Pull Request.
- HTML секції зберігайте у відповідному partial-файлі.
- CSS секції зберігайте в окремому файлі `src/css/<section>.css`.
- Використовуйте Mobile First і медіа-запити `min-width`.
- Breakpoints: `375px`, `768px`, `1440px`.
- Усі секції використовують спільний `.container`.
- Спільні файли змінюйте лише після погодження з тімлідом.

## Спільні файли

Не видаляйте та не перейменовуйте без узгодження:

- `package.json` і `package-lock.json`;
- `vite.config.js`;
- `.editorconfig` і `.prettierrc.json`;
- `src/index.html`, `src/main.js`;
- `src/css/reset.css`, `src/css/base.css`, `src/css/container.css`,
  `src/css/styles.css`.

## Зображення

- Для кожного контентного фото готуйте пару файлів: `name.jpg` і `name@2x.jpg`.
- Зберігайте всі фото безпосередньо у `src/img` у форматі JPG.
- Для Retina використовуйте `<picture>` або `srcset` з файлами `name.jpg` і
  `name@2x.jpg`.
- Не розтягуйте фото через CSS і не використовуйте зображення низької якості.
- Для фонових зображень підготуйте окремі desktop/mobile файли та достатню
  роздільну здатність для `2x`.
- Контентні зображення повинні мати коректні `width`, `height`, `loading` та
  `alt`.
- SVG-іконки зберігайте в єдиному `src/img/icons.svg` як SVG sprite.

## Спільна основа: обов'язковий контракт

- Порядок стилів: modern-normalize → reset → base → container → секції.
- `.container` задає тільки горизонтальну сітку: max-width 375/768/1440px,
  бокові поля 20/32/64px. Нижче 375px він fluid, мінімальний viewport — 320px.
  Вертикальний padding у контейнер не додавати.
- `.section` визначено один раз у base.css: базові вертикальні поля 64px, від
  1440px — 92px. Це стартові значення; секція повинна перевизначити
  `--section-padding-block` за своїм макетом. Hero/Header/Footer не зобов'язані
  використовувати `.section`. Не копіювати це правило у CSS інших секцій.
- Fonts/colors/radii беріть із `:root`. Form controls успадковують font/color.
  Заголовки мають Cormorant, але розмір кожної секції задається за Figma.
- Базові keyboard focus, disabled cursor, link hover і reduced-motion вже
  задані. Точні button/input/invalid/pending states додавайте за UI Kit у
  відповідних компонентах, не видаляючи видимий focus.
- `.visually-hidden` використовуйте для тексту, доступного screen readers.
- Усі `src`, `srcset`, SVG `use href` у partial вказуються від src/index.html:
  `./img/...`. `../img/...` ламає production GitHub Pages.
- Логотип-посилання: `<a>` охоплює SVG; не додавайте порожнє `<a>` всередині
  SVG. Іконка в кнопці декоративна (`aria-hidden`), кнопка має доступну назву.
- Один h1 належить Hero. Секції мають h2 та погоджені id: `home` (body),
  `about`, `benefits`, `feedbacks`, `portfolio`, `faq`, `contacts`. Додаючи
  секцію, одночасно замініть її тимчасові `href="#"` у навігації.
- Success Modal має одну реалізацію в `src/js/success-modal.js`; контракт із
  Contacts описаний у `docs/success-modal.md`. Не відкривати її до response.ok.
- HTML-only PR явно позначайте як етап. Порожні списки/кнопки без JS не є
  завершеною секцією; додавайте перелік наступних задач до опису PR.

## Локальні перевірки та CI

```bash
npm ci
npx playwright install chromium
npm run check
```

`check` перевіряє Prettier, production build та браузерні сценарії. За потреби
окремо запускайте `npm run format:check`, `npm run build`, `npm test`. Для
точкового форматування: `npx prettier --write path/to/changed-file`.
`npm run format` форматує весь підтримуваний набір; не запускайте його в
секційному PR, якщо це створює нерелевантний diff. Експортований sprite та
існуюча сторінка icons-test.html виключені з форматування.

CI запускається на pull_request і push у main. Deploy виконується лише для main
після успішних перевірок. Обов'язковий status check у branch protection власник
репозиторію налаштовує окремо; workflow сам не забороняє merge.

Browser tests перевіряють спільну сітку, типографіку controls, Success Modal,
focus/scroll, retina assets та production paths. Це не заміна перевірці Figma
або тестам Contacts/Portfolio, які додаються разом із відповідною логікою.
