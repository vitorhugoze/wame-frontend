<script>
	import { onDestroy, onMount } from 'svelte';
	import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle.js';
	import SwaggerUIStandalonePreset from 'swagger-ui-dist/swagger-ui-standalone-preset.js';
	import 'swagger-ui-dist/swagger-ui.css';

	onMount(() => {
		SwaggerUIBundle({
			url: '/swagger-spec.yaml',
			dom_id: '#swagger-ui-container',
			presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
			layout: 'BaseLayout'
		});
	});
</script>

<div id="swagger-ui-container" class="pt-9"></div>
