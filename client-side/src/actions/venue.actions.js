import { venueConstants, addVenueConstants } from "./constants";
import axios from '../helpers/axios';

const deleteVenue = (venueId) => async (dispatch) => {
  dispatch({ type: venueConstants.DELETE_VENUE_REQUEST });

  try {
    const res = await axios.delete(`/venue/${venueId}`); // backend API call

    if (res.status === 200) {
      dispatch({
        type: venueConstants.DELETE_VENUE_SUCCESS,
        payload: venueId // reducer me is id ko use karke remove karenge
      });
    }
  } catch (error) {
    dispatch({
      type: venueConstants.DELETE_VENUE_FAILURE,
      payload: {
        msg: error.response?.data?.msg || "Something went wrong",
        error: error.response?.data?.error || error.message
      }
    });
  }
};






const addVenue = (form) => async (dispatch) => {
  dispatch({ type: addVenueConstants.ADD_VENUE_REQUEST });

  try {
    const res = await axios.post(`/create-venue`, form);

    if (res.status === 201) {
      dispatch({
        type: addVenueConstants.ADD_VENUE_SUCCESS,
        payload: res.data._venue
      });
    }
  } catch (error) {
    dispatch({
      type: addVenueConstants.ADD_VENUE_FAILURE,
      payload: {
        msg: error.response?.data?.msg || "Something went wrong",
        error: error.response?.data?.error || error.message
      }
    });
  }
};

const getVenues = () => async (dispatch) => {
  dispatch({ type: venueConstants.GETALL_VENUES_REQUEST });

  try {
    const res = await axios.get(`/all-venues`);
    console.log("Backend response:", res.data);
    dispatch({
      type: venueConstants.GETALL_VENUES_SUCCESS,
      payload: res.data.venues || []
    });
  } catch (error) {
    dispatch({
      type: venueConstants.GETALL_VENUES_FAILURE,
      payload: { msg: error.response?.data?.msg || "Something went wrong" }
    });
  }
};

const getOneVenue = (id) => async (dispatch) => {
  dispatch({ type: venueConstants.GETONE_VENUE_REQUEST });
  try {
    const res = await axios.get(`/venue/${id}`);
    console.log("venue->:", res.data);
    dispatch({
      type: venueConstants.GETONE_VENUE_SUCCESS,
      payload: res.data.venue || null
    });
  } catch (error) {
    dispatch({
      type: venueConstants.GETONE_VENUE_FAILURE,
      payload: { msg: error.response?.data?.msg || "Something went wrong" }
    });
  }
};

const getOwnerVenues = (ownerId) => async (dispatch) => {
  dispatch({ type: venueConstants.GETALL_VENUES_OF_DEALER_REQUEST });
  try {
    const res = await axios.get(`/venues/${ownerId}`);
    console.log("venue2->:", res.data);
    dispatch({
      type: venueConstants.GETALL_VENUES_OF_DEALER_SUCCESS,
      payload: res.data.venues || []
    });
  } catch (error) {
    dispatch({
      type: venueConstants.GETALL_VENUES_OF_DEALER_FAILURE,
      payload: {
        msg: error.response?.data?.msg || "Something went wrong",
        error: error.response?.data?.error || error.message
      }
    });
  }
};

export {
  addVenue,
  getVenues,
  getOneVenue,
  getOwnerVenues,
  deleteVenue
};
