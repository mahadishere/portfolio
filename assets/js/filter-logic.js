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
			const matchesXR = filters.xr === 'all' || cardXR === filters.xr;
			const matchesDomain = filters.domain === 'all' || 
				cardDomains.includes(filters.domain) ||
				cardDomains.includes('none');
			const matchesType = filters.type === 'all' || 
				cardTypes.includes(filters.type) ||
				cardTypes.includes('none');
			const matchesGame = filters.game === 'all' || cardGame === filters.game;
			const matchesVirtualTour = filters.virtualTour === 'all' || cardVirtualTour === filters.virtualTour;
			const matchesVisualization3d = filters.visualization3d === 'all' || cardVisualization3d === filters.visualization3d;
			const matchesModelling3d = filters.modelling3d === 'all' || cardModelling3d === filters.modelling3d;
			const matchesAiMl = filters.aiMl === 'all' || cardAiMl === filters.aiMl;
			const matchesCv = filters.cv === 'all' || cardCv === filters.cv;
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

