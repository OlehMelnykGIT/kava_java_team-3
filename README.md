# Maria Kovalenko Photography

Командний навчальний frontend-проєкт GoIT: односторінковий сайт весільного
фотографа для презентації послуг, портфоліо та зв’язку з клієнтами.

## Посилання

- [Live page](https://olehmelnykgit.github.io/kava_java_team-3/)
- [Repository](https://github.com/OlehMelnykGIT/kava_java_team-3)
- [Figma](https://www.figma.com/design/ihkIm7kefLMqWFVGTXAjmL/?node-id=5999-10563)
- [API documentation](https://wedding-photographer.b.goit.study/api-docs/)
- [Правила командної роботи](./CONTRIBUTING.md)

## Поточний стан

Проєкт у розробці. HTML-заготовки секцій не означають завершену верстку за
Figma.

| Частина                                 | Стан                                                                                    |
| --------------------------------------- | --------------------------------------------------------------------------------------- |
| Спільна основа                          | Vite, normalize, шрифти, CSS-змінні, контейнер і підключення секцій                     |
| Header, About, Benefits, Feedbacks, FAQ | Базова HTML-структура; потрібні оформлення та інтерактивність                           |
| Hero, Portfolio, Contacts, Footer       | Часткова реалізація; потребують завершення та перевірки за макетом                      |
| Success Modal                           | Реалізовані адаптивність, Close/backdrop/Escape, блокування скролу та повернення фокусу |
| Інтеграція форми                        | Відкриття модалки після успішної відповіді API ще не підключене                         |
| API, Loader, Scroll Up                  | Інтеграція запланована                                                                  |

Планується завантаження відгуків і портфоліо з API, фільтрація фотографій,
`Show More`, FAQ-акордеон, мобільне меню та надсилання контактної форми.

## Технології

| Технологія              | Використання                         |
| ----------------------- | ------------------------------------ |
| HTML5, CSS3             | Семантична розмітка та Mobile First  |
| JavaScript ES modules   | Логіка компонентів                   |
| Vite                    | Локальний сервер і production-збірка |
| vite-plugin-html-inject | Підключення HTML partial-файлів      |
| modern-normalize        | Нормалізація стилів браузера         |
| SVG sprite              | Спільні іконки                       |
| Prettier                | Форматування                         |
| GitHub Actions / Pages  | Збірка й публікація                  |

Шрифти Cormorant і Mulish підключені через Google Fonts у `src/index.html`.
Swiper та Accordion JS наразі не встановлені. Вибір бібліотек для секцій
узгоджується командою перед додаванням залежностей.

## Адаптивність

Базові стилі — mobile, медіазапити — від `768px` та `1440px`.

| Контрольний viewport | Зовнішня ширина контейнера | Padding з кожного боку | Ширина контенту |
| -------------------- | -------------------------- | ---------------------- | --------------- |
| 375px                | 375px                      | 20px                   | 335px           |
| 768px                | 768px                      | 32px                   | 704px           |
| 1440px               | 1440px                     | 64px                   | 1312px          |

`.container` задає лише ширину й горизонтальні відступи. Вертикальні відступи
задаються у CSS відповідної секції. Перевіряємо також проміжні ширини й низькі
екрани.

## API

Базова адреса: `https://wedding-photographer.b.goit.study/api`. Усі наведені
шляхи додаються до цієї адреси.

| Метод | Шлях              | Призначення                                                  |
| ----- | ----------------- | ------------------------------------------------------------ |
| GET   | `/feedbacks`      | Відгуки, параметри `page` і `limit` (3–10)                   |
| GET   | `/categories`     | Категорії фотографій                                         |
| GET   | `/wedding-photos` | Фотографії, параметри `page`, `limit`, `categoryId`          |
| POST  | `/orders`         | Заявка: обов’язкові `name`, `phone`, необов’язкове `message` |

За документацією API: ім’я — 2–64 символи, телефон — 12 цифр, повідомлення, якщо
передається, — 5–256 символів. Кількість фотографій для початкового завантаження
та `Show More` визначається погодженим ТЗ, а не цим README.

Запланована інтеграція Contacts: валідація → loader → `POST /orders` → перевірка
успіху → очищення форми → `openSuccessModal()`. При помилці введені дані
зберігаються; loader та блокування повторного submit прибираються у `finally`.
За форму й API відповідає Contacts, модалка залишається окремим UI-компонентом.

## Структура

```text
src/
├── css/        # спільні стилі та стилі секцій
├── img/        # фото та icons.svg
├── js/         # JavaScript-модулі
├── partials/   # HTML секцій
├── public/     # статичні файли без перетворення Vite
├── index.html
└── main.js
```

`vite.config.js`, `package.json`, `package-lock.json` і `.github/workflows/`
розташовані в корені репозиторію. Окремої папки `src/js/api/` поки немає.

## Запуск

```bash
git clone https://github.com/OlehMelnykGIT/kava_java_team-3.git
cd kava_java_team-3
npm ci
npm run dev
```

Відкрийте адресу, яку покаже Vite. `npm ci` встановлює залежності з lock-файла;
для навмисного додавання залежностей використовуйте `npm install`.

## Production build

```bash
npm run build
npm run preview -- --base=/kava_java_team-3/
```

Результат збірки — `dist/`. Параметр `--base` у preview відповідає шляху GitHub
Pages у команді build. Публікацію з `main` виконує GitHub Actions.

## Перевірка Success Modal

Після `npm run dev` відкрийте DevTools → Console:

```js
const modal = await import('/js/success-modal.js');
modal.openSuccessModal();
```

Перевірте Close, backdrop, Escape, клік усередині, повторне відкриття та скрол.
Цей імпорт призначений для dev-сервера, а не production-сторінки GitHub Pages.

## Командна робота

Зміни вносяться через feature-гілки, Pull Request та review. Правила спільних
файлів, назви, форматування й чекліст перевірки — у
[CONTRIBUTING.md](./CONTRIBUTING.md). Розподіл ролей, дедлайни й додаткові
критерії курсу команда підтверджує окремо.
