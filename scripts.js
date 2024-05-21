const upload = document.getElementById('upload-img');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')
let originalImageData;

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            drawImage();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function drawImage() {
    ctx.drawImage(img, 0, 0);
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

function resizeImg() {
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    const scaledWidth = document.getElementById("width").value;
    const scaledHeight = document.getElementById("height").value;

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

const pixels = document.getElementById("pixelsMover").value

function moveUp() {
    const imageData = ctx.getImageData(0, pixels, canvas.width, canvas.height - 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height - 1);
}

function moveDown() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height - 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, pixels);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height - 1);
}

function moveLeft() {
    const imageData = ctx.getImageData(pixels, 0, canvas.width - 1, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height - 1);
}

function moveRight() {
    const imageData = ctx.getImageData(0, 0, canvas.width - 1, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, pixels, 0);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height - 1);
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
    brightnessInput.value = 0;
    contrastInput.value = 0;
    saturationInput.value = 0;
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

const brightnessInput = document.getElementById('brilho');
const contrastInput = document.getElementById('contraste');
const saturationInput = document.getElementById('saturacao');

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
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
}

