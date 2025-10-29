const stripe = require('stripe')(process.env.stripe_key);
const Deal = require('../models/deal');

const checkout = async (req, res) => {
    const { venueId, eventDate, bill, venueName, venueOwnerId } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.GLOBAL_CLIENT_URL}/payment-status?success=true`,
            cancel_url: `${process.env.GLOBAL_CLIENT_URL}/payment-status?canceled=true`,
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: { name: venueName },
                        unit_amount: bill * 100, // Stripe expects amount in paise
                    },
                    quantity: 1,
                },
            ],
        });

        // Save the deal to MongoDB
        const deal = await new Deal({
            venueId,
            eventDate,
            venueName,
            venueOwnerId,
            bill,
            userId: req.user.id,
        }).save();

        return res.status(201).json({
            url: session.url,
            dealId: deal._id,
        });

    } catch (e) {
        console.error('Checkout error:', e);
        return res.status(400).json({ msg: e.message || "Payment failed" });
    }
};


const confirmDeal = async (req, res) => {
    try {
        const { dealId } = req.params;

        const deal = await Deal.findOneAndUpdate(
            { _id: dealId },
            { status: "green" },
            { new: true } // Return updated document
        );

        if (!deal) {
            return res.status(404).json({ success: false, msg: "Deal not found" });
        }

        return res.status(200).json({
            success: true,
            msg: "Deal confirmed successfully",
            deal
        });

    } catch (error) {
        console.error("Error confirming deal:", error);
        return res.status(500).json({ success: false, msg: "Internal Server Error", error });
    }
};


const deleteUnconfirmDeal = async (req, res) => {
    try {
        const { dealId } = req.params;

        const deletedDeal = await Deal.findByIdAndDelete(dealId);

        if (!deletedDeal) {
            return res.status(404).json({ success: false, msg: "Deal not found or already deleted" });
        }

        return res.status(200).json({
            success: true,
            msg: "Unconfirmed deal deleted successfully",
            deletedDeal
        });

    } catch (error) {
        console.error("Error deleting deal:", error);
        return res.status(500).json({
            success: false,
            msg: "Something went wrong while deleting the deal",
            error
        });
    }
};


const confirmDealsOfUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const allDeals = await Deal.find({ userId, status: "green" });

        if (!allDeals || allDeals.length === 0) {
            return res.status(200).json({
                success: true,
                msg: "No confirmed deals found for this user",
                deals: []
            });
        }

        return res.status(200).json({
            success: true,
            deals: allDeals
        });

    } catch (error) {
        console.error("Error fetching confirmed deals:", error);
        return res.status(500).json({
            success: false,
            msg: "Something went wrong while fetching confirmed deals",
            error
        });
    }
};

const confirmDealsOfDealer = async (req, res) => {
    try {
        const { dealerId } = req.params;

        const allDeals = await Deal.find({ venueOwnerId: dealerId, status: "green" });

        if (!allDeals || allDeals.length === 0) {
            return res.status(200).json({
                success: true,
                msg: "No confirmed deals found for this dealer",
                deals: []
            });
        }

        return res.status(200).json({
            success: true,
            deals: allDeals
        });

    } catch (error) {
        console.error("Error fetching dealer's confirmed deals:", error);
        return res.status(500).json({
            success: false,
            msg: "Something went wrong while fetching confirmed deals",
            error
        });
    }
};

const getDeal = async (req, res) => {
    try {
        const { dealId } = req.params;

        const deal = await Deal.findById(dealId);

        if (!deal) {
            return res.status(404).json({
                success: false,
                msg: "Deal not found"
            });
        }

        return res.status(200).json({
            success: true,
            deal
        });

    } catch (error) {
        console.error("Error fetching deal:", error);
        return res.status(500).json({
            success: false,
            msg: "Something went wrong while fetching the deal",
            error
        });
    }
};

module.exports = {
    checkout,
    confirmDealsOfUser,
    confirmDealsOfDealer,
    getDeal,
    confirmDeal,
    deleteUnconfirmDeal
}