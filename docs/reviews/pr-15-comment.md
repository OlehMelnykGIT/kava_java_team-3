Review Team Lead: перевірено `b862adc306b1c4c0b25be119966bb652256ab65f` відносно
`main de9b752`. Це HTML-каркас, як і заявлено в назві PR; відсутні CSS/API не
приписую цьому PR як нову регресію.

- **MINOR — `src/partials/portfolio.html:1`: немає `id="portfolio"`.** Секція не
  має цілі для навігації `#portfolio`. Додайте стабільний id і використайте його
  у Header/Footer, коли інтегруватимуться якірні посилання.
- **MAJOR для завершеної секції — `src/partials/portfolio.html:1`: немає
  спільного класу `section` або власного вертикального padding.** У production
  computed padding секції дорівнює `0px`; чинний `.container` забезпечує лише
  горизонтальні поля. Узгодьте зі спільним контрактом секцій: вертикальні
  відступи належать section, горизонтальні — container. Точні відступи Portfolio
  потрібно взяти з Figma; не копіюйте довільні значення.
- **SUGGESTION — `src/partials/portfolio.html:4`: зафіксуйте наступний етап.**
  Порожні списки допустимі як точки вставки динамічних даних, але зараз
  категорій/фото 0, а Show More без обробника. Позначте в описі PR, що це тільки
  HTML, і вкажіть наступні задачі CSS, API, pagination, loading/error/empty
  states. Не приймаймо цей каркас як готову Portfolio.

Перевірено: `npm run build` PASS; Prettier для зміненого partial PASS; Chrome
production build з base `/kava_java_team-3/` на 320/375/768/1024/1440px.
Семантичні section/h2/ul та `type="button"` коректні. Повного порівняння
Portfolio з Figma не виконано через вичерпаний MCP-ліміт, тому pixel-perfect
відповідність не підтверджую.

404 фото/спрайта й несправна Contacts у цій збірці походять із уже злитих PR
#13/#14; це окремі зауваження, не регресії #15.
