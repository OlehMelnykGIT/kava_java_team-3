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

Створіть Pull Request у `main`. Merge виконується після review та успішного `npm run build`.

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
- `src/css/reset.css`, `src/css/base.css`, `src/css/container.css`, `src/css/styles.css`.

## Зображення

- Для кожного контентного фото готуйте пару файлів: `name.jpg` і `name@2x.jpg`.
- Зберігайте всі фото безпосередньо у `src/img` у форматі JPG.
- Для Retina використовуйте `<picture>` або `srcset` з файлами `name.jpg` і `name@2x.jpg`.
- Не розтягуйте фото через CSS і не використовуйте зображення низької якості.
- Для фонових зображень підготуйте окремі desktop/mobile файли та достатню роздільну здатність для `2x`.
- Контентні зображення повинні мати коректні `width`, `height`, `loading` та `alt`.
- SVG-іконки зберігайте в єдиному `src/img/icons.svg` як SVG sprite.
