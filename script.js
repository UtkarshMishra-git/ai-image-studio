// ===== DOM ELEMENTS =====
const tabBtns = document.querySelectorAll('[data-tab]');
const tabContents = document.querySelectorAll('[data-tab-content]');

// Generate Images Tab
const promptInput = document.getElementById('promptInput');
const promptError = document.getElementById('promptError');
const styleSelect = document.getElementById('styleSelect');
const enhanceBtn = document.getElementById('enhanceBtn');
const cancelBtn = document.getElementById('cancelBtn');
const enhancedSection = document.getElementById('enhancedSection');
const enhancedPromptDisplay = document.getElementById('enhancedPromptDisplay');
const generateImageBtn = document.getElementById('generateImageBtn');
const cancelEnhancedBtn = document.getElementById('cancelEnhancedBtn');
const imageContainer = document.getElementById('imageContainer');
const generatedImage = document.getElementById('generatedImage');

// Generate Variations Tab
const imageUpload = document.getElementById('imageUpload');
const uploadPreview = document.getElementById('uploadPreview');
const uploadedImage = document.getElementById('uploadedImage');
const variationStyle = document.getElementById('variationStyle');
const variationPrompt = document.getElementById('variationPrompt');
const generateVariationsBtn = document.getElementById('generateVariationsBtn');
const cancelVariationsBtn = document.getElementById('cancelVariationsBtn');
const variationsSection = document.getElementById('variationsSection');
const variationsGrid = document.getElementById('variationsGrid');

// Global
const loadingSpinner = document.getElementById('loadingSpinner');
const loadingText = document.getElementById('loadingText');
const errorMessage = document.getElementById('errorMessage');

let currentEnhancedPrompt = '';
let currentImageBlob = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ AI Image Studio loaded!');
    setupTabNavigation();
});

// ===== TAB NAVIGATION =====
function setupTabNavigation() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    tabContents.forEach(tab => tab.classList.remove('active'));
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    document.querySelector(`[data-tab-content="${tabName}"]`)?.classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    
    hideError();
}

// ===== GENERATE IMAGES TAB =====
enhanceBtn?.addEventListener('click', async () => {
    const rawPrompt = promptInput.value.trim();
    const selectedStyle = styleSelect.value;

    if (!rawPrompt) {
        alert('Please enter a prompt');
        return;
    }

    showLoading(true, 'Enhancing your prompt...');
    const result = await enhancePrompt(rawPrompt, selectedStyle);
    showLoading(false);

    if (result.success) {
        currentEnhancedPrompt = result.enhanced;
        enhancedPromptDisplay.textContent = result.enhanced;
        enhancedSection.classList.remove('hidden');
        promptInput.value = '';
    } else {
        showError(result.error);
    }
});

cancelBtn?.addEventListener('click', () => {
    promptInput.value = '';
    enhancedSection.classList.add('hidden');
});

generateImageBtn?.addEventListener('click', async () => {
    showLoading(true, 'Generating image...');
    const result = await generateImage(currentEnhancedPrompt);
    showLoading(false);

    if (result.success) {
        generatedImage.src = result.imageUrl;
        imageContainer.classList.remove('hidden');
    } else {
        showError(result.error);
    }
});

cancelEnhancedBtn?.addEventListener('click', () => {
    enhancedSection.classList.add('hidden');
    imageContainer.classList.add('hidden');
});

// ===== GENERATE VARIATIONS TAB =====
imageUpload?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        hideError();
        
        const reader = new FileReader();
        reader.onload = (event) => {
            // Show the uploaded image preview
            uploadedImage.src = event.target.result;
            uploadPreview.classList.remove('hidden');
            
            // Store the blob for API call
            currentImageBlob = new Blob([event.target.result], { type: file.type });
            console.log('✅ Image ready for variations');
        };
        reader.readAsDataURL(file);
    }
});

generateVariationsBtn?.addEventListener('click', async () => {
    hideError();
    
    if (!currentImageBlob) {
        showError('❌ Please upload an image first');
        return;
    }

    const style = variationStyle.value;
    const customPrompt = variationPrompt.value.trim();

    console.log('🔄 Starting variation generation...');
    showLoading(true, 'Analyzing image and generating 4 variations... (1-2 minutes)');
    
    const result = await generateImageVariations(currentImageBlob, style, customPrompt);
    showLoading(false);

    if (result.success && result.variations.length > 0) {
        console.log('✅ Variations generated!');
        displayVariations(result.variations);
        variationsSection.classList.remove('hidden');
        variationsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error('❌ Generation failed:', result.error);
        showError(`❌ ${result.error}`);
    }
});

cancelVariationsBtn?.addEventListener('click', () => {
    console.log('🔄 Clearing variations...');
    imageUpload.value = '';
    uploadPreview.classList.add('hidden');
    uploadedImage.src = '';
    variationPrompt.value = '';
    variationsSection.classList.add('hidden');
    variationsGrid.innerHTML = '';
    currentImageBlob = null;
    hideError();
});

// ===== DISPLAY VARIATIONS =====
function displayVariations(imageUrls) {
    variationsGrid.innerHTML = '';
    imageUrls.forEach((url, index) => {
        const item = document.createElement('div');
        item.className = 'variation-item';
        item.innerHTML = `
            <img src="${url}" alt="Variation ${index + 1}" loading="lazy">
            <div class="variation-label">Variation ${index + 1}</div>
        `;
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            downloadImage(url, `variation-${index + 1}.png`);
        });
        variationsGrid.appendChild(item);
    });
    console.log(`✅ Displayed ${imageUrls.length} variations`);
}

function downloadImage(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`⬇️ Downloaded: ${filename}`);
}

// ===== UTILITIES =====
function showLoading(show, text = '') {
    if (show) {
        loadingSpinner.classList.remove('hidden');
        if (text) loadingText.textContent = text;
        document.querySelectorAll('.btn').forEach(btn => btn.disabled = true);
    } else {
        loadingSpinner.classList.add('hidden');
        document.querySelectorAll('.btn').forEach(btn => btn.disabled = false);
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
    errorMessage.classList.add('hidden');
}