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

