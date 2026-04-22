const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

let selectedPrio = 'high';

// Priority button selection
document.querySelectorAll('.prio-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.prio-btn').forEach(b => b.className = 'prio-btn');
    btn.classList.add('active-' + btn.dataset.p);
    selectedPrio = btn.dataset.p;
  });
});

// Add button
addBtn.addEventListener('click', function() {
  const text = input.value.trim();
  if (text === '') return;

  addTask(text, false, selectedPrio);
  saveToStorage();
  input.value = '';
});

// Enter key se bhi add ho
input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addBtn.click();
});

function addTask(text, isDone, priority) {
  const li = document.createElement('li');
  if (isDone) li.classList.add('done');

  const badgeClass = { high: 'badge-high', med: 'badge-med', low: 'badge-low' };
  const badgeLabel = { high: 'High', med: 'Med', low: 'Low' };

  li.innerHTML = `
    <input type="checkbox" ${isDone ? 'checked' : ''} />
    <span>${text}</span>
    <span class="prio-badge ${badgeClass[priority]}">${badgeLabel[priority]}</span>
    <div class="action-btns">
      <button class="edit-btn" title="Edit">✎</button>
      <button class="delete-btn" title="Delete">✕</button>
    </div>
  `;

  // Checkbox
  li.querySelector('input[type="checkbox"]').addEventListener('change', function() {
    li.classList.toggle('done', this.checked);
    saveToStorage();
  });

  // Delete
  li.querySelector('.delete-btn').addEventListener('click', function() {
    li.remove();
    saveToStorage();
  });

  // Edit
  li.querySelector('.edit-btn').addEventListener('click', () => {
    const span = li.querySelector('span');
    const oldText = span.textContent;

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = oldText;
    editInput.className = 'edit-input';
    span.replaceWith(editInput);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'save-btn';
    editInput.after(saveBtn);

    // Action buttons chhupa do edit mode mein
    li.querySelector('.action-btns').style.opacity = '0';
    li.querySelector('.action-btns').style.pointerEvents = 'none';

    saveBtn.addEventListener('click', () => {
      const newText = editInput.value.trim();
      if (newText === '') return;

      const newSpan = document.createElement('span');
      newSpan.textContent = newText;
      editInput.replaceWith(newSpan);
      saveBtn.remove();

      // Action buttons wapas dikhao
      li.querySelector('.action-btns').style.opacity = '';
      li.querySelector('.action-btns').style.pointerEvents = '';

      saveToStorage();
    });

    editInput.focus();
  });

  taskList.appendChild(li);
}

function saveToStorage() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(function(li) {
    const span = li.querySelector('span');
    const badge = li.querySelector('.prio-badge');
    const prio = badge.classList.contains('badge-high') ? 'high'
               : badge.classList.contains('badge-med')  ? 'med' : 'low';

    tasks.push({
      text: span ? span.textContent : '',
      done: li.classList.contains('done'),
      priority: prio
    });
  });
  localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem('myTasks');
  if (!saved) return;

  JSON.parse(saved).forEach(function(task) {
    addTask(task.text, task.done, task.priority);
  });
}

loadTasks();