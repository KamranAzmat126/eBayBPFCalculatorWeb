import { initBusinessCategorySelectors } from "./businessSeller/businessSeller.js";
import { loadHTML } from "./components/loadHTML.js";

const API_BASE_URL =
    "https://ebay-fee-calculator-api.kamran-azmat926.workers.dev";

// Send calculation inputs to the private Cloudflare API
async function calculateViaApi(endpoint, inputs) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(inputs)
    });

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error("Invalid response from calculation server.");
    }

    if (!response.ok || !data.success) {
        throw new Error(data.error || "Calculation failed.");
    }

    return data.result;
}

// Format currency
function money(value) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP"
    }).format(value);
}

// Load all HTML components
await Promise.all([
    loadHTML("headerContainer", "interface/header/header.html"),
    loadHTML("selectionContainer", "interface/selection/selectionContainer.html"),
    loadHTML("privateCalculatorContainer", "interface/private/privateSellerInputs.html"),
    loadHTML("resultsContainer", "interface/private/privateSellerResult.html"),
    loadHTML("businessCalculatorContainer", "interface/business/businessSellerInputs.html"),
    loadHTML("businessResultsContainer", "interface/business/businessSellerResult.html")
]);

// Load category names from the private API
await initBusinessCategorySelectors();

const businessForm = document.getElementById("businessCalculatorForm");
const form = document.getElementById("calculatorForm");

const resultsSection = document.getElementById("resultsSection");
const businessResultsContainer = document.getElementById("businessResultsContainer");
const businessResultsSection = document.getElementById("businessResultsSection");

// Switch between private and business sellers
export function selectSeller(type) {
    const isPrivate = type === "private";

    document.getElementById("privateTab")
        .classList.toggle("active", isPrivate);

    document.getElementById("businessTab")
        .classList.toggle("active", !isPrivate);

    document.getElementById("privateCalculatorContainer")
        .classList.toggle("hidden", !isPrivate);

    document.getElementById("businessCalculatorContainer")
        .classList.toggle("hidden", isPrivate);

    document.getElementById("resultsContainer")
        .classList.add("hidden");

    businessResultsContainer.classList.add("hidden");

    resultsSection?.classList.add("hidden");
    businessResultsSection?.classList.add("hidden");
}

window.selectSeller = selectSeller;


// PRIVATE SELLER CALCULATOR

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const targetPrice = Number(
        document.getElementById("targetPrice").value
    );

    const sourcePrice = Number(
        document.getElementById("sourcePrice").value
    );

    const adRate = Number(
        document.getElementById("adRate").value
    );

    try {
        const result = await calculateViaApi("/api/private", {
            targetPrice,
            sourcePrice,
            adRate
        });

        document.getElementById("resultTarget").textContent =
            money(result.targetPrice);

        document.getElementById("resultBpf").textContent =
            money(result.bpf);

        document.getElementById("resultListing").textContent =
            money(result.listingPrice);

        document.getElementById("resultAdFee").textContent =
            money(result.totalAdFee);

        document.getElementById("resultSource").textContent =
            money(result.sourcePrice);

        document.getElementById("resultProfit").textContent =
            money(result.profit);

        document.getElementById("resultMargin").textContent =
            "Profit margin: " + result.margin.toFixed(2) + "%";

        document.getElementById("profitBox").classList.toggle(
            "negative",
            result.profit < 0
        );

        resultsSection.classList.remove("hidden");

        document.getElementById("resultsContainer")
            .classList.remove("hidden");

        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        window.lastCalculation = result;

    } catch (error) {
        console.error("Private calculation error:", error);
        alert(error.message || "Unable to calculate. Please try again.");
    }
});


// BUSINESS SELLER CALCULATOR

businessForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    try {
        const result = await calculateViaApi("/api/business", {
            shop: document.getElementById("businessShop").value,
            vat: document.getElementById("businessVat").value,
            purchaseVat: document.getElementById("businessPurchaseVat").value,
            category: document.getElementById("businessCategory").value,
            subcategory: document.getElementById("businessSubcategory").value,
            sellingPrice: Number(
                document.getElementById("businessSellingPrice").value
            ),
            postage: Number(
                document.getElementById("businessPostage").value
            ),
            sourcePrice: Number(
                document.getElementById("businessSourcePrice").value
            ),
            adRate: Number(
                document.getElementById("businessAdRate").value
            )
        });

        document.getElementById("businessResultBuyerTotal").textContent =
            money(result.orderTotal);

        document.getElementById("businessResultNetSales").textContent =
            money(result.netSalesRevenue);

        document.getElementById("businessResultOutputVat").textContent =
            money(result.outputVat);

        document.getElementById("businessResultFVF").textContent =
            money(result.finalValueFee);

        document.getElementById("businessResultOrderFee").textContent =
            money(result.orderFee);

        document.getElementById("businessResultRegulatoryFee").textContent =
            money(result.regulatoryFee);

        document.getElementById("businessResultAdvertisingFee").textContent =
            money(result.advertisingFee);

        document.getElementById("businessResultEbayVat").textContent =
            money(result.ebayFeesVat);

        document.getElementById("businessResultTotalFees").textContent =
            money(result.totalEbayFees);

        document.getElementById("businessResultSource").textContent =
            money(result.sourcePrice);

        document.getElementById("businessResultInputVat").textContent =
            money(result.inputVat);

        document.getElementById("businessResultProfit").textContent =
            money(result.profit);

        document.getElementById("businessResultMargin").textContent =
            "Profit margin: " + result.margin.toFixed(2) + "%";

        document.getElementById("businessResultROI").textContent =
            "ROI: " + result.roi.toFixed(2) + "%";

        document.getElementById("businessResultVatPayable").textContent =
            money(result.estimatedVatPayable);

        document.getElementById("businessProfitBox").classList.toggle(
            "negative",
            result.profit < 0
        );

        businessResultsSection.classList.remove("hidden");
        businessResultsContainer.classList.remove("hidden");

        businessResultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        window.lastBusinessCalculation = result;

    } catch (error) {
        console.error("Business calculation error:", error);
        alert(error.message || "Unable to calculate. Please try again.");
    }
});


// RESET PRIVATE SELLER RESULTS

form.addEventListener("reset", function() {
    resultsSection.classList.add("hidden");
});

document.getElementById("newCalculationBtn")
    .addEventListener("click", function() {
        form.reset();
        resultsSection.classList.add("hidden");
        document.getElementById("targetPrice").focus();
    });


// COPY PRIVATE SELLER RESULTS

document.getElementById("copyBtn")
    .addEventListener("click", async function() {

        const result = window.lastCalculation;

        if (!result) {
            alert("Please calculate your profit first.");
            return;
        }

        const resultsText = [
            "eBay BPF Profit Calculator",
            "Target buyer price: " + money(result.targetPrice),
            "BPF: " + money(result.bpf),
            "Listing price: " + money(result.listingPrice),
            "Advertising fee: " + money(result.totalAdFee),
            "Source price: " + money(result.sourcePrice),
            "Profit: " + money(result.profit),
            "Profit margin: " + result.margin.toFixed(2) + "%"
        ].join("\n");

        try {
            await navigator.clipboard.writeText(resultsText);
            alert("Latest calculation results copied successfully!");
        } catch (error) {
            console.error("Copy failed:", error);
            alert("Unable to copy results. Please check browser permissions.");
        }
    });


// RESET BUSINESS SELLER RESULTS

businessForm.addEventListener("reset", function() {
    businessResultsSection.classList.add("hidden");
    businessResultsContainer.classList.add("hidden");
});

businessForm.addEventListener("input", function() {
    businessResultsSection.classList.add("hidden");
    businessResultsContainer.classList.add("hidden");
});