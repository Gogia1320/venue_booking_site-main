import React, { useState, useEffect } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import Layout from "../components/Layout/index.layout";
import { ImgsCard } from "../components/UI/ImgsCard";
import { useDispatch, useSelector } from "react-redux";
import { getOneVenue } from "../actions/venue.actions";
import { getPublicURL } from "../urlConfig";
import BookingModel from "../components/UI/BookingModel";
import { Redirect } from "react-router";

const VenuePage = (props) => {
  document.title = "KAPPA | Venue Details";
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [bookingModalShow, setBookingModalShow] = useState(false);
  const oneVenueInfo = useSelector((state) => state.oneVenueInfo);

  // Fetch the venue
  useEffect(() => {
    dispatch(getOneVenue(props.match.params.id));
  }, [dispatch, props.match.params.id]);

  // Loading state
  if (oneVenueInfo.loading || !oneVenueInfo.venue) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <h1>Getting venue info 🎉</h1>
          <Spinner animation="border" variant="success" />
        </div>
      </Layout>
    );
  }

  // Redirect if venue not found
  if (!oneVenueInfo.venue._id) {
    return <Redirect to="/" />;
  }

  // Destructure safely
  const {
    _id,
    venueName,
    description,
    address,
    location,
    category,
    price,
    venuePictures = [],
    ownerInfo = {},
    ownerId,
  } = oneVenueInfo.venue;

  return (
    <Layout>
      <Container>
        <section className="mb-5">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <ImgsCard
                img1={venuePictures[0] ? getPublicURL(venuePictures[0].img) : null}
                img2={venuePictures[1] ? getPublicURL(venuePictures[1].img) : null}
                alt="venue picture"
              />
            </div>

            <div className="col-md-6">
              <p style={{ fontSize: "22px" }}>
                <strong>{venueName}</strong>
              </p>
              <p className="mb-2 text-muted text-uppercase small">{category}</p>
              <p style={{ fontSize: "22px" }}>
                <strong>₹ {price}</strong>
              </p>
              <hr />
              <h5>Some words from Dealer -</h5>
              <p>{description}</p>
              <hr />

              <div className="table-responsive">
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr>
                      <th className="pl-0 w-25" scope="row">
                        <strong>Location</strong>
                      </th>
                      <td>{location}</td>
                    </tr>
                    <tr>
                      <th className="pl-0 w-25" scope="row">
                        <strong>Address</strong>
                      </th>
                      <td>{address}</td>
                    </tr>
                  </tbody>
                </table>
                <hr />
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr>
                      <th className="pl-0 w-25" scope="row">
                        <strong>Dealer Name</strong>
                      </th>
                      <td style={{ textTransform: "capitalize" }}>
                        {auth.token ? ownerInfo.ownerName || "N/A" : "Login to see Dealer Details"}
                      </td>
                    </tr>
                    <tr>
                      <th className="pl-0 w-25" scope="row">
                        <strong>Contact no</strong>
                      </th>
                      <td>{auth.token ? ownerInfo.contactNumber || "N/A" : null}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {auth.user?.role === "client" && (
                <>
                  <hr />
                  <Button variant="danger" onClick={() => setBookingModalShow(true)}>
                    Book
                  </Button>
                </>
              )}

              <BookingModel
                _id={_id}
                venueName={venueName}
                price={price}
                category={category}
                address={address}
                location={location}
                ownerId={ownerId}
                show={bookingModalShow}
                onHide={() => setBookingModalShow(false)}
              />
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
};

export default VenuePage;
