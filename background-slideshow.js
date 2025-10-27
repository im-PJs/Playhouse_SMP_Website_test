// Playhouse SMP - Smart Background Slideshow with Progressive Loading
// Loads first 2 backgrounds immediately, then progressively loads the rest
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
    const allImages = Array.from({ length: 87 }, (_, i) => `pics/background/${i + 1}.jpg`);
    shuffle(allImages);

    console.log(`📋 Progressive loading strategy: Load first 2 backgrounds, then lazy-load remaining...`);

    // Split into priority (first 2) and remaining
    const priorityImages = allImages.slice(0, 2);
    const remainingImages = allImages.slice(2);

    const validImages = [];
    let totalLoaded = 0;
    let slideshowStarted = false;

    // Load an image and validate it
    const loadImage = (imagePath) => {
        return new Promise((resolve) => {
            const img = new Image();
            const startTime = Date.now();

            img.onload = () => {
                const loadTime = Date.now() - startTime;
                totalLoaded++;
                validImages.push(imagePath);
                console.log(`✅ [${totalLoaded}] Loaded in ${loadTime}ms: ${imagePath}`);
                resolve(true);
            };

            img.onerror = () => {
                console.log(`⏭️  Skipped (missing): ${imagePath}`);
                resolve(false);
            };

            img.src = imagePath;
        });
    };

    // PHASE 1: Load first 2 backgrounds immediately
    console.log(`⚡ Phase 1: Loading first 2 backgrounds for instant start...`);
    Promise.all(priorityImages.map(loadImage)).then(() => {
        if (validImages.length > 0) {
            console.log(`✅ Initial backgrounds ready! Starting slideshow with ${validImages.length} images...`);

            // Start slideshow immediately with available images
            $("body").backgroundSlideshow({
                transitionDuration: 3000,
                fixed: true,
                images: validImages
            });

            slideshowStarted = true;
            console.log('🎬 Slideshow started! Now loading remaining backgrounds...\n');

            // PHASE 2: Load remaining backgrounds progressively
            loadRemainingBackgrounds();
        } else {
            console.error('❌ No valid initial backgrounds found!');
        }
    });

    // Load remaining backgrounds in the background
    function loadRemainingBackgrounds() {
        console.log(`🔄 Phase 2: Loading ${remainingImages.length} remaining backgrounds progressively...`);

        // Load in batches of 5 to avoid overwhelming the browser
        const batchSize = 5;
        let currentBatch = 0;

        function loadNextBatch() {
            const start = currentBatch * batchSize;
            const end = Math.min(start + batchSize, remainingImages.length);
            const batch = remainingImages.slice(start, end);

            if (batch.length === 0) {
                console.log(`\n📊 ===== FINAL SUMMARY =====`);
                console.log(`   ✅ Total valid backgrounds: ${validImages.length}`);
                console.log(`   🎬 Slideshow running smoothly!`);
                console.log(`===========================\n`);
                return;
            }

            Promise.all(batch.map(loadImage)).then(() => {
                // Update slideshow with new images
                if (slideshowStarted && validImages.length > currentBatch * batchSize + 2) {
                    $("body").backgroundSlideshow({
                        transitionDuration: 3000,
                        fixed: true,
                        images: validImages
                    });
                }

                currentBatch++;
                // Continue loading next batch after a short delay
                setTimeout(loadNextBatch, 500);
            });
        }

        loadNextBatch();
    }
});
