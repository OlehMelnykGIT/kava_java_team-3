Post-merge review Team Lead: перевірено зміни #13 (`4b324bd`) у поточному
`main de9b752` та production build з base `/kava_java_team-3/`.

- **BLOCKER — `src/partials/success-modal.html:2`: модалка видима відразу.**
  `backdrop is-open` не має правила приховування; CSS очікує
  `.modal-backdrop[hidden]`. Вікно відображається звичайним блоком до відправки
  форми. `src/main.js` не містить логіки закриття, тому кнопка/Escape/backdrop
  не працюють. Це порушує hidden-by-default та відкриття лише після успішного
  POST `/orders`. Team Lead уже підготував окрему реалізацію Success Modal; при
  інтеграції треба залишити одну узгоджену реалізацію, а не дві.
- **MAJOR — `src/partials/footer.html:9,51,63,75`,
  `src/partials/success-modal.html:6,13`: неправильні asset paths.** Partials
  вставляються у `src/index.html`; відносні URL розраховуються від готової
  сторінки. `../img/...` виходить за `/kava_java_team-3/`: у production
  підтверджено 404 для `/img/icons.svg` і `/img/success-content-image.jpg`.
  Використайте `./img/...`, як у Contacts, та перевірте зібрані assets.
- **MAJOR — `src/partials/success-modal.html:12`: некоректний `srcset`.** Немає
  коми між кандидатами, а 2x шлях також пропускає `img/`. Chrome відкидає srcset
  з `unknown descriptor`. Правильний формат:
  `./img/success-content-image.jpg 1x, ./img/success-content-image@2x.jpg 2x`.
- **MAJOR — `src/partials/footer.html:8–11`: лого не є робочим посиланням.**
  `<a>` порожнє та розташоване всередині SVG після `<use>`; browser bounding box
  посилання 0×0. Обгорніть SVG елементом
  `<a href="#home" aria-label="Maria Kovalenko — Home">` і погодьте існуючу ціль
  `#home`; декоративному SVG задайте `aria-hidden="true"`.
- **MAJOR для завершеного Footer — `src/partials/footer.html:5`: немає
  `.container`, а `src/css/footer.css` лишився заглушкою.** Footer не
  вирівнюється зі спільною сіткою, немає responsive layout. Додайте внутрішній
  контейнер і стилі за макетом у наступному етапі; HTML-каркас не дорівнює
  завершеній секції.
- **MINOR — `src/partials/footer.html:23–38`: усі href="#".** Визначте реальні
  якорі Home/About/Benefits/Portfolio/FAQ; заголовок Menu не повинен удавати
  навігаційне посилання без призначення.
- **MINOR — `src/partials/footer.html:57,69,81`: `rel="noopener-noreferrer"` —
  один невідомий токен.** Замініть на `rel="noopener noreferrer"`.

Build PASS не означає готовність: runtime-перевірка підтвердила 404, поламаний
srcset та видиму за замовчуванням модалку. Повна візуальна звірка Footer із
Figma поки не виконана через MCP-ліміт. Пропоную окремий follow-up fix; злитий
PR автоматично не переписував.
