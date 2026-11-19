
export const BUSINESS_FEES = {
    regulatoryOperatingFee: 0.0035,

    orderFee: {
        upTo10: 0.30,
        above10: 0.40
    },

    vatRate: 0.20,

    categories: {
        antiques: {
            name: "Antiques",
            rate: 0.109
        },
        art: {
            name: "Art",
            rate: 0.109
        },
        baby: {
            name: "Baby",
            rate: 0.109
        },
        books: {
            name: "Books, Comics & Magazines",
            rate: 0.099
        },
        business: {
            name: "Business, Office & Industrial",
            rate: 0.125
        },
        cameras: {
            name: "Cameras & Photography",
            rate: 0.099
        },
        clothes: {
            name: "Clothes, Shoes & Accessories",
            rate: 0.119
        },
        crafts: {
            name: "Crafts",
            rate: 0.129
        },
        dolls: {
            name: "Dolls & Bears",
            rate: 0.109
        },
        eventTickets: {
            name: "Event Tickets",
            rate: 0.129
        },
        films: {
            name: "Films & TV",
            rate: 0.099
        },
        garden: {
            name: "Garden & Patio",
            rate: 0.109
        },
        health: {
            name: "Health & Beauty",
            rate: 0.109
        },
        holidays: {
            name: "Holidays & Travel",
            threshold: 650,
            firstRate: 0.079,
            additionalRate: 0.03
        },
        home: {
            name: "Home, Furniture & DIY",
            threshold: 500,
            firstRate: 0.119,
            additionalRate: 0.079
        },
        jewellery: {
            name: "Jewellery & Watches",
            threshold: 1000,
            firstRate: 0.149,
            additionalRate: 0.04
        },
        mobile: {
            name: "Mobile Phones & Communication",
            rate: 0.099
        },
        music: {
            name: "Music",
            rate: 0.099
        },
        instruments: {
            name: "Musical Instruments & DJ Equipment",
            rate: 0.109
        },
        pets: {
            name: "Pet Supplies",
            rate: 0.129
        },
        pottery: {
            name: "Pottery, Ceramics & Glass",
            rate: 0.109
        },
        sport: {
            name: "Sporting Goods",
            rate: 0.109
        },
        sportsMemorabilia: {
            name: "Sports Memorabilia",
            rate: 0.109
        },
        stamps: {
            name: "Stamps",
            rate: 0.109
        },
        toys: {
            name: "Toys & Games",
            rate: 0.109
        },
        vehicles: {
            name: "Vehicle Parts & Accessories",
            threshold: 750,
            firstRate: 0.095,
            additionalRate: 0.03
        },
        games: {
            name: "Video Games & Consoles",
            rate: 0.099
        },
        wholesale: {
            name: "Wholesale & Job Lots",
            rate: 0.129
        },
        other: {
            name: "Everything Else",
            rate: 0.129
        }
    }
};
