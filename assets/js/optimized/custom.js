/**
 * Theme Management (Dark Mode)
 */
(function() {
	'use strict';

	function toggleTheme() {
		const currentTheme = document.documentElement.getAttribute('data-theme');
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
		updateThemeIcon(newTheme);
	}

	function updateThemeIcon(theme) {
		const button = document.querySelector('.theme-toggle');
		if (button) {
			button.textContent = theme === 'dark' ? '☀️' : '🌙';
		}
	}

	// Initialize theme
	const savedTheme = localStorage.getItem('theme') || 'light';
	document.documentElement.setAttribute('data-theme', savedTheme);
	updateThemeIcon(savedTheme);

	// Expose toggleTheme globally
	window.toggleTheme = toggleTheme;
})();

/**
 * Background Music Management
 */
(function() {
	'use strict';

	let musicPlaying = false;
	const audio = document.getElementById('background-music');
	const musicButton = document.querySelector('.music-toggle');

	if (!audio || !musicButton) return;

	function updateMusicIcon(playing) {
		musicButton.textContent = playing ? '🔊' : '🔇';
		musicButton.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
	}

	function toggleMusic() {
		if (musicPlaying) {
			audio.pause();
			musicPlaying = false;
			localStorage.setItem('musicPlaying', 'false');
			updateMusicIcon(false);
		} else {
			// Load audio source if not already loaded (lazy loading)
			if (audio.readyState === 0) {
				audio.load();
			}
			audio.play().then(() => {
				musicPlaying = true;
				localStorage.setItem('musicPlaying', 'true');
				updateMusicIcon(true);
			}).catch(e => {
				console.log('Error playing music:', e);
				musicPlaying = false;
				localStorage.setItem('musicPlaying', 'false');
				updateMusicIcon(false);
			});
		}
	}

	// Load saved music preference
	const savedMusicState = localStorage.getItem('musicPlaying');
	const shouldAutoPlay = savedMusicState === 'true' || savedMusicState === null; // null = first visit, try autoplay
	
	if (shouldAutoPlay) {
		// Lazy load audio only when user wants to play (don't load on page load)
		// Try to autoplay on first visit or if user previously had it playing
		const tryAutoPlay = () => {
			// Load audio source if not already loaded
			if (audio.readyState === 0) {
				audio.load();
			}
			audio.play().then(() => {
				musicPlaying = true;
				localStorage.setItem('musicPlaying', 'true');
				updateMusicIcon(true);
			}).catch(e => {
				// Autoplay blocked - user interaction required
				console.log('Music autoplay blocked. User interaction required to play music.');
				musicPlaying = false;
				if (savedMusicState === null) {
					// First visit - don't save preference yet
				} else {
					localStorage.setItem('musicPlaying', 'false');
				}
				updateMusicIcon(false);
				
				// Try to play on first user interaction
				const playMusicOnInteraction = () => {
					if (audio.paused && shouldAutoPlay) {
						if (audio.readyState === 0) {
							audio.load();
						}
						audio.play().then(() => {
							musicPlaying = true;
							localStorage.setItem('musicPlaying', 'true');
							updateMusicIcon(true);
						}).catch(e => console.log('Music play failed:', e));
					}
				};
				
				// Listen for first user interaction
				document.addEventListener('click', playMusicOnInteraction, { once: true });
				document.addEventListener('scroll', playMusicOnInteraction, { once: true });
				document.addEventListener('touchstart', playMusicOnInteraction, { once: true });
			});
		};
		
		// Only try autoplay after page is fully loaded (non-blocking)
		if (document.readyState === 'complete') {
			// Use requestIdleCallback to load audio when browser is idle
			if (window.requestIdleCallback) {
				window.requestIdleCallback(tryAutoPlay, { timeout: 3000 });
			} else {
				setTimeout(tryAutoPlay, 1000);
			}
		} else {
			window.addEventListener('load', () => {
				if (window.requestIdleCallback) {
					window.requestIdleCallback(tryAutoPlay, { timeout: 3000 });
				} else {
					setTimeout(tryAutoPlay, 1000);
				}
			});
		}
	} else if (savedMusicState === 'false') {
		// User explicitly turned it off
		musicPlaying = false;
		updateMusicIcon(false);
	}

	// Update icon when audio state changes
	audio.addEventListener('play', () => {
		musicPlaying = true;
		updateMusicIcon(true);
	});
	audio.addEventListener('pause', () => {
		musicPlaying = false;
		updateMusicIcon(false);
	});
	audio.addEventListener('ended', () => {
		musicPlaying = false;
		updateMusicIcon(false);
	});

	// Expose toggleMusic globally
	window.toggleMusic = toggleMusic;
})();

/**
 * Intro Video Forward/Reverse Loop Management
 */
(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		const videoForward = document.getElementById('intro-video-forward');
		const videoReverse = document.getElementById('intro-video-reverse');
		const posterImg = document.getElementById('intro-video-poster');
		
		if (!videoForward || !videoReverse) return;

		// Track video loading state
		let forwardVideoLoaded = false;
		let reverseVideoLoaded = false;
		
		// Function to load and start forward video
		function loadAndPlayForwardVideo() {
			if (!forwardVideoLoaded) {
				// Hide poster, show video
				if (posterImg) posterImg.style.display = 'none';
				videoForward.style.display = 'block';
				
				// Add source element only when we want to load the video
				const src = videoForward.getAttribute('data-src');
				if (src && !videoForward.querySelector('source')) {
					const source = document.createElement('source');
					source.src = src;
					source.type = 'video/mp4';
					videoForward.appendChild(source);
				}
				// Load video asynchronously (non-blocking)
				videoForward.load();
				forwardVideoLoaded = true;
				
				// Wait for video to be ready, then play
				videoForward.addEventListener('canplay', function playOnce() {
					// Play video asynchronously
					videoForward.play().catch(e => {
						console.log('Video autoplay blocked, will play on user interaction');
					});
					videoForward.removeEventListener('canplay', playOnce);
					
					// After first video is loaded, schedule second video load in idle time
					if (window.requestIdleCallback) {
						window.requestIdleCallback(function() {
							loadReverseVideo();
						}, { timeout: 1000 });
					} else {
						// Fallback: load after small delay
						setTimeout(function() {
							loadReverseVideo();
						}, 100);
					}
				}, { once: true });
			} else if (videoForward.paused) {
				videoForward.play().catch(e => console.log('Video play failed:', e));
			}
		}
		
		// Function to load reverse video (non-blocking)
		function loadReverseVideo() {
			if (!reverseVideoLoaded) {
				const src = videoReverse.getAttribute('data-src');
				if (src && !videoReverse.querySelector('source')) {
					const source = document.createElement('source');
					source.src = src;
					source.type = 'video/mp4';
					videoReverse.appendChild(source);
				}
				// Load video asynchronously (non-blocking)
				videoReverse.load();
				reverseVideoLoaded = true;
			}
		}
		
		// Wait for entire website to load before loading videos
		// This ensures all resources (images, CSS, JS) are loaded first
		// Use requestIdleCallback for non-blocking video loading when browser is idle
		function scheduleVideoLoad() {
			if (window.requestIdleCallback) {
				// Use browser's idle time for non-blocking loading
				window.requestIdleCallback(function() {
					if (!forwardVideoLoaded) {
						loadAndPlayForwardVideo();
					}
				}, { timeout: 2000 }); // Fallback after 2 seconds if browser never becomes idle
			} else {
				// Fallback for browsers without requestIdleCallback
				setTimeout(function() {
					if (!forwardVideoLoaded) {
						loadAndPlayForwardVideo();
					}
				}, 100);
			}
		}
		
		if (document.readyState === 'complete') {
			// Page already fully loaded, schedule video load in idle time
			scheduleVideoLoad();
		} else {
			// Wait for window.load event (fires when all resources are loaded)
			window.addEventListener('load', function() {
				// Schedule video loading in browser's idle time (non-blocking)
				scheduleVideoLoad();
			});
		}
		
		// When forward video is near the end, prepare reverse
		videoForward.addEventListener('timeupdate', function() {
			if (this.duration && this.currentTime >= this.duration - 0.5) {
				// Pre-start reverse video just before forward ends
				// (Reverse video should already be loaded after first video loaded)
				if (reverseVideoLoaded && videoReverse.paused) {
					videoReverse.currentTime = 0;
					videoReverse.play().catch(e => {});
				} else if (!reverseVideoLoaded) {
					// If somehow not loaded yet, load it now
					loadReverseVideo();
					// Wait for video to load first
					videoReverse.addEventListener('canplay', function playOnce() {
						if (videoReverse.paused) {
							videoReverse.currentTime = 0;
							videoReverse.play().catch(e => {});
						}
						videoReverse.removeEventListener('canplay', playOnce);
					}, { once: true });
				}
			}
		});
		
		// When reverse video is near the end, prepare forward
		videoReverse.addEventListener('timeupdate', function() {
			if (this.duration && this.currentTime >= this.duration - 0.5) {
				// Pre-start forward video just before reverse ends
				if (videoForward.paused) {
					videoForward.currentTime = 0;
					videoForward.play().catch(e => {});
				}
			}
		});
		
		// When forward video ends, switch to reverse
		videoForward.addEventListener('ended', function() {
			videoForward.style.display = 'none';
			videoReverse.style.display = 'block';
			if (posterImg) posterImg.style.display = 'none';
			// Reverse video should already be playing from timeupdate
			if (videoReverse.paused) {
				videoReverse.currentTime = 0;
				videoReverse.play().catch(e => console.log('Reverse video play failed:', e));
			}
		});
		
		// When reverse video ends, switch back to forward (creates loop)
		videoReverse.addEventListener('ended', function() {
			videoReverse.style.display = 'none';
			videoForward.style.display = 'block';
			if (posterImg) posterImg.style.display = 'none';
			// Forward video should already be playing from timeupdate
			if (videoForward.paused) {
				videoForward.currentTime = 0;
				videoForward.play().catch(e => console.log('Forward video play failed:', e));
			}
		});
		
		// Play video on any user interaction (click, scroll, etc.) - loads video if not loaded yet
		// But only if page is already loaded
		const playVideo = () => {
			// Only load video on interaction if page is fully loaded
			if (document.readyState === 'complete') {
				if (!forwardVideoLoaded) {
					loadAndPlayForwardVideo();
				} else if (videoForward.style.display !== 'none' && videoForward.paused) {
					videoForward.play().catch(e => console.log('Video play failed:', e));
				} else if (videoReverse.style.display !== 'none' && videoReverse.paused) {
					videoReverse.play().catch(e => console.log('Video play failed:', e));
				}
			}
		};
		
		// Listen for user interactions (loads video if page is loaded)
		document.addEventListener('click', playVideo, { once: true });
		document.addEventListener('scroll', playVideo, { once: true });
		document.addEventListener('touchstart', playVideo, { once: true });
	});
})();

/**
 * Main Width Toggle Based on Active Panel
 */
(function() {
	'use strict';

	function updateMainWidth() {
		const main = document.getElementById('main');
		if (!main) return;
		
		// Check hash first for immediate feedback
		const hash = window.location.hash || '';
		const isHomePanel = hash === '#home' || hash === '' || hash === '#';
		
		if (isHomePanel) {
			// Also verify the panel is actually visible
			const introPanel = main.querySelector('.panel.intro');
			if (introPanel) {
				main.classList.add('has-intro');
				return;
			}
		}
		
		// Check for active intro panel (not inactive and visible)
		const introPanel = main.querySelector('.panel.intro');
		const isIntroActive = introPanel && 
			!introPanel.classList.contains('inactive') && 
			introPanel.style.display !== 'none' &&
			introPanel.offsetParent !== null; // Check if actually visible
		
		if (isIntroActive) {
			main.classList.add('has-intro');
		} else {
			main.classList.remove('has-intro');
		}
	}

	// Listen for hash changes and panel switches
	window.addEventListener('hashchange', function() {
		// Immediate check based on hash
		updateMainWidth();
		// Also check after panel transition completes (main.js uses 250ms + 500ms delays)
		setTimeout(updateMainWidth, 100);
		setTimeout(updateMainWidth, 300);
		setTimeout(updateMainWidth, 800); // After full transition
	});
	
	// Use MutationObserver to watch for panel class and style changes
	document.addEventListener('DOMContentLoaded', function() {
		// Initial check
		setTimeout(updateMainWidth, 100);
		
		const main = document.getElementById('main');
		if (main) {
			const observer = new MutationObserver(function(mutations) {
				// Debounce rapid changes
				clearTimeout(observer.timeout);
				observer.timeout = setTimeout(function() {
					updateMainWidth();
				}, 50);
			});
			
			const panels = main.querySelectorAll('.panel');
			panels.forEach(function(panel) {
				// Watch for class changes
				observer.observe(panel, { 
					attributes: true, 
					attributeFilter: ['class'],
					attributeOldValue: false
				});
				// Watch for style/display changes
				observer.observe(panel, { 
					attributes: true, 
					attributeFilter: ['style'],
					attributeOldValue: false
				});
			});
		}
	});
})();

/**
 * Filter State Management
 * Manages internal filter state for project filtering
 */
(function() {
	'use strict';

	// Internal state to support filtering even if dropdowns are hidden
	const filterState = {
		xr: 'all',
		domain: 'all',
		type: 'all',
		game: 'all',
		virtualTour: 'all',
		visualization3d: 'all',
		modelling3d: 'all',
		aiMl: 'all',
		cv: 'all'
	};

	// Reset all filters
	function resetFilters() {
		Object.keys(filterState).forEach(key => {
			filterState[key] = 'all';
		});
	}

	// Get filter value
	function getFilter(key) {
		return filterState[key] || 'all';
	}

	// Set filter value
	function setFilter(key, value) {
		if (filterState.hasOwnProperty(key)) {
			filterState[key] = value || 'all';
		}
	}

	// Expose to global scope
	window.filterState = {
		get: getFilter,
		set: setFilter,
		reset: resetFilters,
		getAll: () => ({ ...filterState })
	};
})();

/**
 * Filter Logic - Card Matching
 * Contains the core filtering logic for project cards
 */
(function() {
	'use strict';

	window.filterLogic = {
		/**
		 * Check if a card matches all active filters
		 */
		matchesCard: function(card, filters) {
			// Get card data attributes
			const cardXR = card.getAttribute('data-xr') || 'none';
			const cardDomains = (card.getAttribute('data-domain') || 'none').split(',');
			const cardTypes = (card.getAttribute('data-type') || 'none').split(',');
			const cardGame = card.getAttribute('data-game') || 'none';
			const cardVirtualTour = card.getAttribute('data-virtual-tour') || 'none';
			const cardVisualization3d = card.getAttribute('data-3d-visualization') || 'none';
			const cardModelling3d = card.getAttribute('data-3d-modelling') || 'none';
			const cardAiMl = card.getAttribute('data-ai-ml') || 'none';
			const cardCv = card.getAttribute('data-cv') || 'none';
			const cardFeatured = (card.getAttribute('data-featured') || 'false') === 'true';
			const cardTags = card.getAttribute('data-tags') || '';
			const cardTitle = card.getAttribute('data-title') || '';
			const cardSummary = card.getAttribute('data-summary') || '';

			// Check filters
			// All project type filters check data-type array since projects can have multiple types
			// (e.g., a project can be both AR and Game, or MR and Virtual Tour, etc.)
			const matchesXR = filters.xr === 'all' || 
				cardTypes.includes(filters.xr) || 
				cardXR === filters.xr; // Fallback to data-xr for backwards compatibility
			const matchesDomain = filters.domain === 'all' || 
				cardDomains.includes(filters.domain) ||
				cardDomains.includes('none');
			const matchesType = filters.type === 'all' || 
				cardTypes.includes(filters.type) ||
				cardTypes.includes('none');
			// Check data-type array for all project type filters (Game, Virtual Tour, etc.)
			const matchesGame = filters.game === 'all' || 
				cardTypes.includes('Game') || 
				cardGame === 'Game';
			const matchesVirtualTour = filters.virtualTour === 'all' || 
				cardTypes.includes('Virtual Tour') || 
				cardVirtualTour === 'Virtual Tour';
			const matchesVisualization3d = filters.visualization3d === 'all' || 
				cardTypes.includes('3D Visualization') || 
				cardVisualization3d === '3D Visualization';
			const matchesModelling3d = filters.modelling3d === 'all' || 
				cardTypes.includes('3D Model') || 
				cardModelling3d === '3D Model';
			const matchesAiMl = filters.aiMl === 'all' || 
				cardTypes.includes('AI') || 
				cardAiMl === 'AI';
			const matchesCv = filters.cv === 'all' || 
				cardTypes.includes('CV') || 
				cardCv === 'CV';
			const matchesSearch = filters.search === '' || 
				cardTitle.includes(filters.search) ||
				cardSummary.includes(filters.search) ||
				cardTags.includes(filters.search);

			// Special rule: when no filters are active, show only featured projects
			const noActiveFilters = filters.noActiveFilters;
			const passesFeaturedRule = noActiveFilters ? cardFeatured : true;

			return matchesXR && matchesDomain && matchesType && matchesGame && 
				matchesVirtualTour && matchesVisualization3d && matchesModelling3d && 
				matchesAiMl && matchesCv && matchesSearch && passesFeaturedRule;
		}
	};
})();

/**
 * Multi-dimensional Project Filters and Search
 * Main orchestrator for project filtering functionality
 */
(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		const xrFilter = document.getElementById('filter-xr');
		const domainFilter = document.getElementById('filter-domain');
		const typeFilter = document.getElementById('filter-type');
		const searchBox = document.getElementById('project-search');
		const resetBtn = document.getElementById('reset-filters');
		const projectCards = document.querySelectorAll('.project-card');
		const resultsCount = document.getElementById('filter-results-count');
		const megaLinks = document.querySelectorAll('.mega-menu a[data-filter-kind]');
		const workToggle = document.querySelector('.nav-item-work > a');
		const workLink = document.querySelector('.nav-item-work > a.work-link');

		// Get current filter values from DOM or state
		function getFilterValues() {
			return {
				xr: xrFilter ? xrFilter.value : window.filterState.get('xr'),
				domain: domainFilter ? domainFilter.value : window.filterState.get('domain'),
				type: typeFilter ? typeFilter.value : window.filterState.get('type'),
				game: window.filterState.get('game'),
				virtualTour: window.filterState.get('virtualTour'),
				visualization3d: window.filterState.get('visualization3d'),
				modelling3d: window.filterState.get('modelling3d'),
				aiMl: window.filterState.get('aiMl'),
				cv: window.filterState.get('cv'),
				search: searchBox ? searchBox.value.toLowerCase() : ''
			};
		}

		// Multi-dimensional filtering function
		function applyFilters() {
			const filters = getFilterValues();
			const noActiveFilters = (filters.xr === 'all' && filters.domain === 'all' && 
				filters.type === 'all' && filters.game === 'all' && filters.virtualTour === 'all' && 
				filters.visualization3d === 'all' && filters.modelling3d === 'all' && 
				filters.aiMl === 'all' && filters.cv === 'all' && filters.search === '');

			filters.noActiveFilters = noActiveFilters;

			let visibleCount = 0;
			let totalCount = 0;

			projectCards.forEach(card => {
				totalCount++;
				if (window.filterLogic.matchesCard(card, filters)) {
					card.style.display = 'block';
					visibleCount++;
				} else {
					card.style.display = 'none';
				}
			});

			// Update results count
			if (resultsCount) {
				if (visibleCount === totalCount) {
					resultsCount.textContent = `Showing all ${totalCount} projects`;
				} else {
					resultsCount.textContent = `Showing ${visibleCount} of ${totalCount} projects`;
				}
			}
		}

		// Add event listeners to all filters
		if (xrFilter) xrFilter.addEventListener('change', applyFilters);
		if (domainFilter) domainFilter.addEventListener('change', applyFilters);
		if (typeFilter) typeFilter.addEventListener('change', applyFilters);
		if (searchBox) searchBox.addEventListener('input', applyFilters);
		if (resetBtn) {
			resetBtn.addEventListener('click', function() {
				if (xrFilter) xrFilter.value = 'all';
				if (domainFilter) domainFilter.value = 'all';
				if (typeFilter) typeFilter.value = 'all';
				if (searchBox) searchBox.value = '';
				window.filterState.reset();
				applyFilters();
			});
		}

		// Expose helper to set filters from anywhere (e.g., mega menu, deep links)
		function applyProjectFiltersFromObject(filters) {
			if (!filters) return;
			if (typeof filters.xr !== 'undefined') {
				if (xrFilter) xrFilter.value = filters.xr || 'all';
				window.filterState.set('xr', filters.xr || 'all');
			}
			if (typeof filters.domain !== 'undefined') {
				if (domainFilter) domainFilter.value = filters.domain || 'all';
				window.filterState.set('domain', filters.domain || 'all');
			}
			if (typeof filters.type !== 'undefined') {
				if (typeFilter) typeFilter.value = filters.type || 'all';
				window.filterState.set('type', filters.type || 'all');
			}
			if (typeof filters.game !== 'undefined') window.filterState.set('game', filters.game || 'all');
			if (typeof filters['virtual-tour'] !== 'undefined') window.filterState.set('virtualTour', filters['virtual-tour'] || 'all');
			if (typeof filters['3d-visualization'] !== 'undefined') window.filterState.set('visualization3d', filters['3d-visualization'] || 'all');
			if (typeof filters['3d-modelling'] !== 'undefined') window.filterState.set('modelling3d', filters['3d-modelling'] || 'all');
			if (typeof filters['ai-ml'] !== 'undefined') window.filterState.set('aiMl', filters['ai-ml'] || 'all');
			if (typeof filters.cv !== 'undefined') window.filterState.set('cv', filters.cv || 'all');
			if (searchBox && typeof filters.q !== 'undefined') searchBox.value = filters.q || '';
			applyFilters();
		}
		window.applyProjectFilters = applyProjectFiltersFromObject;

		// Mega menu link handling
		if (megaLinks && megaLinks.length) {
			megaLinks.forEach(link => {
				link.addEventListener('click', function(e) {
					e.preventDefault();
					const kind = this.getAttribute('data-filter-kind');
					const value = this.getAttribute('data-filter-value');
					const pending = {};
					if (kind === 'xr') pending.xr = value;
					if (kind === 'domain') pending.domain = value;
					if (kind === 'type') pending.type = value;
					if (kind === 'game') pending.game = value;
					if (kind === 'virtual-tour') pending['virtual-tour'] = value;
					if (kind === '3d-visualization') pending['3d-visualization'] = value;
					if (kind === '3d-modelling') pending['3d-modelling'] = value;
					if (kind === 'ai-ml') pending['ai-ml'] = value;
					if (kind === 'cv') pending.cv = value;
					// If we're already on #work, apply immediately; else store and navigate
					if (location.hash.indexOf('#work') === 0) {
						applyProjectFiltersFromObject({
							xr: pending.xr || 'all',
							domain: pending.domain || 'all',
							type: pending.type || 'all',
							game: pending.game || 'all',
							'virtual-tour': pending['virtual-tour'] || 'all',
							'3d-visualization': pending['3d-visualization'] || 'all',
							'3d-modelling': pending['3d-modelling'] || 'all',
							'ai-ml': pending['ai-ml'] || 'all',
							cv: pending.cv || 'all'
						});
						try { sessionStorage.removeItem('pendingFilters'); } catch (_) {}
					} else {
						try { sessionStorage.setItem('pendingFilters', JSON.stringify(pending)); } catch (_) {}
						location.hash = '#work';
					}
					if (workToggle) workToggle.setAttribute('aria-expanded', 'false');
				});
			});
		}

		// Toggle aria-expanded based on hover/focus state for a11y
		if (workToggle) {
			const workItem = workToggle.closest('.nav-item-work');
			if (workItem) {
				workItem.addEventListener('mouseenter', () => workToggle.setAttribute('aria-expanded', 'true'));
				workItem.addEventListener('mouseleave', () => workToggle.setAttribute('aria-expanded', 'false'));
				workItem.addEventListener('focusin', () => workToggle.setAttribute('aria-expanded', 'true'));
				workItem.addEventListener('focusout', () => workToggle.setAttribute('aria-expanded', 'false'));
			}
		}

		// Clicking Work clears filters and shows the Work panel with featured projects
		if (workLink) {
			workLink.addEventListener('click', function() {
				window.filterState.reset();
				if (xrFilter) xrFilter.value = 'all';
				if (domainFilter) domainFilter.value = 'all';
				if (typeFilter) typeFilter.value = 'all';
				if (searchBox) searchBox.value = '';
				try { sessionStorage.removeItem('pendingFilters'); } catch (_) {}
				setTimeout(() => {
					if (location.hash.indexOf('#work') !== 0) {
						location.hash = '#work';
					} else if (location.hash !== '#work') {
						history.replaceState(null, '', '#work');
					}
					applyFilters();
				}, 0);
			});
		}

		// Deep-linking: parse hash like #work?xr=AR&domain=Medical&type=Game&q=search
		function syncFiltersFromHash() {
			const hash = location.hash || '';
			if (!hash.includes('#work')) return;
			const qIndex = hash.indexOf('?');
			if (qIndex === -1) {
				// No query: apply pending filters if present, else default
				let pending = null;
				try { pending = JSON.parse(sessionStorage.getItem('pendingFilters') || 'null'); } catch (_) {}
				if (pending) {
					applyProjectFiltersFromObject({
						xr: pending.xr || 'all',
						domain: pending.domain || 'all',
						type: pending.type || 'all',
						game: pending.game || 'all',
						'virtual-tour': pending['virtual-tour'] || 'all',
						'3d-visualization': pending['3d-visualization'] || 'all',
						'3d-modelling': pending['3d-modelling'] || 'all',
						'ai-ml': pending['ai-ml'] || 'all',
						cv: pending.cv || 'all'
					});
					try { sessionStorage.removeItem('pendingFilters'); } catch (_) {}
				} else {
					applyFilters();
				}
				return;
			}
			const qs = hash.substring(qIndex + 1);
			const params = new URLSearchParams(qs);
			applyProjectFiltersFromObject({
				xr: params.get('xr') || 'all',
				domain: params.get('domain') || 'all',
				type: params.get('type') || 'all',
				game: params.get('game') || 'all',
				'virtual-tour': params.get('virtual-tour') || 'all',
				'3d-visualization': params.get('3d-visualization') || 'all',
				'3d-modelling': params.get('3d-modelling') || 'all',
				'ai-ml': params.get('ai-ml') || 'all',
				cv: params.get('cv') || 'all',
				q: params.get('q') || ''
			});
		}
		window.addEventListener('hashchange', syncFiltersFromHash);

		// Initial filter application (respect deep links)
		syncFiltersFromHash();
	});
})();
/**
 * Faux Scrollbar Sync for Mega Menu
 */
(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		const catScroller = document.querySelector('.mega-categories');
		const track = document.querySelector('.mega-scrollbar');
		const thumb = document.querySelector('.mega-scrollbar-thumb');

		if (!catScroller || !track || !thumb) return;

		function updateThumb() {
			const visible = catScroller.clientWidth;
			const total = catScroller.scrollWidth;
			const trackW = track.clientWidth;
			const ratio = Math.max(visible / total, 0.05);
			const thumbW = Math.max(trackW * ratio, 20);
			const maxLeft = trackW - thumbW;
			const scrollRatio = catScroller.scrollLeft / (total - visible || 1);
			const left = maxLeft * scrollRatio;
			thumb.style.width = `${thumbW}px`;
			thumb.style.transform = `translateX(${left}px)`;
		}

		let dragging = false;
		let dragStartX = 0;
		let dragStartLeft = 0;

		function onThumbDown(e) {
			dragging = true;
			dragStartX = e.clientX;
			const matrix = new DOMMatrix(getComputedStyle(thumb).transform);
			dragStartLeft = matrix.m41 || 0;
			e.preventDefault();
		}
		
		function onMove(e) {
			if (!dragging) return;
			const trackW = track.clientWidth;
			const thumbW = thumb.clientWidth;
			const maxLeft = trackW - thumbW;
			let left = Math.min(Math.max(dragStartLeft + (e.clientX - dragStartX), 0), maxLeft);
			thumb.style.transform = `translateX(${left}px)`;
			// Map thumb to scrollLeft
			const total = catScroller.scrollWidth;
			const visible = catScroller.clientWidth;
			const scrollMax = total - visible;
			catScroller.scrollLeft = (left / maxLeft) * scrollMax;
		}
		
		function onUp() { 
			dragging = false; 
		}

		function onTrackClick(e) {
			if (e.target === thumb) return; // handled by drag
			const rect = track.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const total = catScroller.scrollWidth;
			const visible = catScroller.clientWidth;
			const trackW = track.clientWidth;
			const targetRatio = clickX / trackW;
			catScroller.scrollLeft = targetRatio * (total - visible);
		}

		catScroller.addEventListener('scroll', updateThumb, { passive: true });
		window.addEventListener('resize', updateThumb);
		thumb.addEventListener('mousedown', onThumbDown);
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
		track.addEventListener('mousedown', onTrackClick);
		
		// Update when menu opens (hover)
		const workItem = document.querySelector('.nav-item-work');
		if (workItem) {
			workItem.addEventListener('mouseenter', updateThumb);
			workItem.addEventListener('focusin', updateThumb);
		}
		updateThumb();
	});
})();

