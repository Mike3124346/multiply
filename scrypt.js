let problems = [];
let answers = [];
let currentIndex = 0;

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function stworz_przyklad(count) {
	count = Number(count) || 1;
	problems = [];
	for (let i = 0; i < count; i++) {
		const a = randInt(1, 10);
		const b = randInt(1, 10);
		problems.push({ a, b });
	}
	answers = new Array(problems.length).fill(null);
	currentIndex = 0;
	renderZadania();
	showProblem(0);
}

function renderZadania() {
	const container = document.getElementById('zadania');
	if (!container) return;
	container.innerHTML = '';
	if (problems.length === 0) return;
	const pytanie = document.createElement('div');
	pytanie.id = 'pytanie';
	pytanie.style.fontSize = '28px';

	// progress dots
	const progress = document.createElement('div');
	progress.id = 'progress';
	for (let i = 0; i < problems.length; i++) {
		const d = document.createElement('div');
		d.className = 'dot' + (i === currentIndex ? ' active' : '');
		d.dataset.index = i;
		d.title = `Przykład ${i + 1}`;
		d.onclick = () => showProblem(i);
		progress.appendChild(d);
	}

	const input = document.createElement('input');
	input.type = 'number';
	input.id = 'odpowiedz';
	input.style.fontSize = '18px';
	input.style.width = '120px';
	input.addEventListener('input', () => {
		answers[currentIndex] = input.value === '' ? null : input.value;
	});

	const nav = document.createElement('div');
	nav.style.marginTop = '10px';

	const prevBtn = document.createElement('button');
	prevBtn.id = 'prevBtn';
	prevBtn.textContent = '◀';
	prevBtn.onclick = () => navigate(-1);

	const info = document.createElement('span');
	info.id = 'info';
	info.style.margin = '0 12px';

	const nextBtn = document.createElement('button');
	nextBtn.id = 'nextBtn';
	nextBtn.textContent = '▶';
	nextBtn.onclick = () => navigate(1);

	const finishBtn = document.createElement('button');
	finishBtn.id = 'finishBtn';
	finishBtn.textContent = 'Zakończ';
	finishBtn.style.marginLeft = '12px';
	finishBtn.onclick = finishQuiz;

	nav.appendChild(prevBtn);
	nav.appendChild(info);
	nav.appendChild(nextBtn);
	nav.appendChild(finishBtn);

	const resultsDiv = document.createElement('div');
	resultsDiv.id = 'wyniki';
	resultsDiv.style.marginTop = '12px';

	container.appendChild(progress);
	container.appendChild(pytanie);
	container.appendChild(input);
	container.appendChild(nav);
	container.appendChild(resultsDiv);
}

function showProblem(i) {
	if (i < 0 || i >= problems.length) return;
	const pytanie = document.getElementById('pytanie');
	const input = document.getElementById('odpowiedz');
	const info = document.getElementById('info');
	const prev = document.getElementById('prevBtn');
	const next = document.getElementById('nextBtn');
	if (!pytanie || !input || !info) return;

	currentIndex = i;
	const p = problems[i];
	pytanie.textContent = `${p.a} × ${p.b} =`;
	input.value = answers[i] === null ? '' : answers[i];
	input.focus();
	info.textContent = `${i + 1} / ${problems.length}`;
	prev.disabled = i === 0;
	next.disabled = i === problems.length - 1;

	// update progress dots
	const dots = document.querySelectorAll('#progress .dot');
	dots.forEach(d => d.classList.remove('active'));
	const active = document.querySelector(`#progress .dot[data-index='${i}']`);
	if (active) active.classList.add('active');
}

function navigate(dir) {
	const input = document.getElementById('odpowiedz');
	if (input) answers[currentIndex] = input.value === '' ? null : input.value;
	let ni = currentIndex + dir;
	if (ni < 0) ni = 0;
	if (ni >= problems.length) ni = problems.length - 1;
	showProblem(ni);
}

function finishQuiz() {
	const input = document.getElementById('odpowiedz');
	if (input) answers[currentIndex] = input.value === '' ? null : input.value;
	const emptyIndex = answers.findIndex(a => a === null || a === '');
	if (emptyIndex !== -1) {
		const ok = confirm('Nie wypełniłeś wszystkich przykładów. Na pewno chcesz zakończyć?');
		if (!ok) {
			showProblem(emptyIndex);
			return;
		}
	}

	const resultsDiv = document.getElementById('wyniki');
	if (!resultsDiv) return;
	resultsDiv.innerHTML = '';
	let correct = 0;
	const list = document.createElement('ol');
	for (let i = 0; i < problems.length; i++) {
		const p = problems[i];
		const userRaw = answers[i] === null || answers[i] === '' ? '—' : answers[i];
		const right = p.a * p.b;
		const li = document.createElement('li');
		li.innerHTML = `${p.a} × ${p.b} = ${right} — Twoja odpowiedź: ${userRaw}`;
		if (Number(answers[i]) === right) {
			li.classList.add('correct');
			correct++;
		} else {
			li.classList.add('wrong');
		}
		list.appendChild(li);
	}
	resultsDiv.appendChild(list);
	const summary = document.createElement('div');
	summary.style.marginTop = '8px';
	summary.textContent = `Masz ${correct} dobrych, ${problems.length - correct} złych.`;
	resultsDiv.appendChild(summary);

	const inputEl = document.getElementById('odpowiedz');
	if (inputEl) inputEl.disabled = true;
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');
	const finishBtn = document.getElementById('finishBtn');
	if (prevBtn) prevBtn.disabled = true;
	if (nextBtn) nextBtn.disabled = true;
	if (finishBtn) finishBtn.disabled = true;
}

window.addEventListener('keydown', (e) => {
	if (problems.length === 0) return;
	if (e.key === 'ArrowLeft') navigate(-1);
	if (e.key === 'ArrowRight') navigate(1);
});