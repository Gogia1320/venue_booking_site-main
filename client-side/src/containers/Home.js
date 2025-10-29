import React, { useEffect } from "react";
import Layout from "../components/Layout/index.layout";
import { Container, Spinner } from "react-bootstrap";
import VenueCard from "../components/UI/VenueCard";
import { useDispatch, useSelector } from "react-redux";
import { getVenues } from "../actions/venue.actions";
import { isEmpty } from "../helpers/isObjEmpty";

function Home() {
  const dispatch = useDispatch();
  const allVenuesInfo = useSelector((state) => state.allVenuesInfo);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "KAPPA | Home";
    dispatch(getVenues());
  }, [dispatch]);

  const { allVenues, loading } = allVenuesInfo;

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <h1>Getting all venues 🎉</h1>
          <Spinner animation="border" variant="success" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        {isEmpty(allVenues) ? (
          <div className="text-center mt-5">
            <h1>
              No Venues currently 😢 <br />
              Check again after sometime
            </h1>
          </div>
        ) : (
          <div className="row mt-4">
            {allVenues.map((venue) => {
              const {
                _id,
                venueName,
                address,
                location,
                category,
                price,
                venuePictures,
                ownerId,
              } = venue;

              const img1 = venuePictures?.[0]?.img || null;
              const img2 = venuePictures?.[1]?.img || null;

              return (
                <div className="col-md-4 col-sm-6 mb-4" key={_id}>
                  <VenueCard
                    img1={img1}
                    img2={img2}
                    venueName={venueName}
                    _id={_id}
                    userId={auth?.user?._id}
                    category={category}
                    address={address}
                    location={location}
                    price={price}
                    ownerId={ownerId}
                    style={{ width: "100%", height: "200px" }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </Layout>
  );
}

export default Home;
