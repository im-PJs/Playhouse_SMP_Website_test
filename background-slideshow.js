// Playhouse SMP - Smart Background Slideshow
// Automatically discovers and validates all background images
// Filters out corrupted/missing images to prevent purple screens

$(document).ready(() => {
    console.log('🎬 Starting background slideshow initialization...');

    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    // Try loading images 1-87 (will auto-skip any that don't exist/are corrupted)
    const images = Array.from({ length: 87 }, (_, i) => `pics/background/${i + 1}.jpg`);
    shuffle(images);

    console.log(`📋 Scanning for valid background images...`);

    // Track loading states
    let loadedCount = 0;
    let failedImages = [];
    const loadStates = {};
    const validImages = [];

    // Pre-validate images to catch loading errors
    let validationPromises = images.map((imagePath) => {
        return new Promise((resolve) => {
            loadStates[imagePath] = 'loading';
            const img = new Image();
            const startTime = Date.now();

            img.onload = () => {
                const loadTime = Date.now() - startTime;
                loadedCount++;
                loadStates[imagePath] = 'loaded';
                validImages.push(imagePath);
                console.log(`✅ [${loadedCount}] Loaded in ${loadTime}ms: ${imagePath}`);
                resolve(true);
            };

            img.onerror = () => {
                const loadTime = Date.now() - startTime;
                failedImages.push(imagePath);
                loadStates[imagePath] = 'failed';
                // Silently skip - no need to log every missing image
                resolve(false);
            };

            img.src = imagePath;
        });
    });

    // Wait for all validations to complete, then start slideshow
    Promise.all(validationPromises).then(() => {
        console.log(`\n📊 ===== BACKGROUND IMAGES SUMMARY =====`);
        console.log(`   ✅ Successfully loaded: ${loadedCount} images`);
        if (failedImages.length > 0) {
            console.log(`   ⏭️  Skipped: ${failedImages.length} missing/corrupted images`);
        }
        console.log(`========================================\n`);

        // Start the slideshow with only valid images
        if (validImages.length > 0) {
            console.log(`🎬 Starting slideshow with ${validImages.length} images...`);

            $("body").backgroundSlideshow({
                transitionDuration: 3000,
                fixed: true,
                images: validImages
            });

            console.log('✅ Background slideshow started successfully!\n');
        } else {
            console.error('❌ No valid background images found!');
        }
    });
});
