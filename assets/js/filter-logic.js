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

