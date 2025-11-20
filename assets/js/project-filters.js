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
