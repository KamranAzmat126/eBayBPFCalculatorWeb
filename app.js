
import { calculatePrivateSeller } from "./privateSeller.js";
import { calculateBusinessSeller } from "./businessSeller.js";

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

    document.getElementById("privateTab")
        .classList.toggle("active", isPrivate);

    document.getElementById("businessTab")
        .classList.toggle("active", !isPrivate);

    privateCalculator.classList.toggle("hidden", !isPrivate);
    businessCalculator.classList.toggle("hidden", isPrivate);

    resultsSection.classList.add("hidden");
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

form.addEventListener("reset", function() {

    resultsSection.classList.add("hidden");

});

document.getElementById("newCalculationBtn")
    .addEventListener("click", function() {

        form.reset();

        resultsSection.classList.add("hidden");

        document.getElementById("targetPrice").focus();

    });

document.getElementById("copyBtn")
    .addEventListener("click", async function() {

        if (!window.lastCalculation) return;

        const r = window.lastCalculation;

        const text = [
            "eBay BPF Profit Calculator",
            "Target buyer price: " + money(r.targetPrice),
            "BPF: " + money(r.bpf),
            "Listing price: " + money(r.listingPrice),
            "Advertising fee: " + money(r.adFee),
            "Source price: " + money(r.sourcePrice),
            "Profit: " + money(r.profit),
            "Profit margin: " + r.margin.toFixed(2) + "%"
        ].join("\n");

        try {
            await navigator.clipboard.writeText(text);
            this.textContent = "Copied!";
        } catch {
            alert("Unable to copy. Please select and copy the results manually.");
        }

    });
