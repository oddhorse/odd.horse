/* background — isolated ES‑module extracted from background.njk
 * Keeps behavior identical to the inline `{% js %}` block but as
 * an external module so the code is easier to edit and indexed by IDEs.
 */

const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

(() => {
	// Canvas utilities for handling DPI correctly
	let dpr = 1;

	// Helper functions for coordinate conversion
	const canvasUtils = {
		// Convert mouse/screen coordinates to canvas coordinates
		screenToCanvas: (screenX, screenY) => ({ x: screenX, y: screenY }),
		// Get actual canvas dimensions in CSS pixels
		getCanvasSize: () => ({ width: window.innerWidth, height: window.innerHeight }),
		// Get device pixel ratio
		getDPR: () => dpr
	};

	// Set up canvas sizing with proper pixel ratio
	function resizeCanvas() {
		const rect = canvas.getBoundingClientRect();
		dpr = window.devicePixelRatio || 1;

		// Set the internal size to the display size times device pixel ratio
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;

		// Scale the context back down using CSS pixels
		ctx.scale(dpr, dpr);

		// Ensure crisp rendering
		ctx.imageSmoothingEnabled = false;
	}

	const horsedata = {
		0: {
			name: "Thunder Hooves",
			img: "/assets/images/bg/horse-1-",
			frm: "idle",
			images: {}, // Store loaded images
			posx: 0,
			posy: 0,
			facing: 1,
			size: 100, // Horse size in pixels
			mvdat: {
				walking: false,
				tarx: 0,
				tary: 0,
				bobval: 0,
				bobvec: 0.075,
				speedmult: 0.9,
				stepsize: 0.2
			}
		},
		1: {
			name: "Celestial Mane",
			img: "/assets/images/bg/horse-1-",
			frm: "idle",
			images: {},
			posx: 0,
			posy: 0,
			facing: 1,
			size: 100,
			mvdat: {
				walking: false,
				tarx: 0,
				tary: 0,
				bobval: 0,
				bobvec: 0.1,
				speedmult: 1,
				stepsize: 0.2
			}
		}
	};

	// Preload all horse images
	async function preloadImages() {
		const frames = ["idle", "walk1", "walk2"];
		const promises = [];

		for (const [id, horse] of Object.entries(horsedata)) {
			for (const frame of frames) {
				const img = new Image();
				const promise = new Promise((resolve, reject) => {
					img.onload = () => resolve();
					img.onerror = () => reject();
				});
				img.src = horse.img + frame + ".png";
				horse.images[frame] = img;
				promises.push(promise);
			}
		}

		return Promise.all(promises);
	}

	/* Wait for DOM to be fully loaded */
	document.addEventListener("DOMContentLoaded", async () => {
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		try {
			await preloadImages();
			canvas.style.opacity = 1;

			// Initialize horse positions (use CSS pixel coordinates)
			for (const [id, horse] of Object.entries(horsedata)) {
				horse.posx = getRandPos() * window.innerWidth / 100;
				horse.posy = getRandPos() * window.innerHeight / 100;
			}

			// Start animation loop
			requestAnimationFrame(onTick);
		} catch (error) {
			console.error("Failed to load horse images:", error);
		}
	});

	function getRandPos() {
		const min = -2;
		const max = 102;
		const diff = max - min;
		return Math.random() * diff + min;
	}

	function bobHorse(horse) {
		let workval = horse.mvdat.bobval + horse.mvdat.bobvec;
		if (workval >= 0.5 || workval <= 0)
			horse.mvdat.bobvec *= -1;

		if (workval <= 0) {
			if (horse.frm !== "walk1")
				horse.frm = "walk1";
			else if (horse.frm !== "walk2")
				horse.frm = "walk2";
		}

		horse.mvdat.bobval = workval;
	}

	function drawHorse(horse) {
		const img = horse.images[horse.frm];
		if (!img || !img.complete)
			return;

		ctx.save();

		// Calculate position with bob effect
		const x = horse.posx;
		const y = horse.posy + (horse.mvdat.bobval * horse.size * 0.1);

		// Handle facing direction
		if (horse.facing === -1) {
			ctx.scale(-1, 1);
			ctx.drawImage(img, -x - horse.size, y, horse.size, horse.size);
		} else {
			ctx.drawImage(img, x, y, horse.size, horse.size);
		}

		ctx.restore();
	}

	// Animation tick function
	function onTick() {
		// Clear canvas (use CSS pixel dimensions)
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

		// Update and draw each horse
		for (const [id, horse] of Object.entries(horsedata)) {
			// If horse is walking, move towards target
			if (horse.mvdat.walking) {
				// Calculate direction vector
				const dx = horse.mvdat.tarx - horse.posx;
				const dy = horse.mvdat.tary - horse.posy;

				// Set the horse facing direction based on movement
				if (dx < 0 && horse.facing !== -1)
					horse.facing = -1;
				else if (dx >= 0 && horse.facing !== 1)
					horse.facing = 1;

				// Calculate distance
				const distance = Math.sqrt(dx * dx + dy * dy);

				// If close enough to target, stop walking
				if (distance < 5) {
					horse.mvdat.walking = false;
					horse.mvdat.bobval = 0;
					if (horse.mvdat.bobvec < 0)
						horse.mvdat.bobvec *= -1;
					horse.frm = "idle";
				} else {
					// Move a small step toward target
					const step = horse.mvdat.stepsize * horse.mvdat.speedmult * 10; // Scale for pixel movement
					const ratio = step / distance;

					horse.posx += dx * ratio;
					horse.posy += dy * ratio;

					// update bob value
					bobHorse(horse);
				}

				// small chance to pick new location mid-walk
				if (Math.random() < 0.005) {
					horse.mvdat.tarx += (Math.random() * 80 - 40);
					horse.mvdat.tary += (Math.random() * 80 - 40);
				}
			} else if (Math.random() < 0.005) {
				// Small chance to start walking to a new location
				horse.mvdat.walking = true;
				horse.mvdat.tarx = getRandPos() * window.innerWidth / 100;
				horse.mvdat.tary = getRandPos() * window.innerHeight / 100;
				horse.mvdat.stepsize = Math.random() * 0.1 + 0.1;
			}

			// Draw the horse
			drawHorse(horse);
		}

		// Continue animation
		requestAnimationFrame(onTick);
	}

})();
