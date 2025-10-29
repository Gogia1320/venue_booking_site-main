// reducers/deleteVenue.reducer.js
import { venueConstants } from "../actions/constants";

const initialState = {
  loading: false,
  success: false,
  error: null,
};

export const deleteVenueReducer = (state = initialState, action) => {
  switch (action.type) {
    case venueConstants.DELETE_VENUE_REQUEST:
      return { ...state, loading: true, success: false, error: null };

    case venueConstants.DELETE_VENUE_SUCCESS:
      return { ...state, loading: false, success: true };

    case venueConstants.DELETE_VENUE_FAILURE:
      return { ...state, loading: false, success: false, error: action.payload };

    default:
      return state;
  }
};
