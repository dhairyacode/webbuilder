document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('modeToggle');
    const codeTab = document.getElementById('codeTab');
    const previewTab = document.getElementById('previewTab');
    const leftDirectory = document.getElementById('leftDirectory');
    const editorContainer = document.getElementById('editorContainer');
    const previewContainer = document.getElementById('previewContainer');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const previewFrame = document.getElementById('previewFrame');
    const resetBtn = document.getElementById('resetBuilder');

    const defaultFiles = {
        'files/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Example Site</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="hero-section">
<div class="hero-content">
<h1>EXAMPLE SITE HEADER</h1>
<p class="slogan">Slogan Here...</p>
<button id="explore-btn">EXPLORE MORE</button>
</div>
</header>
<script src="script.js"></script>
</body>
</html>`,

        'files/style.css': `*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:linear-gradient(135deg,#f5f7fa,#c3cfe2);color:#333;}
.hero-section{display:flex;justify-content:center;align-items:center;text-align:center;padding:2rem;}
.hero-content h1{font-size:3rem;font-weight:700;margin-bottom:1rem;color:#1e1e2f;}
.hero-content .slogan{font-size:1.5rem;margin-bottom:2rem;color:#555;}
#explore-btn{padding:1rem 2rem;font-size:1rem;font-weight:600;background:#6c63ff;color:#fff;border:none;border-radius:50px;cursor:pointer;transition:all 0.3s ease;}
#explore-btn:hover{background:#5750d9;transform:translateY(-3px);box-shadow:0 8px 20px rgba(0,0,0,0.2);}`,

        'files/script.js': `document.getElementById('explore-btn').addEventListener('click',()=>{alert("You clicked Explore More!");});`
    };

    const storedFiles = JSON.parse(localStorage.getItem('webbuilderFiles') || '{}');
    const files = {...defaultFiles, ...storedFiles};

    let currentFile = null;

    const editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
        value: '',
        lineNumbers: true,
        mode: 'htmlmixed',
        theme: 'material',
        lineWrapping: true
    });

    fileNameDisplay.textContent = 'No File Selected';

    toggle.addEventListener('change', () => {
        const dark = toggle.checked;
        document.body.classList.toggle('dark-mode', dark);
        editor.setOption('theme', dark ? 'material' : 'default');
    });

    const fileItems = document.querySelectorAll('.directory-item.file');
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            if(currentFile) {
                files[currentFile] = editor.getValue();
                saveFiles();
            }
            currentFile = item.dataset.filename;
            fileNameDisplay.textContent = currentFile;

            let mode = 'htmlmixed';
            if(currentFile.endsWith('.css')) mode = 'css';
            else if(currentFile.endsWith('.js')) mode = 'javascript';
            editor.setOption('mode', mode);
            editor.setValue(files[currentFile] || '');

            if(previewTab.classList.contains('active')) updatePreview();
        });
    });

    codeTab.addEventListener('click', () => {
        codeTab.classList.add('active');
        previewTab.classList.remove('active');
        leftDirectory.style.visibility = 'visible';
        editorContainer.style.visibility = 'visible';
        previewContainer.style.visibility = 'hidden';
    });

    previewTab.addEventListener('click', () => {
        previewTab.classList.add('active');
        codeTab.classList.remove('active');
        leftDirectory.style.visibility = 'hidden';
        editorContainer.style.visibility = 'hidden';
        previewContainer.style.visibility = 'visible';
        updatePreview();
    });

    editor.on('change', () => {
        if(currentFile) {
            files[currentFile] = editor.getValue();
            saveFiles();
            if(previewTab.classList.contains('active')) updatePreview();
        }
    });

    function updatePreview() {
        const html = files['files/index.html'] || '';
        const css = files['files/style.css'] ? `<style>${files['files/style.css']}</style>` : '';
        const js = files['files/script.js'] ? `<script>${files['files/script.js']}</script>` : '';
        previewFrame.srcdoc = `${html.replace('</head>', css + '</head>').replace('</body>', js + '</body>')}`;
    }

    function saveFiles() {
        localStorage.setItem('webbuilderFiles', JSON.stringify(files));
    }

    resetBtn.addEventListener('click', () => {
        if(confirm("Reset WebBuilder to default files?")) {
            localStorage.removeItem('webbuilderFiles');
            location.reload();
        }
    });

    codeTab.click();
	
	const exportBtn = document.getElementById('exportButton');

exportBtn.addEventListener('click', async () => {
    const zip = new JSZip();

    // Save current editor content
    if(currentFile) files[currentFile] = editor.getValue();

    // Clone index.html
    let indexHTML = files['files/index.html'] || '';

    // Simple clickable watermark
    const watermark = `
<footer id="wb-footer" style="text-align:center;padding:1rem;">
    Made Using <a href="https://dhairyacode.github.io" target="_blank" 
    style="font-weight:bold;background:linear-gradient(90deg,red,orange,yellow,green,violet);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;text-decoration:none;">WebBuilder | Dhairyacode</a>
</footer>
`;

    // Inject footer only if not already present
    if(!indexHTML.includes('wb-footer')) {
        indexHTML = indexHTML.replace('</body>', `${watermark}\n</body>`);
    }

    // Add updated index.html to zip
    zip.file('index.html', indexHTML);

    // Add all other files
    for (let filename in files) {
        if(filename !== 'files/index.html') {
            const fileShort = filename.replace('files/', '');
            zip.file(fileShort, files[filename]);
        }
    }

    // Generate zip & download
    const content = await zip.generateAsync({type:"blob"});
    saveAs(content, "Export-Website.zip");
});


});