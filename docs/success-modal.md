# Success Modal — інтеграція Contacts

Модуль `src/js/success-modal.js` підключений у `src/main.js`. Модалка прихована
за замовчуванням. Вона не підписана на submit і не робить API-запитів.

У модулі Contacts імпортуйте:

```js
import { openSuccessModal } from './success-modal.js';
```

В існуючому submit-обробнику збережіть валідацію, блокування повторної
відправки, loader та повідомлення про помилку. Викликайте модалку лише у гілці
успіху:

```js
// Фрагмент усередині async submit-обробника Contacts.
if (!form.reportValidity()) return;

try {
  const response = await fetch(
    'https://wedding-photographer.b.goit.study/api/orders',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) throw new Error(`Order failed: ${response.status}`);
  const order = await response.json();

  // Відновіть disabled-стан submit-кнопки перед відкриттям, щоб фокус
  // можна було повернути на неї після закриття.
  submitButton.disabled = false;
  submitButton.focus({ preventScroll: true });
  form.reset();
  openSuccessModal();
} catch (error) {
  // Покажіть помилку засобами Contacts; не відкривайте Success Modal.
} finally {
  // Приберіть loader та відновіть submit-кнопку.
}
```

`form`, `payload`, `submitButton` — змінні вашого обробника, а не глобальний API
модалки. При порожньому необов'язковому повідомленні не додавайте `message` у
payload. API: `name` (2–64 символи), `phone` (12 цифр), `message`
(необов'язково, 5–256). Документація:
https://wedding-photographer.b.goit.study/api-docs/#/Order/post_orders

`closeSuccessModal()` також експортується. Модуль сам обробляє close button,
click саме на backdrop, Escape, блокування прокручування та повернення фокусу.
Нативний dialog забезпечує модальність і keyboard focus containment. Не
додавайте власні дубльовані listeners або scroll-lock для цього вікна.

## Дизайн і межі перевірки

Файл Figma: `ihkIm7kefLMqWFVGTXAjmL`. Mobile: `8259:81207`; tablet:
`8259:80268`; desktop: `8252:78781`. Mobile/tablet отримані через
get_design_context зі screenshots. Desktop-геометрія отримана через metadata:
768px ширина, 64px padding, контент 640px. Окремий desktop design_context та UI
Kit hover/focus недоступні через ліміт Figma Starter. Desktop використовує
спільні підтверджені mobile/tablet стилі; hover/focus close-кнопки — доступний
fallback на поточних токенах проєкту. Ці стани та desktop потребують остаточного
порівняння після відновлення доступу.

На mobile ширина обмежена 335px (адаптив від 375px); до 375px вікно fluid.
Висота визначається контентом, а на низьких екранах прокручується dialog, щоб
текст і закриття залишалися доступними. Фото: 640×448 і 1280×896 JPG з
оригінального Figma asset; object-fit: cover у слотах 295×207 / 640×394.

## QA після інтеграції форми

- До відповіді сервера dialog закритий.
- Validation error, HTTP 400/500 і мережева помилка не відкривають dialog.
- Успішна відповідь відкриває dialog; фокус переходить на Close.
- Close, backdrop та Escape закривають; click контенту не закриває.
- Tab/Shift+Tab залишають фокус у dialog; після закриття він повертається.
- Скрол сторінки заблоковано під час відкриття й відновлено після закриття.
- Повторити відкриття/закриття; перевірити 320, 375, 768, 1440px і низький
  екран.

HTML Contacts підтягнуто з main; submit/API logic залишається відповідальністю автора Contacts за узгодженим обсягом робіт. Реальний
POST не виконувався; end-to-end flow треба перевірити після її інтеграції.

## Виконані перевірки компонента

Перевірено у headless Chrome через тимчасовий Playwright (без додавання
залежностей проєкту): 320×640, 375×787, 768×828, 1440×828, 375×400. Пройшли 15
циклів відкриття/закриття трьома способами, click усередині, Tab/Shift+Tab,
повернення фокусу, відновлення scroll-lock, збереження вже наявного lock,
негайне повторне відкриття, завантаження фото і шрифтів. JS/HTTP помилок не
виявлено. Mobile/tablet screenshots візуально порівняно з Figma. Висота в Chrome
659.78/700.39px замість округлених Figma 659/700px через дробовий line-height
1.2; фіксовану висоту не встановлено, щоб текст не обрізався.

`npm run build` і `git diff --check` пройшли. Prettier перевіряється лише для
файлів цього компонента. Safari/Firefox та реальна інтеграція Contacts ще не
перевірені. У foundation update додано modern-normalize та постійні Playwright-перевірки: npm run check.

Оновлення foundation: актуальний main інтегровано, конфлікт старої Success Modal розв’язано на користь єдиного dialog. Footer SVG paths виправлено для production.
