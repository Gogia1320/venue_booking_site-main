const Venue = require('../models/venue');
const Deal = require('../models/deal');
const slugify = require('slugify');

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

const createVenue = async (req, res) => {
  try {
    const { venueName, address, location, category, price, description } = req.body;

    // 🧾 Step 1: Validate required fields
    if (!venueName || !address || !location || !category || !price) {
      return res.status(400).json({ msg: "Please fill all required fields." });
    }

    // 👤 Step 2: Get owner info from logged-in user
    const ownerInfo = {
      ownerName: req.user.fullName,
      contactNumber: req.user.contactNumber,
    };

    // 🖼️ Step 3: Handle uploaded images
    let venuePictures = [];
    if (req.files && req.files.length > 0) {
      venuePictures = req.files.map((file) => ({
        img: file.filename,
      }));
    }

    // 🏠 Step 4: Create venue document
    const venue = new Venue({
      venueName,
      slug: slugify(venueName),
      address,
      description,
      location,
      category,
      price,
      venuePictures,
      ownerId: req.user.id,
      ownerInfo,
    });

    // 💾 Step 5: Save to MongoDB
    const savedVenue = await venue.save();

    // 🎯 Step 6: Return success response
    return res.status(201).json({
      msg: "Venue created successfully!",
      venue: savedVenue,
      uploadedFiles: req.files,
    });

  } catch (error) {
    console.error("Error while saving venue:", error);
    return res.status(500).json({
      msg: "Something went wrong while creating the venue.",
      error: error.message,
    });
  }
};


const getVenueByVenueId = async (req, res) => {
  try {
    const { venueId } = req.params;

    if (!venueId) {
      return res.status(400).json({ msg: "Venue ID is required." });
    }

    const venue = await Venue.findById(venueId);

    if (!venue) {
      return res.status(404).json({ msg: "Venue not found." });
    }

    return res.status(200).json({ venue });
  } catch (error) {
    console.error("Error fetching venue:", error);
    return res.status(500).json({
      msg: "Something went wrong while fetching the venue.",
      error: error.message,
    });
  }
};

const getAllVenuesByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({ msg: "Owner ID is required." });
    }

    const allVenues = await Venue.find({ ownerId });

    if (!allVenues || allVenues.length === 0) {
      return res.status(404).json({ msg: "No venues found for this owner." });
    }

    return res.status(200).json({ venues: allVenues });
  } catch (error) {
    console.error("Error fetching venues by ownerId:", error);
    return res.status(500).json({
      msg: "Something went wrong while fetching venues.",
      error: error.message,
    });
  }
};


const getAllVenues = async (req, res) => {
  try {
    const allVenues = await Venue.find({});

    // Even if array is empty, return 200 with empty array
    return res.status(200).json({ venues: allVenues });
  } catch (error) {
    console.error("Error fetching all venues:", error);
    return res.status(500).json({
      msg: "Something went wrong while fetching all venues.",
      error: error.message,
    });
  }
};


const checkAvailability = async (req, res) => {
  try {
    const { venueId, eventDate } = req.body;

    // ✅ Validate input
    if (!venueId || !eventDate) {
      return res.status(400).json({ msg: "venueId and eventDate are required." });
    }

    // 🔍 Find deals for this venue on the given date
    const deals = await Deal.find({ venueId, eventDate });

    if (!deals || deals.length === 0) {
      return res.status(200).json({ msg: "No deal found, venue is available." });
    } else {
      return res.status(200).json({ msg: "Venue is already booked for this date, please choose another date." });
    }
  } catch (error) {
    console.error("Error checking availability:", error);
    return res.status(500).json({
      msg: "Something went wrong while checking availability.",
      error: error.message,
    });
  }
};

const deleteVenueById = async (req, res) => {
  const { venueId } = req.params;

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ msg: "Venue not found" });
    }

    await Venue.findByIdAndDelete(venueId);
    return res.status(200).json({ msg: "Venue deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


module.exports = {
    createVenue,
    getVenueByVenueId,
    getAllVenuesByOwnerId,
    getAllVenues,
    checkAvailability,
    deleteVenueById
}