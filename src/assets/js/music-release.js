document.addEventListener('DOMContentLoaded', () => {
	const iframe = document.getElementById('release-link-frame')
	iframe.onload = () => {
		const iframeDocument =
			iframe.contentDocument || iframe.contentWindow.document
		const style = iframeDocument.createElement('style')
		style.innerHTML = `
            .page-background {
                /* Your styles here */
                display: none;
            }
        `
		iframeDocument.head.appendChild(style)
	}
})
