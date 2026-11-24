import {
       calculateBusinessSeller,
       initBusinessCategorySelectors
   } from "./businessSeller/businessSeller.js";
import { calculatePrivateSeller } from "./privateSeller/privateSeller.js";
import { loadHTML } from "./components/loadHTML.js";

// Load all HTML components before initialising the calculator

await Promise.all([
    loadHTML("headerContainer", "interface/header/header.html"),
    loadHTML("selectionContainer", "interface/selection/selectionContainer.html"),
    loadHTML("privateCalculatorContainer", "interface/private/privateSellerInputs.html"),
    loadHTML("resultsContainer", "interface/private/privateSellerResult.html"),
    loadHTML("businessCalculatorContainer", "interface/business/businessSellerInputs.html"),
    loadHTML("businessResultsContainer", "interface/business/businessSellerResult.html")
]);

initBusinessCategorySelectors();

const businessForm = document.getElementById("businessCalculatorForm");
    
const form = document.getElementById("calculatorForm");
const resultsSection = document.getElementById("resultsSection");

const privateCalculator = document.getElementById("privateCalculator");
const businessCalculator = document.getElementById("businessCalculator");

function money(value) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP"
    }).format(value);
}


export function selectSeller(type) {
    const isPrivate = type === "private";

    // Update selected seller cards
    document.getElementById("privateTab")
        .classList.toggle("active", isPrivate);

    document.getElementById("businessTab")
        .classList.toggle("active", !isPrivate);

    // Show the selected calculator
    document.getElementById("privateCalculatorContainer")
        .classList.toggle("hidden", !isPrivate);

    document.getElementById("businessCalculatorContainer")
        .classList.toggle("hidden", isPrivate);

    // Hide both results when switching sellers
    document.getElementById("resultsContainer")
        .classList.add("hidden");

    document.getElementById("businessResultsContainer")
        .classList.add("hidden");

    // Hide individual result sections
    document.getElementById("resultsSection")
        ?.classList.add("hidden");

    document.getElementById("businessResultsSection")
        ?.classList.add("hidden");
}

window.selectSeller = selectSeller;

form.addEventListener("submit", function(event) {

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

    // Private Seller
    try {

        const result = calculatePrivateSeller({
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

        const profitBox = document.getElementById("profitBox");

        profitBox.classList.toggle("negative", result.profit < 0);

        resultsSection.classList.remove("hidden");
        
        document.getElementById("resultsContainer")
            .classList.remove("hidden");

        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        window.lastCalculation = result;

    } catch (error) {

    console.error("Calculation error:", error);
    alert(error.message || "Something went wrong. Check the browser console.");
    }
});

// Business Seller
    
    const businessResultsContainer = document.getElementById(
        "businessResultsContainer"
    );

    const businessResultsSection = document.getElementById(
        "businessResultsSection"
    );

    function businessMoney(value) {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP"
        }).format(value);
    }

    businessForm.addEventListener("submit", function(event) {
        event.preventDefault();

        try {
            const result = calculateBusinessSeller({
                shop: document.getElementById("businessShop").value,
                vat: document.getElementById("businessVat").value,
                purchaseVat: document.getElementById("businessPurchaseVat").value,
                category: document.getElementById("businessCategory").value,
                subcategory: document.getElementById("businessSubcategory").value,
                sellingPrice: Number(document.getElementById("businessSellingPrice").value),
                postage: Number(document.getElementById("businessPostage").value),
                sourcePrice: Number(document.getElementById("businessSourcePrice").value),
                adRate: Number(document.getElementById("businessAdRate").value)
            });

            document.getElementById("businessResultBuyerTotal").textContent =
                businessMoney(result.orderTotal);

            document.getElementById("businessResultNetSales").textContent =
                businessMoney(result.netSalesRevenue);

            document.getElementById("businessResultOutputVat").textContent =
                businessMoney(result.outputVat);

            document.getElementById("businessResultFVF").textContent =
                businessMoney(result.finalValueFee);

            document.getElementById("businessResultOrderFee").textContent =
                businessMoney(result.orderFee);

            document.getElementById("businessResultRegulatoryFee").textContent =
                businessMoney(result.regulatoryFee);

            document.getElementById("businessResultAdvertisingFee").textContent =
                businessMoney(result.advertisingFee);

            document.getElementById("businessResultEbayVat").textContent =
                businessMoney(result.ebayFeesVat);

            document.getElementById("businessResultTotalFees").textContent =
                businessMoney(result.totalEbayFees);

            document.getElementById("businessResultSource").textContent =
                businessMoney(result.sourcePrice);

            document.getElementById("businessResultInputVat").textContent =
                businessMoney(result.inputVat);

            document.getElementById("businessResultProfit").textContent =
                businessMoney(result.profit);

            document.getElementById("businessResultMargin").textContent =
                "Profit margin: " + result.margin.toFixed(2) + "%";

            document.getElementById("businessResultROI").textContent =
                "ROI: " + result.roi.toFixed(2) + "%";

            document.getElementById("businessResultVatPayable").textContent =
                businessMoney(result.estimatedVatPayable);

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
            console.error(error);
            alert(error.message);
        }
    });


form.addEventListener("reset", function() {

    resultsSection.classList.add("hidden");

});

document.getElementById("newCalculationBtn")
    .addEventListener("click", function() {

        form.reset();

        resultsSection.classList.add("hidden");

        document.getElementById("targetPrice").focus();

    });


document.getElementById("copyBtn").addEventListener("click", async function () {

    const r = window.lastCalculation;

    if (!r) {
        alert("Please calculate your profit first.");
        return;
    }

    const resultsText = [
        "eBay BPF Profit Calculator",
        "Target buyer price: " + money(r.targetPrice),
        "BPF: " + money(r.bpf),
        "Listing price: " + money(r.listingPrice),
        "Advertising fee: " + money(r.totalAdFee),
        "Source price: " + money(r.sourcePrice),
        "Profit: " + money(r.profit),
        "Profit margin: " + r.margin.toFixed(2) + "%"
    ].join("\n");

    try {
        await navigator.clipboard.writeText(resultsText);
        alert("Latest calculation results copied successfully!");
    } catch (error) {
        console.error("Copy failed:", error);
        alert("Unable to copy results. Please check browser permissions.");
    }

});


// Clear Business Seller form and results

businessForm.addEventListener("reset", function() {
    businessResultsSection.classList.add("hidden");
    businessResultsContainer.classList.add("hidden");
});

// Hide previous results when starting a new calculation

businessForm.addEventListener("input", function() {
    businessResultsSection.classList.add("hidden");
    businessResultsContainer.classList.add("hidden");
});

