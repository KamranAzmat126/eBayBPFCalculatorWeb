
export async function loadHTML(containerId, filePath) {
    const container = document.getElementById(containerId);

    if (!container) {
        throw new Error(`Container not found: ${containerId}`);
    }

    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Could not load ${filePath}: ${response.status}`);
        }

        const html = await response.text();

        // Convert the component HTML into a document
        const parser = new DOMParser();
        const componentDocument = parser.parseFromString(html, "text/html");
        const componentUrl = new URL(filePath, document.baseURI);

        // Load the component's CSS files
        const stylesheets = componentDocument.querySelectorAll(
            'link[rel="stylesheet"]'
        );

        for (const stylesheet of stylesheets) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            const componentUrl = new URL(filePath, document.baseURI);
            link.href = new URL(
                stylesheet.getAttribute("href"),
                componentUrl
            ).href;

            document.head.appendChild(link);
        }

        // Correct image paths
        const images = componentDocument.querySelectorAll("img");

        images.forEach(image => {
            const src = image.getAttribute("src");

            if (src) {
                image.src = new URL(src, componentUrl).href;
            }
        });

        // Insert the component HTML
        container.innerHTML = componentDocument.body.innerHTML;

        console.log(`Component loaded: ${filePath}`);

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Unable to load this component.</p>";
    }
}
