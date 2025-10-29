import { venueConstants } from "../actions/constants";

const initialState = {
    venue: {
        _id: '',
        venueName: '',
        description: '',
        address: '',
        location: '',
        category: '',
        price: '',
        venuePictures: [],
        ownerInfo: {},
        reviews: [],
        ownerId: ''
    },
    error: null,
    message: '',
    loading: false
};

const oneVenueInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case venueConstants.GETONE_VENUE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case venueConstants.GETONE_VENUE_SUCCESS:
            return {
                ...state,
                venue: action.payload ?? initialState.venue,  // ✅ Correct
                loading: false
            };
        case venueConstants.GETONE_VENUE_FAILURE:
            return {
                ...state,
                loading: false,
                message: action.payload.msg
            };
        default:
            return state;
    }
};

export default oneVenueInfoReducer;
