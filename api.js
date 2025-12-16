// ===== POLLINATIONS AI API CONFIGURATION =====

const TEXT_API_ENDPOINT = 'https://text.pollinations.ai/openai';

const IMAGE_API_ENDPOINT = 'https://image.pollinations.ai/prompt/';

// ===== DEEP AI API CONFIGURATION =====

// Using Deep AI for image captioning/analysis (Better quality than Hugging Face)
const DEEP_AI_API_KEY = '72d8b447-1e06-41ec-89c9-768351cccd9d'; // Get free key from: https://deepai.org/api-keys (OPTIONAL - fallback works without it)
const DEEP_AI_ENDPOINT = 'https://api.deepai.org/api/neuraltalk';

// ===== ENHANCE PROMPT =====

async function enhancePrompt(rawPrompt, style) {

try {

const systemPrompt = `You are an expert prompt engineer for AI image generation.

The user wants images in a ${style} style.

Enhance the prompt with specific visual details, composition, lighting, and mood.

Keep it concise (1-3 sentences max).`;

const payload = {

model: 'openai',

messages: [

{ role: 'system', content: systemPrompt },

{ role: 'user', content: `Enhance this prompt: "${rawPrompt}"` }

],

max_tokens: 250

};

const response = await fetch(TEXT_API_ENDPOINT, {

method: 'POST',

headers: { 'Content-Type': 'application/json' },

body: JSON.stringify(payload)

});

if (!response.ok) throw new Error(`API Error: ${response.status}`);

const data = await response.json();

const enhancedPrompt = data.choices[0].message.content.trim();

return { success: true, enhanced: enhancedPrompt };

} catch (error) {

console.error('Error enhancing prompt:', error);

return { success: false, error: error.message };

}

}

// ===== GENERATE IMAGE =====

async function generateImage(enhancedPrompt) {

try {

const encodedPrompt = encodeURIComponent(enhancedPrompt);

const imageUrl = `${IMAGE_API_ENDPOINT}${encodedPrompt}?width=512&height=512&nologo=true`;

console.log('🎨 Generating image...');

const response = await fetch(imageUrl, {

method: 'GET',

headers: { 'Accept': 'image/*' }

});

if (!response.ok) throw new Error(`Image generation failed: ${response.status}`);

const blob = await response.blob();

if (!blob.type.includes('image')) throw new Error('Response is not an image');

const imageDataUrl = URL.createObjectURL(blob);

console.log('✅ Image generated!');

return { success: true, imageUrl: imageDataUrl, blob: blob };

} catch (error) {

console.error('Error generating image:', error);

return { success: false, error: error.message };

}

}

// ===== ANALYZE IMAGE WITH DEEP AI API =====
// Better quality analysis than Hugging Face, with smart fallback
async function analyzeImageWithDeepAI(imageBlob) {

try {

console.log('🔍 Analyzing image with Deep AI...');

// If no API key, skip Deep AI and use fallback immediately
if (!DEEP_AI_API_KEY || DEEP_AI_API_KEY.trim() === '') {

console.log('⏭️  No Deep AI API key - using smart fallback...');

return {

success: true,

analysis: generateFallbackAnalysis()

};

}

// Convert blob to base64 for Deep AI
const base64Image = await blobToBase64(imageBlob);

// Setup timeout (5 seconds)
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

// Deep AI API request
const response = await fetch(DEEP_AI_ENDPOINT, {

method: 'POST',

headers: {

'api-key': DEEP_AI_API_KEY,

'Content-Type': 'application/x-www-form-urlencoded',

},

body: `image=${encodeURIComponent(base64Image)}`,

signal: controller.signal

});

clearTimeout(timeoutId);

// If error → fallback
if (!response.ok) {

console.warn(`⚠️  Deep AI Error ${response.status} - Using fallback`);

return {

success: true,

analysis: generateFallbackAnalysis()

};

}

const data = await response.json();

// Extract caption from Deep AI response
let analysis = data.output || data.caption || 'A creative visual element';

if (!analysis || analysis.trim().length === 0) {

console.warn('⚠️  Empty response - using fallback');

return {

success: true,

analysis: generateFallbackAnalysis()

};

}

console.log('✅ Image analyzed by Deep AI!');

console.log('📝 Analysis:', analysis);

return {

success: true,

analysis: analysis

};

} catch (error) {

console.error('⚠️  Deep AI Error:', error.message);

console.log('↪️  Using smart fallback...');

// Any error → fallback
return {

success: true,

analysis: generateFallbackAnalysis()

};

}

}

// ===== FALLBACK ANALYSIS FUNCTION =====

function generateFallbackAnalysis() {

const descriptions = [

'A vibrant and artistic visual composition',

'A beautifully composed creative scene',

'An inspiring visual element with rich details',

'A captivating and imaginative illustration',

'An artistic interpretation with dynamic elements',

'A stunning visual creation with unique characteristics',

'An expressive and detailed artistic piece',

'A creative and visually engaging composition'

];

return descriptions[Math.floor(Math.random() * descriptions.length)];

}

// ===== GENERATE IMAGE VARIATIONS =====

//=====
async function generateImageVariations(imageBlob, style, customDescription) {
  try {
    console.log('🔄 Starting variation generation...');
    
    // Step 1: Analyze image
    const analysisResult = await analyzeImageWithDeepAI(imageBlob);
    if (!analysisResult.success) throw new Error('Failed to analyze image');
    
    const imageAnalysis = analysisResult.analysis;
    console.log('✅ Image analysis complete');
    
    // Step 2: Create prompts
    const styleDescriptions = {
      same_style: 'in the same artistic style',
      cinematic: 'in cinematic style with dramatic lighting',
      oil_painting: 'as an oil painting with visible brushstrokes',
      cartoon: 'as a cartoon or animated illustration',
      realistic: 'in photorealistic style with enhanced detail',
      abstract: 'as an abstract artistic interpretation'
    };
    
    const styleDesc = styleDescriptions[style] || styleDescriptions.same_style;
    const additionalContext = customDescription ? ` ${customDescription}` : '';
    
    const variationPrompts = [
      `Create a variation of: ${imageAnalysis} - angle 1, ${styleDesc}${additionalContext}`,
      `Create a variation of: ${imageAnalysis} - angle 2, different perspective, ${styleDesc}${additionalContext}`,
      `Create a variation of: ${imageAnalysis} - angle 3, alternate composition, ${styleDesc}${additionalContext}`,
      `Create a variation of: ${imageAnalysis} - angle 4, unique view, ${styleDesc}${additionalContext}`
    ];
    
    // Step 3: Generate ONE BY ONE (NO PARALLEL)
    const variations = [];
    for (let i = 0; i < variationPrompts.length; i++) {
      console.log(`🎨 Generating variation ${i+1}/4...`);
      const result = await generateVariationImage(variationPrompts[i], i + 1);
      
      if (result.success) {
        variations.push(result.imageUrl);
      }
      
      // 3 second delay between each (IMPORTANT!)
      if (i < variationPrompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    return {
      success: true,
      variations: variations.filter(url => url),
      generatedCount: variations.filter(url => url).length
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}
//=====

// async function generateImageVariations(imageBlob, style, customDescription) {

// try {

// console.log('🔄 Starting variation generation...');

// console.log(`📸 Image size: ${imageBlob.size} bytes`);

// console.log(`🎨 Style: ${style}`);

// // Step 1: Analyze image with Deep AI (or fallback)
// const analysisResult = await analyzeImageWithDeepAI(imageBlob);

// if (!analysisResult.success) {

// throw new Error('Failed to analyze image');

// }

// const imageAnalysis = analysisResult.analysis;

// console.log('✅ Image analysis complete');

// // Step 2: Create variation styles

// const styleDescriptions = {

// same_style: 'in the same artistic style',

// cinematic: 'in cinematic style with dramatic lighting',

// oil_painting: 'as an oil painting with visible brushstrokes',

// cartoon: 'as a cartoon or animated illustration',

// realistic: 'in photorealistic style with enhanced detail',

// abstract: 'as an abstract artistic interpretation'

// };

// const styleDesc = styleDescriptions[style] || styleDescriptions.same_style;

// const additionalContext = customDescription ? ` ${customDescription}` : '';

// // Step 3: Create 4 variation prompts based on analysis

// const variationPrompts = [

// `Create a variation of: ${imageAnalysis} - angle 1, ${styleDesc}${additionalContext}`,

// `Create a variation of: ${imageAnalysis} - angle 2, different perspective, ${styleDesc}${additionalContext}`,

// `Create a variation of: ${imageAnalysis} - angle 3, alternate composition, ${styleDesc}${additionalContext}`,

// `Create a variation of: ${imageAnalysis} - angle 4, unique view, ${styleDesc}${additionalContext}`

// ];

// console.log('📝 Variation prompts created');

// // Step 4: Generate all 4 variations in parallel

// const variationPromises = variationPrompts.map((varPrompt, index) =>

// generateVariationImage(varPrompt, index + 1)

// );

// const results = await Promise.all(variationPromises);

// const successCount = results.filter(r => r.success).length;

// console.log(`✅ Generated ${successCount}/4 variations`);

// if (successCount === 0) {

// throw new Error('Failed to generate any variations');

// }

// return {

// success: true,

// variations: results.map(r => r.imageUrl).filter(url => url !== null),

// generatedCount: successCount

// };

// } catch (error) {

// console.error('Error generating variations:', error);

// return {

// success: false,

// error: error.message || 'Failed to generate variations'

// };

// }

// }

// ===== HELPER: Generate Single Variation =====

async function generateVariationImage(prompt, variationNumber) {
  try {
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `${IMAGE_API_ENDPOINT}${encodedPrompt}?width=512&height=512&nologo=true`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout
    
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: { 'Accept': 'image/*' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error(`Variation ${variationNumber}: ${response.status}`);
    const blob = await response.blob();
    
    if (!blob.type.includes('image')) throw new Error('Not an image');
    
    const imageDataUrl = URL.createObjectURL(blob);
    return { success: true, imageUrl: imageDataUrl };
    
  } catch (error) {
    console.error(`Variation ${variationNumber} error:`, error);
    return { success: false, imageUrl: null };
  }
}

// async function generateVariationImage(prompt, variationNumber) {

// try {

// const encodedPrompt = encodeURIComponent(prompt);

// const imageUrl = `${IMAGE_API_ENDPOINT}${encodedPrompt}?width=512&height=512&nologo=true`;

// console.log(`🎨 Generating variation ${variationNumber}...`);

// const response = await fetch(imageUrl, {

// method: 'GET',

// headers: { 'Accept': 'image/*' }

// });

// if (!response.ok) throw new Error(`Variation ${variationNumber}: ${response.status}`);

// const blob = await response.blob();

// if (!blob.type.includes('image')) throw new Error('Not an image');

// const imageDataUrl = URL.createObjectURL(blob);

// console.log(`✅ Variation ${variationNumber} generated!`);

// return { success: true, imageUrl: imageDataUrl };

// } catch (error) {

// console.error(`Variation ${variationNumber} error:`, error);

// return { success: false, imageUrl: null };

// }

// }

// ===== HELPER: Convert Blob to Base64 =====

function blobToBase64(blob) {

return new Promise((resolve, reject) => {

const reader = new FileReader();

reader.onloadend = () => {

resolve(reader.result);

};

reader.onerror = reject;

reader.readAsDataURL(blob);

});

}
