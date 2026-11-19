
import { BUSINESS_FEES } from "./businessFeeRates.js";

function calculateFinalValueFee(orderTotal, category) {
    const fee = BUSINESS_FEES.categories[category];

    if (!fee) {
        throw new Error("Please select a valid product category.");
    }

    // Standard category fee
    if (fee.rate !== undefined) {
        return orderTotal * fee.rate;
    }

    // Tiered category fee
    const firstPortion = Math.min(orderTotal, fee.threshold);
    const remainingPortion = Math.max(0, orderTotal - fee.threshold);

    return (
        firstPortion * fee.firstRate +
        remainingPortion * fee.additionalRate
    );
}

export function calculateBusinessSeller({
    shop,
    vat,
    purchaseVat,
    category,
    sellingPrice,
    postage,
    sourcePrice,
    adRate
}) {
    const values = [
        sellingPrice,
        postage,
        sourcePrice,
        adRate
    ];

    if (values.some(value => !Number.isFinite(value))) {
        throw new Error("Please enter valid numbers in all fields.");
    }

    if (sellingPrice <= 0 || postage < 0 || sourcePrice < 0) {
        throw new Error("Please check your selling, postage and source prices.");
    }

    if (adRate < 0 || adRate > 100) {
        throw new Error("Advertising rate must be between 0 and 100%.");
    }

    if (!["registered", "not-registered"].includes(vat)) {
        throw new Error("Please select a valid VAT registration status.");
    }

    if (!["reclaimable", "non-reclaimable", "no-vat"].includes(purchaseVat)) {
        throw new Error("Please select a valid purchase VAT treatment.");
    }

    const orderTotal = sellingPrice + postage;
    const vatRegistered = vat === "registered";
    const vatRate = BUSINESS_FEES.vatRate;

    // Output VAT included in the buyer's payment
    const outputVat = vatRegistered
        ? orderTotal * vatRate / (1 + vatRate)
        : 0;

    const netSalesRevenue = orderTotal - outputVat;

    // eBay selling fees
    const finalValueFee = calculateFinalValueFee(
        orderTotal,
        category
    );

    const orderFee = orderTotal <= 10
        ? BUSINESS_FEES.orderFee.upTo10
        : BUSINESS_FEES.orderFee.above10;

    const regulatoryFee =
        orderTotal * BUSINESS_FEES.regulatoryOperatingFee;

    // Advertising fee
    const advertisingFee = orderTotal * (adRate / 100);

    // VAT charged on eBay fees
    const ebayFeesBeforeVat =
        finalValueFee +
        orderFee +
        regulatoryFee +
        advertisingFee;

    const ebayFeesVat = ebayFeesBeforeVat * vatRate;

    const reclaimableEbayVat = vatRegistered
        ? ebayFeesVat
        : 0;

    const totalEbayFees =
        ebayFeesBeforeVat +
        ebayFeesVat -
        reclaimableEbayVat;

    // Purchase VAT
    let netSourceCost = sourcePrice;
    let inputVat = 0;

    if (
        vatRegistered &&
        purchaseVat === "reclaimable"
    ) {
        netSourceCost = sourcePrice / (1 + vatRate);
        inputVat = sourcePrice - netSourceCost;
    }

    // Final profit calculation
    const profit =
        netSalesRevenue -
        totalEbayFees -
        netSourceCost;

    const margin = netSalesRevenue > 0
        ? (profit / netSalesRevenue) * 100
        : 0;

    const roi = netSourceCost > 0
        ? (profit / netSourceCost) * 100
        : 0;

    // Estimated VAT payable before other business VAT adjustments
    const estimatedVatPayable =
        outputVat -
        inputVat -
        reclaimableEbayVat;

    return {
        shop,
        category,
        orderTotal,
        netSalesRevenue,
        outputVat,
        finalValueFee,
        orderFee,
        regulatoryFee,
        advertisingFee,
        ebayFeesBeforeVat,
        ebayFeesVat,
        reclaimableEbayVat,
        totalEbayFees,
        sourcePrice,
        netSourceCost,
        inputVat,
        profit,
        margin,
        roi,
        estimatedVatPayable
    };
}
