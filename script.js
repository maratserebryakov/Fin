// Данные переменных
const vars = {
  T: 10,      // часы
  R: 1500,   // руб/час
  O: 5000,  // накладные, руб.
  N: 20,    // налог, %
  K_margin: 1.2,     // маржа (20%)
  K_complex: 1.15,  // сложность (средняя)
  K_urgent: 1.0     // срочность (стандарт)
};

// Шаблон формулы в LaTeX
const latexFormula = `
P = \\left[ \\sum (T_i \\times R_i) + O \\right] \\times
(1 + N\\%) \\times K_{\\text{маржа}} \\times
K_{\\text{сложность}} \\times K_{\\text{срочность}}
`;

// Отрисовка формулы через MathJax
function renderFormula() {
  document.getElementById('formula').innerHTML = `
    \\[ ${latexFormula} \\]
  `;
  MathJax.typeset();
}

// Создание редакторов
function createEditors() {
  const editorsContainer = document.querySelector('.editors');

  // Редактор для ∑(Tᵢ×Rᵢ)+O
  editorsContainer.innerHTML += `
    <div class="editor" id="editor-sum">
      <label>Tᵢ (часы):
        <input type="number" id="input-T" value="${vars.T}" step="0.5" min="0">
      </label>
      <label>Rᵢ (руб/ч):
        <input type="number" id="input-R" value="${vars.R}" min="0">
      </label>
      <label>O (руб.):
        <input type="number" id="input-O" value="${vars.O}" min="0">
      </label>
    </div>
  `;

  // Редактор для N%
  editorsContainer.innerHTML += `
    <div class="editor" id="editor-N">
      <label>N (%):
        <input type="number" id="input-N" value="${vars.N}" min="0" max="100">
      </label>
    </div>
  `;

  // Редактор для K_маржа
  editorsContainer.innerHTML += `
    <div class="editor" id="editor-K_margin">
      <label>K<sub>маржа</sub>:
        <select id="select-K_margin">
          <option value="1.1" ${vars.K_margin === 1.1 ? 'selected' : ''}>10%</option>
          <option value="1.15" ${vars.K_margin === 1.15 ? 'selected' : ''}>15%</option>
          <option value="1.2" ${vars.K_margin === 1.2 ? 'selected' : ''}>20%</option>
          <option value="1.25" ${vars.K_margin === 1.25 ? 'selected' : ''}>25%</option>
        </select>
      </label>
    </div>
  `;

  // Редактор для K_сложность
  editorsContainer.innerHTML += `
    <div class="editor" id="editor-K_complex">
      <label>K<sub>сложность</sub>:
        <select id="select-K_complex">
          <option value="1.0" ${vars.K_complex === 1.0 ? 'selected' : ''}>Базовая</option>
          <option value="1.15" ${vars.K_complex === 1.15 ? 'selected' : ''}>Средняя</option>
          <option value="1.3" ${vars.K_complex === 1.3 ? 'selected' : ''}>Высокая</option>
        </select>
      </label>
    </div>
  `;

  // Редактор для K_срочность
  editorsContainer.innerHTML += `
    <div class="editor" id="editor-K_urgent">
      <label>K<sub>срочность</sub>:
        <select id="select-K_urgent">
          <option value="1.0" ${vars.K_urgent === 1.0 ? 'selected' : ''}>Стандарт</option>
          <option value="1.2" ${vars.K_urgent === 1.2 ? 'selected' : ''}>Срочно</option>
          <option value="1.4" ${vars.K_urgent === 1.4 ? 'selected' : ''}>Очень срочно</option>
        </select>
      </label>
    </div>
  `;
}

// Функция пересчёта
function calculate() {
  const sum = vars.T * vars.R + vars.O;
  const taxFactor = 1 + vars.N / 100;
  const total = sum * taxFactor * vars.K_margin * vars.K_complex * vars.K_urgent;
  document.getElementById('result').textContent = total.toFixed(0);
}

// Обработчики событий для полей ввода
function setupEventListeners() {
  // Числовые поля
  document.getElementById('input-T').addEventListener('input', e => {
    vars.T = parseFloat(e.target.value);
    calculate();
  });

  document.getElementById('input-R').addEventListener('input', e => {
    vars.R = parseFloat(e.target.value);
    calculate();
  });

  document.getElementById('input-O').addEventListener('input', e => {
    vars.O = parseFloat(e.target.value);
    calculate();
  });

  document.getElementById('input-N').addEventListener('input', e => {
    vars.N = parseFloat(e.target.value);
    calculate();
  });

  // Выпадающие списки
  document.getElementById('select-K_margin').addEventListener('change', e => {
    vars.K_margin = parseFloat(e.target.value);
    calculate();
  });

  document.getElementById('select-K_complex').addEventListener('change', e => {
    vars.K_complex = parseFloat(e.target.value);
    calculate();
  });

  document.getElementById('select-K_urgent').addEventListener('change', e => {
    vars.K_urgent = parseFloat(e.target.value);
    calculate();
  });
}

// Управление видимостью редакторов (по клику на "кнопки")
function setupEditorToggles() {
  const editorIds = ['sum', 'N', 'K_margin', 'K_complex', 'K_urgent'];
  
  editorIds.forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'toggle-btn';
    btn.textContent = `Настроить ${key}`;
    btn.style.margin = '5px';
    btn.style.padding = '8px 12px';
    btn.style.border = '1px solid #1e90ff';
    btn.style.backgroundColor = '#f0f8ff';
    btn.style.cursor = 'pointer';
    btn.style.borderRadius = '4px';

    btn.addEventListener('click', () => {
      const editor = document.getElementById(`editor-${key}`);
      // Скрываем все редакторы
      document.querySelectorAll('.editor').forEach(el => {
        el.style.display = 'none';
      });
      // Показываем нужный
      editor.style.display = 'block';
    });

    document.querySelector('.formula').appendChild(btn);
  });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  renderFormula();
  createEditors();
  setupEventListeners();
  setupEditorToggles();
  calculate(); // Первый расчёт
});