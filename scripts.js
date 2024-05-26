const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
        img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            drawImage();
            xInput.value = img.width;
            yInput.value = img.height;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});
let originalImageData;

let isDragging = false;
let startX, startY, offsetX = 0, offsetY = 0;

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.offsetX - offsetX;
    startY = e.offsetY - offsetY;
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        offsetX = e.offsetX - startX;
        offsetY = e.offsetY - startY;
        drawImage();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseout', () => {
    isDragging = false;
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(originalImageData, offsetX, offsetY);
}

function rotate90() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Criar uma nova matriz de pixels para a imagem rotacionada
    const newImageData = ctx.createImageData(height, width);
    const newData = newImageData.data;

    // Rotacionar a matriz de pixels
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const oldIndex = (y * width + x) * 4;
            const newIndex = ((x * height) + (height - y - 1)) * 4;

            newData[newIndex] = data[oldIndex];
            newData[newIndex + 1] = data[oldIndex + 1];
            newData[newIndex + 2] = data[oldIndex + 2];
            newData[newIndex + 3] = data[oldIndex + 3];
        }


        // Redimensionar o canvas e desenhar a nova imagem rotacionada
    }
    canvas.width = height;
    canvas.height = width;
    ctx.putImageData(newImageData, 0, 0);
    originalImageData = ctx.getImageData(0, 0, width, height);
}

function rotate180() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Criar uma nova matriz de pixels para a imagem rotacionada
    const newImageData = ctx.createImageData(width, height);
    const newData = newImageData.data;

    // Rotacionar a matriz de pixels em 180 graus
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const oldIndex = (y * width + x) * 4;
            const newIndex = ((height - y - 1) * width + (width - x - 1)) * 4;

            newData[newIndex] = data[oldIndex];
            newData[newIndex + 1] = data[oldIndex + 1];
            newData[newIndex + 2] = data[oldIndex + 2];
            newData[newIndex + 3] = data[oldIndex + 3];
        }
    }

    // Redesenhar a nova imagem rotacionada no canvas
    ctx.putImageData(newImageData, 0, 0);
    originalImageData = ctx.getImageData(0, 0, width, height);
}

let xInput = document.getElementById("x");
let yInput = document.getElementById("y");
let resizeBtn = document.getElementById("resizeBtn")

resizeBtn.addEventListener("click", resizeImg)

function resizeImg() {
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    const scaledWidth = xInput.value;
    const scaledHeight = yInput.value;

    // Obter os dados da imagem original
    const imageData = ctx.getImageData(0, 0, originalWidth, originalHeight);
    const data = imageData.data;

    // Criar uma nova matriz de pixels para a imagem redimensionada
    const newImageData = ctx.createImageData(scaledWidth, scaledHeight);
    const newData = newImageData.data;

    // Redimensionar a imagem diretamente manipulando a matriz de pixels
    for (let y = 0; y < scaledHeight; y++) {
        for (let x = 0; x < scaledWidth; x++) {
            const offsetX = Math.floor(x / scaledWidth * originalWidth);
            const offsetY = Math.floor(y / scaledHeight * originalHeight);

            const newIndex = (y * scaledWidth + x) * 4;
            const oldIndex = (offsetY * originalWidth + offsetX) * 4;

            newData[newIndex] = data[oldIndex];
            newData[newIndex + 1] = data[oldIndex + 1];
            newData[newIndex + 2] = data[oldIndex + 2];
            newData[newIndex + 3] = data[oldIndex + 3];
        }
    }

    // Redimensionar o canvas
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Desenhar a nova imagem redimensionada no canvas
    ctx.putImageData(newImageData, 0, 0);
    originalImageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);
}

function flipHorizontal() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const oldIndex = (y * canvas.width + x) * 4;
            const newIndex = (y * canvas.width + (canvas.width - 1 - x)) * 4;

            newData[newIndex] = data[oldIndex];
            newData[newIndex + 1] = data[oldIndex + 1];
            newData[newIndex + 2] = data[oldIndex + 2];
            newData[newIndex + 3] = data[oldIndex + 3];
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(new ImageData(newData, canvas.width, canvas.height), 0, 0);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function flipVertical() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const oldIndex = (y * canvas.width + x) * 4;
            const newIndex = ((canvas.height - 1 - y) * canvas.width + x) * 4;

            newData[newIndex] = data[oldIndex];
            newData[newIndex + 1] = data[oldIndex + 1];
            newData[newIndex + 2] = data[oldIndex + 2];
            newData[newIndex + 3] = data[oldIndex + 3];
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(new ImageData(newData, canvas.width, canvas.height), 0, 0);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

let isBlackAndWhite = false;

function blackNWhite(){
    if (!isBlackAndWhite) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;        // Red
            data[i + 1] = avg;    // Green
            data[i + 2] = avg;    // Blue
        }

        ctx.putImageData(imageData, 0, 0);
        isBlackAndWhite = true;
    } else {
        ctx.putImageData(originalImageData, 0, 0);
        isBlackAndWhite = false;
    }

}

function invertColors() {
    // brightnessInput.value = 0;
    // contrastInput.value = 0;
    // saturationInput.value = 0;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const brightnessInput = document.getElementById('brightness');
const contrastInput = document.getElementById('contrast');
const saturationInput = document.getElementById('saturation');

// Carregar a imagem e salvar seu estado original
upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

brightnessInput.addEventListener('input', applyFilters);
contrastInput.addEventListener('input', applyFilters);
saturationInput.addEventListener('input', applyFilters);

function applyFilters() {
    const brightnessValue = parseInt(brightnessInput.value);
    const contrastValue = parseInt(contrastInput.value);
    const saturationValue = parseInt(saturationInput.value);

    ctx.putImageData(originalImageData, 0, 0);
    adjustBrightness(brightnessValue);
    adjustContrast(contrastValue);
    adjustSaturation(saturationValue);
}

function adjustBrightness(adjustment) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] += adjustment; // Red
        data[i + 1] += adjustment; // Green
        data[i + 2] += adjustment; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
}

function adjustContrast(adjustment) {
    const factor = (259 * (adjustment + 255)) / (255 * (259 - adjustment));
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128; // Red
        data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green
        data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
}

function adjustSaturation(adjustment) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const lumR = 0.3086;
    const lumG = 0.6094;
    const lumB = 0.0820;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const gray = r * lumR + g * lumG + b * lumB;

        data[i] = -gray * adjustment + r * (1 + adjustment); // Red
        data[i + 1] = -gray * adjustment + g * (1 + adjustment); // Green
        data[i + 2] = -gray * adjustment + b * (1 + adjustment); // Blue
    }

    ctx.putImageData(imageData, 0, 0);
}

const saveBtn = document.getElementById("save");
saveBtn.addEventListener("click", save);

function save(){
        // Converte o conteúdo do canvas para uma URL de dados base64
        const dataURL = canvas.toDataURL('image/png');
        // Cria um link temporário
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = "img.png";
        // Dispara um clique no link para baixar a imagem
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
}

function resetImg(){
    canvas.width = img.width;
    canvas.height = img.height;
    contrastInput.value = 0
    brightnessInput.value = 0
    saturationInput.value = 0
    ctx.drawImage(img, 0, 0);
    xInput.value = img.width;
    yInput.value = img.height;
    originalImageData = ctx.getImageData(0, 0, img.width, img.height)
}

const restoreBtn = document.getElementById("restore");
restoreBtn.addEventListener("click", () => resetImg())
const rotate90Btn = document.getElementById("rotate90");
rotate90Btn.addEventListener("click", () => rotate90())
const rotate180Btn = document.getElementById("rotate180");
rotate180Btn.addEventListener("click", () =>rotate180())
const flipHBtn = document.getElementById("flipH");
flipHBtn.addEventListener("click", () => flipHorizontal())
const flipVBtn = document.getElementById("flipV");
flipVBtn.addEventListener("click", () => flipVertical())
const blackNwhiteBtn = document.getElementById("bNw");
blackNwhiteBtn.addEventListener("click", () => blackNWhite())
const invertColorsBtn = document.getElementById("invertColors");
invertColorsBtn.addEventListener("click", () => invertColors())


