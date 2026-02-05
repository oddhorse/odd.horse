/**
 * background.js
 * True infinite scrolling grid of SVG icons with dynamic direction control
 *
 * Uses a tiling approach: create one tile, duplicate it, scroll both together
 * When the first tile scrolls off screen, reset position for seamless loop
 */

// Export controls for beta menu
window.backgroundControls = {
	direction: 'diagonal', // 'diagonal', 'horizontal', 'vertical', 'rotate'
	speed: 1.0, // Speed multiplier
	paused: false
};

// Export stats for beta menu
window.backgroundStats = {
	fps: 60, // CSS animations run at display refresh rate
	frameCount: 0,
	lastFpsUpdate: 0
};

(() => {
	const background = document.getElementById('background');
	if (!background) return;

	// SVG icon definitions - simple geometric shapes on-brand for oddhorse
	const icons = [
		// Horse silhouette (simplified)
		`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M20,80 L20,50 Q20,30 40,30 L50,30 L50,20 L60,30 L70,30 Q80,30 80,50 L80,80 L70,80 L70,50 L60,50 L60,80 L50,80 L50,50 L40,50 L40,80 Z"
				fill="currentColor" opacity="0.15"/>
		</svg>`,
		// Star
		`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M50,10 L61,40 L92,40 L68,58 L78,88 L50,68 L22,88 L32,58 L8,40 L39,40 Z"
				fill="currentColor" opacity="0.15"/>
		</svg>`,
		// Circle
		`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="3" opacity="0.15"/>
		</svg>`,
		// Diamond
		`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M50,10 L90,50 L50,90 L10,50 Z"
				fill="currentColor" opacity="0.15"/>
		</svg>`,
		// Triangle
		`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d="M50,15 L85,85 L15,85 Z"
				fill="currentColor" opacity="0.15"/>
		</svg>`
	];

	// Grid configuration
	const iconSize = 120; // px
	const cols = Math.ceil(window.innerWidth / iconSize) + 2;
	const rows = Math.ceil(window.innerHeight / iconSize) + 2;

	// Store the icon pattern for consistency
	let iconPattern = [];

	/**
	 * Generate a consistent icon pattern
	 * This pattern will be reused to ensure seamless tiling
	 */
	function generateIconPattern() {
		iconPattern = [];
		const totalIcons = cols * rows;
		for (let i = 0; i < totalIcons; i++) {
			iconPattern.push(icons[Math.floor(Math.random() * icons.length)]);
		}
	}

	/**
	 * Create a single grid tile using the icon pattern
	 */
	function createGridTile(className) {
		const grid = document.createElement('div');
		grid.className = className;
		grid.style.cssText = `
			display: grid;
			grid-template-columns: repeat(${cols}, ${iconSize}px);
			grid-template-rows: repeat(${rows}, ${iconSize}px);
			position: absolute;
			top: 0;
			left: 0;
			will-change: transform;
		`;

		// Fill grid with icons using the consistent pattern
		for (let i = 0; i < iconPattern.length; i++) {
			const cell = document.createElement('div');
			cell.className = 'bg-icon';
			cell.style.cssText = `
				width: ${iconSize}px;
				height: ${iconSize}px;
				display: flex;
				align-items: center;
				justify-content: center;
			`;
			cell.innerHTML = iconPattern[i];
			grid.appendChild(cell);
		}

		return grid;
	}

	/**
	 * Create the tiled background (2 identical grids for seamless scrolling)
	 */
	function createBackground() {
		// Clear existing content
		background.innerHTML = '';

		// Generate consistent pattern
		generateIconPattern();

		// Create container for both grid tiles
		const container = document.createElement('div');
		container.className = 'bg-container';
		container.style.cssText = `
			position: absolute;
			inset: 0;
		`;

		// Create two identical grids
		const grid1 = createGridTile('bg-grid bg-grid-1');
		const grid2 = createGridTile('bg-grid bg-grid-2');

		container.appendChild(grid1);
		container.appendChild(grid2);
		background.appendChild(container);

		return { grid1, grid2 };
	}

	/**
	 * Animation loop - updates transforms and handles infinite scroll reset
	 */
	let animationId;
	let startTime = performance.now();
	const tileWidth = cols * iconSize;
	const tileHeight = rows * iconSize;

	function animate(currentTime) {
		if (window.backgroundControls.paused) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		const elapsed = (currentTime - startTime) * window.backgroundControls.speed * 0.02;
		const grids = background.querySelectorAll('.bg-grid');
		if (!grids.length) return;

		const [grid1, grid2] = grids;

		switch (window.backgroundControls.direction) {
			case 'diagonal': {
				// Calculate offset that wraps at tile size
				let offsetX = elapsed % tileWidth;
				let offsetY = elapsed % tileHeight;

				// Position first grid
				grid1.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;

				// Position second grid offset by tile size (creates seamless loop)
				grid2.style.transform = `translate(${tileWidth - offsetX}px, ${tileHeight - offsetY}px)`;
				break;
			}
			case 'horizontal': {
				let offsetX = elapsed % tileWidth;

				grid1.style.transform = `translate(${-offsetX}px, 0px)`;
				grid2.style.transform = `translate(${tileWidth - offsetX}px, 0px)`;
				break;
			}
			case 'vertical': {
				let offsetY = elapsed % tileHeight;

				grid1.style.transform = `translate(0px, ${-offsetY}px)`;
				grid2.style.transform = `translate(0px, ${tileHeight - offsetY}px)`;
				break;
			}
			case 'rotate': {
				// Rotation doesn't scroll infinitely, just rotates in place
				const rotation = (elapsed * 0.5) % 360;
				const centerX = window.innerWidth / 2;
				const centerY = window.innerHeight / 2;

				grid1.style.transform = `translate(${centerX - tileWidth/2}px, ${centerY - tileHeight/2}px) rotate(${rotation}deg)`;
				grid2.style.display = 'none'; // Hide second grid for rotation
				break;
			}
		}

		// Show grid2 for scrolling modes, hide for rotate
		if (window.backgroundControls.direction !== 'rotate') {
			grid2.style.display = 'grid';
		}

		animationId = requestAnimationFrame(animate);
	}

	/**
	 * Initialize on DOM load
	 */
	document.addEventListener('DOMContentLoaded', () => {
		createBackground();

		// Start animation
		requestAnimationFrame(animate);

		// Handle window resize
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				const currentTime = performance.now();
				cancelAnimationFrame(animationId);
				createBackground();
				startTime = currentTime;
				requestAnimationFrame(animate);
			}, 250);
		});

		// Fade in
		setTimeout(() => {
			background.style.opacity = 1;
		}, 100);
	});

	// Expose controls for debugging
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

})();
