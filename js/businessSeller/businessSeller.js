const API_BASE_URL =
    "https://ebay-fee-calculator-api.kamran-azmat926.workers.dev";

export async function initBusinessCategorySelectors() {
    const mainSelect = document.getElementById("businessCategory");
    const subGroup = document.getElementById("businessSubcategoryGroup");
    const subSelect = document.getElementById("businessSubcategory");

    if (!mainSelect || !subGroup || !subSelect) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);

        if (!response.ok) {
            throw new Error(`Category API returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.categories)) {
            throw new Error("Invalid category response.");
        }

        const categories = new Map(
            data.categories.map(category => [category.key, category])
        );

        function refreshSubcategories() {
            const selectedCategory = categories.get(mainSelect.value);
            const subcategories = selectedCategory?.subcategories || [];

            subSelect.replaceChildren(
                new Option("Use main-category rate", "")
            );

            if (subcategories.length === 0) {
                subGroup.classList.add("hidden");
                subSelect.disabled = true;
                subSelect.value = "";
                return;
            }

            subcategories.forEach(item => {
                const option = new Option(item.name, String(item.id));
                subSelect.appendChild(option);
            });

            subGroup.classList.remove("hidden");
            subSelect.disabled = false;
            subSelect.value = "";
        }

        mainSelect.addEventListener("change", refreshSubcategories);

        refreshSubcategories();

    } catch (error) {
        console.error("Unable to load business categories:", error);
        alert("Unable to load eBay categories. Please refresh the page.");
    }
}