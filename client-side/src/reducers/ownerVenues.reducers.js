import { venueConstants } from "../actions/constants";

const initialState = {
  error: null,
  allvenues: [], // {} se [] kar do, kyunki ye array hai
  message: '',
  loading: false
};

const getOwnerVenuesReducer = (state = initialState, action) => {
  switch (action.type) {
    case venueConstants.GETALL_VENUES_OF_DEALER_REQUEST:
      return { ...state, loading: true };

    case venueConstants.GETALL_VENUES_OF_DEALER_SUCCESS:
      return { ...state, allvenues: action.payload, loading: false };

    case venueConstants.GETALL_VENUES_OF_DEALER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ✅ Add this case for instant UI update
    case venueConstants.DELETE_VENUE_SUCCESS:
      return {
        ...state,
        allvenues: state.allvenues.filter(
          (venue) => venue._id !== action.payload
        )
      };

    default:
      return state;
  }
};

export default getOwnerVenuesReducer;
