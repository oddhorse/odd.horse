/**
 * background.js
 * Canvas-based infinite scrolling grid with SVG icons
 *
 * Optimizations:
 * - 1x resolution (not retina) for performance
 * - 30fps frame limiting
 * - Pre-rendered icon textures
 * - Efficient tiling pattern
 *
 * Interactive hooks ready for:
 * - Click reactions
 * - Mouse trails
 * - Particle effects
 * - Dynamic behaviors
 */

const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d', {
	alpha: true,
	willReadFrequently: false
});

// Disable anti-aliasing for crisp rendering
ctx.imageSmoothingEnabled = false;

// Export controls for beta menu
window.backgroundControls = {
	direction: 'diagonal', // 'diagonal', 'horizontal', 'vertical', 'rotate'
	speed: 1.0,
	paused: false
};

// Export stats for beta menu
window.backgroundStats = {
	fps: 0,
	frameCount: 0,
	lastFpsUpdate: 0
};

(() => {
	// Cached dimensions
	let canvasWidth = 0;
	let canvasHeight = 0;

	// Frame rate limiting - 30fps
	const targetFPS = 30;
	const frameInterval = 1000 / targetFPS;
	let lastFrameTime = 0;

	// Grid configuration
	const iconSize = 120; // px
	let cols = 0;
	let rows = 0;

	// Pre-rendered icon textures
	const iconTextures = [];
	let texturesReady = false;

	/**
	 * SVG icon definitions
	 * These will be converted to canvas image data for fast rendering
	 * Adjust opacity value to make lighter (lower) or darker (higher)
	 */
	const iconOpacity = 0.08; // Lower = lighter, higher = darker (0.0 - 1.0)

	const iconSVGs = [
		// Horse silhouette (simplified)
		`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M20,80 L20,50 Q20,30 40,30 L50,30 L50,20 L60,30 L70,30 Q80,30 80,50 L80,80 L70,80 L70,50 L60,50 L60,80 L50,80 L50,50 L40,50 L40,80 Z"
				fill="currentColor" opacity="${iconOpacity}"/>
		</svg>`,
		// Star
		`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M50,10 L61,40 L92,40 L68,58 L78,88 L50,68 L22,88 L32,58 L8,40 L39,40 Z"
				fill="currentColor" opacity="${iconOpacity}"/>
		</svg>`,
		// Circle
		`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="3" opacity="${iconOpacity}"/>
		</svg>`,
		// Diamond
		`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M50,10 L90,50 L50,90 L10,50 Z"
				fill="currentColor" opacity="${iconOpacity}"/>
		</svg>`,
		// Triangle
		`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M50,15 L85,85 L15,85 Z"
				fill="currentColor" opacity="${iconOpacity}"/>
		</svg>`
	];

	/**
	 * Convert SVG string to canvas Image
	 * Uses page color for icon color
	 */
	async function svgToImage(svgString) {
		return new Promise((resolve, reject) => {
			// Get page color from CSS variable
			const pageColor = getComputedStyle(document.documentElement)
				.getPropertyValue('--page-color').trim() || '#ff00bb';

			// Replace currentColor with actual color
			const coloredSVG = svgString.replace(/currentColor/g, pageColor);

			// Create blob and object URL
			const blob = new Blob([coloredSVG], { type: 'image/svg+xml' });
			const url = URL.createObjectURL(blob);

			// Load as image
			const img = new Image();
			img.onload = () => {
				URL.revokeObjectURL(url);
				resolve(img);
			};
			img.onerror = reject;
			img.src = url;
		});
	}

	/**
	 * Pre-render all icons to canvas textures
	 * Much faster than rendering SVG data URLs every frame
	 */
	async function preRenderIcons() {
		const promises = iconSVGs.map(async (svg) => {
			const img = await svgToImage(svg);

			// Create offscreen canvas for this icon
			const offscreen = document.createElement('canvas');
			offscreen.width = iconSize;
			offscreen.height = iconSize;
			const offCtx = offscreen.getContext('2d');
			offCtx.imageSmoothingEnabled = false;

			// Draw SVG to offscreen canvas
			offCtx.drawImage(img, 0, 0, iconSize, iconSize);

			return offscreen;
		});

		iconTextures.push(...await Promise.all(promises));
		texturesReady = true;
	}

	/**
	 * Set up canvas sizing
	 * Uses 1x resolution for performance
	 */
	function resizeCanvas() {
		canvasWidth = window.innerWidth;
		canvasHeight = window.innerHeight;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		// Calculate grid dimensions
		cols = Math.ceil(canvasWidth / iconSize) + 2;
		rows = Math.ceil(canvasHeight / iconSize) + 2;

		ctx.imageSmoothingEnabled = false;
	}

	/**
	 * Generate icon pattern for consistent tiling
	 * Returns a 2D array of icon indices
	 */
	function generateIconPattern() {
		const pattern = [];
		for (let row = 0; row < rows; row++) {
			pattern[row] = [];
			for (let col = 0; col < cols; col++) {
				pattern[row][col] = Math.floor(Math.random() * iconTextures.length);
			}
		}
		return pattern;
	}

	// Store the icon pattern
	let iconPattern = [];

	/**
	 * Draw the icon grid at a given offset
	 * Uses pre-rendered textures for speed
	 */
	function drawGrid(offsetX, offsetY) {
		if (!texturesReady) return;

		// Calculate which grid cells are visible
		const startCol = Math.floor(offsetX / iconSize);
		const startRow = Math.floor(offsetY / iconSize);

		// Draw grid with wrapping
		for (let row = 0; row < rows + 1; row++) {
			for (let col = 0; col < cols + 1; col++) {
				const patternRow = (startRow + row) % rows;
				const patternCol = (startCol + col) % cols;
				const iconIndex = iconPattern[patternRow][patternCol];

				const x = col * iconSize - (offsetX % iconSize);
				const y = row * iconSize - (offsetY % iconSize);

				ctx.drawImage(iconTextures[iconIndex], x, y, iconSize, iconSize);
			}
		}
	}

	/**
	 * Main animation loop
	 * Throttled to 30fps with FPS tracking
	 */
	let animationId;
	let startTime = 0;

	function animate(currentTime) {
		// Throttle to target frame rate
		const elapsed = currentTime - lastFrameTime;
		if (elapsed < frameInterval) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		lastFrameTime = currentTime - (elapsed % frameInterval);

		// Calculate actual FPS for beta menu
		window.backgroundStats.frameCount++;
		if (currentTime - window.backgroundStats.lastFpsUpdate >= 1000) {
			window.backgroundStats.fps = window.backgroundStats.frameCount;
			window.backgroundStats.frameCount = 0;
			window.backgroundStats.lastFpsUpdate = currentTime;
		}

		if (window.backgroundControls.paused) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		// Clear canvas
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		// Calculate scroll offset based on direction
		const time = (currentTime - startTime) * window.backgroundControls.speed * 0.02;
		let offsetX = 0;
		let offsetY = 0;

		switch (window.backgroundControls.direction) {
			case 'diagonal':
				offsetX = time;
				offsetY = time;
				break;
			case 'horizontal':
				offsetX = time;
				offsetY = 0;
				break;
			case 'vertical':
				offsetX = 0;
				offsetY = time;
				break;
			case 'rotate':
				// For rotation, draw grid centered and rotate canvas
				const rotation = (time * 0.5) % 360;
				ctx.save();
				ctx.translate(canvasWidth / 2, canvasHeight / 2);
				ctx.rotate((rotation * Math.PI) / 180);
				ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
				drawGrid(0, 0);
				ctx.restore();
				animationId = requestAnimationFrame(animate);
				return;
		}

		// Draw the scrolling grid
		drawGrid(offsetX, offsetY);

		// Continue animation
		animationId = requestAnimationFrame(animate);
	}

	/**
	 * Initialize on DOM load
	 */
	document.addEventListener('DOMContentLoaded', async () => {
		resizeCanvas();

		try {
			// Pre-render all icon textures
			await preRenderIcons();

			// Generate icon pattern
			iconPattern = generateIconPattern();

			// Start animation
			startTime = performance.now();
			requestAnimationFrame(animate);

			// Fade in
			canvas.style.opacity = 1;
		} catch (error) {
			console.error('Failed to initialize background:', error);
		}

		// Handle window resize
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				cancelAnimationFrame(animationId);
				resizeCanvas();
				iconPattern = generateIconPattern();
				startTime = performance.now();
				requestAnimationFrame(animate);
			}, 250);
		});
	});

	/**
	 * Expose controls for beta menu
	 */
	window.backgroundControls.setDirection = (dir) => {
		if (['diagonal', 'horizontal', 'vertical', 'rotate'].includes(dir)) {
			window.backgroundControls.direction = dir;
		}
	};

	window.backgroundControls.setSpeed = (speed) => {
		window.backgroundControls.speed = Math.max(0, speed);
	};

	window.backgroundControls.togglePause = () => {
		window.backgroundControls.paused = !window.backgroundControls.paused;
		return window.backgroundControls.paused;
	};

	/**
	 * Interactive hooks for future features
	 * These can be extended for click reactions, particles, etc.
	 */
	window.backgroundInteractive = {
		// Click handler - ready for particle effects, ripples, etc.
		onClick: (x, y) => {
			console.log('Background clicked at:', x, y);
			// TODO: spawn particles, ripple effect, etc.
		},

		// Mouse move handler - ready for trails, proximity effects, etc.
		onMouseMove: (x, y) => {
			// TODO: mouse trail, icon reactions, etc.
		}
	};

	// Wire up event listeners (disabled by default, enable when implementing features)
	/*
	canvas.addEventListener('click', (e) => {
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		window.backgroundInteractive.onClick(x, y);
	});

	canvas.addEventListener('mousemove', (e) => {
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		window.backgroundInteractive.onMouseMove(x, y);
	});
	*/

})();
