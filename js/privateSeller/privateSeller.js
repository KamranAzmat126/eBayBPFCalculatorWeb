
/*
  PRIVATE SELLER CALCULATION ENGINE

  Replace calculateBPF() with your existing
  Python BPF calculation logic translated to JavaScript.
*/

function calculateBPF(targetPrice) {
    //  Calculate asking price
        const tier_1_base_fee = 0.10
        const tier_2_base_fee = 0.70
        const tier_3_base_fee = 6.70
        const tier_4_base_fee = 86.70
        const tier_1_percentage_rate = 1.07
        const tier_2_percentage_rate = 1.04
        const tier_3_percentage_rate = 1.02
        const tier_4_percentage_rate = 1.00

    // 2.1 Calculating the exact BPF for different Price Ranges
        var asking_price = 0
        if(targetPrice>0 && targetPrice<=21.50){
            asking_price = (targetPrice - tier_1_base_fee)/tier_1_percentage_rate;}
        if(targetPrice>21.50 && targetPrice<=312.70){
            asking_price = (targetPrice - tier_2_base_fee)/tier_2_percentage_rate;}
        if(targetPrice>312.70 && targetPrice<=4086.70){
            asking_price = (targetPrice - tier_3_base_fee)/tier_3_percentage_rate;}
        if(targetPrice>4086.70){
            asking_price = (targetPrice - tier_4_base_fee)/tier_4_percentage_rate;}
        
    return asking_price;
    
    // throw new Error(
    //     "BPF formula not configured. Add your existing calculation logic."
    // );
}

export function calculatePrivateSeller({
    targetPrice,
    sourcePrice,
    adRate
}) {

    if (!Number.isFinite(targetPrice) || targetPrice <= 0) {
        throw new Error("Enter a target price incl. BPF.");
    }

    if (!Number.isFinite(sourcePrice) || sourcePrice < 0) {
        throw new Error("Enter a source price.");
    }

    if (!Number.isFinite(adRate) || adRate < 0 || adRate > 100) {
        throw new Error("Advertising rate must be between 0% and 100%.");
    }

    // Calculate listing price
    const listingPrice = calculateBPF(targetPrice);

    // Calculate BPF using your existing formula
    const bpf = targetPrice - listingPrice;


    if (!Number.isFinite(bpf) || bpf < 0 || bpf > targetPrice) {
        throw new Error("Invalid BPF calculation result.");
    }

    
    // Advertising fee based on listing price
    const adFee = listingPrice * (adRate / 100);
    const vatAdFee = adFee * 0.2;
    const totalAdFee = adFee + vatAdFee;

    // Profit before any additional costs not entered by the user
    const profit = listingPrice - totalAdFee - sourcePrice;

    const margin = listingPrice > 0
        ? (profit / listingPrice) * 100
        : 0;

    return {
        targetPrice,
        bpf,
        listingPrice,
        totalAdFee,
        sourcePrice,
        profit,
        margin
    };
}
