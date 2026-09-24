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
- `src/js` — JavaScript-логіка (створюється за потреби);
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

## Контейнер і відступи секцій

- `.container` задає ширину та горизонтальні відступи: `20px` / `32px` / `64px`.
- Вертикальні відступи задає клас `.section` з `common.css`: `64px`, на desktop
  — `92px`.
- Не додавайте секції власний `padding` зверху/знизу, якщо він збігається з
  `.section`.

```html
<section class="section contacts" id="contacts">
  <div class="container">...</div>
</section>
```

## CSS-змінні

- Кольори, шрифти та анімації беріть зі змінних у `src/css/base.css` (`:root`).
- Не хардкодьте кольори: `var(--color-text)` замість `#000000`.
- Нову змінну додавайте в `base.css` тільки після погодження з тімлідом.
- Для hover/focus використовуйте спільну анімацію:
  `transition: color var(--transition);`

## Іконки

- Усі іконки — у спрайті `src/img/icons.svg`.
- Шлях рахується від `src/index.html`, тому завжди `./img/icons.svg#id`, а не
  `../img/...`.
- Колір іконки задається через CSS (`fill` або `color`), бо в спрайті
  `currentColor`.

```html
<svg class="contacts-icon" width="24" height="24" aria-hidden="true">
  <use href="./img/icons.svg#mail"></use>
</svg>
```

## Форматування

- Встановіть рекомендовані розширення VS Code (Prettier, EditorConfig) — VS Code
  запропонує їх сам.
- Перед комітом відформатуйте свої файли: `npm run format`.
- Кожен PR автоматично перевіряється збіркою (`npm run build`) у GitHub Actions.

## Спільні файли

Не видаляйте та не перейменовуйте без узгодження:

- `package.json` і `package-lock.json`;
- `vite.config.js`;
- `.editorconfig`, `.prettierrc.json`, `.gitattributes`;
- `.github/`;
- `src/index.html`, `src/main.js`;
- `src/css/reset.css`, `src/css/base.css`, `src/css/container.css`,
  `src/css/common.css`, `src/css/styles.css`;
- `src/img/icons.svg`.

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
