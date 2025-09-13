// Example code snippets
const examples = {
    'code-headings': `
<h1>Main Heading</h1>
<h2>Sub Heading</h2>
<h3>Smaller Heading</h3>
`.trim().split('\n'),

    'code-paragraph': `
<p>This is a paragraph.</p>
<p>HTML paragraphs are block-level elements.</p>
<a href="#">This is a link</a>
`.trim().split('\n'),

    'code-lists': `
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
<ol>
  <li>First</li>
  <li>Second</li>
</ol>
`.trim().split('\n'),

    'code-images': `
<img src="image.jpg" alt="Sample Image">
<img src="logo.png" alt="Logo">
`.trim().split('\n'),

    'code-tables': `
<table>
  <tr><th>Name</th><th>Age</th></tr>
  <tr><td>Alice</td><td>25</td></tr>
  <tr><td>Bob</td><td>30</td></tr>
</table>
`.trim().split('\n'),

    'code-forms': `
<form>
  <input type="text" placeholder="Name">
  <input type="email" placeholder="Email">
  <textarea placeholder="Message"></textarea>
  <button type="submit">Submit</button>
</form>
`.trim().split('\n'),
};

// Animate code line by line
for (const id in examples) {
    const container = document.getElementById(id);
    examples[id].forEach((line, index) => {
        const lineEl = document.createElement('span');
        lineEl.classList.add('line');
        lineEl.textContent = line;
        lineEl.style.animationDelay = `${index * 0.3}s`;
        container.appendChild(lineEl);
    });
}
