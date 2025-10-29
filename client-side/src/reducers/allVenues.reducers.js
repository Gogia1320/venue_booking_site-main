import { venueConstants } from '../actions/constants';

const initialState = {
    message: '',
    allVenues: [],
    loading: false
};

const venuesInfoReducer = (state = initialState, action) => {
    console.log(action);
    switch (action.type) {
        case venueConstants.GETALL_VENUES_REQUEST:
            return {
                ...state,
                loading: true
            };

        case venueConstants.GETALL_VENUES_SUCCESS:
            return {
                ...state,
                loading: false,
                allVenues: Array.isArray(action.payload)
                    ? action.payload.slice(0).reverse()
                    : []
            };

        case venueConstants.GETALL_VENUES_FAILURE:
            return {
                ...state,
                loading: false,
                message: 'Something went wrong...!'
            };

        default:
            return state;
    }
};

export default venuesInfoReducer;
