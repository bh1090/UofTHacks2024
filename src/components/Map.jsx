import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import mapStyles from "./mapStyles.json";
import "./Map.css";
import { mapsLibConfig } from "../config/googleMapsLibConfig";
import axios from "axios";
import redDot from "../images/red-dot.png";
import TimeLinePage from "../features/TimeLinePage";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const initialCenter = {
  lat: 43.6607, // latitude
  lng: -79.39663, // longitude
};

const options = {
  styles: mapStyles,
};

if (!redDot) {
  console.log("Img not loaded yet");
}
const MapComponent = ({ showImgData, setCanSubmit }) => {
  const [center, setCenter] = useState(initialCenter);
  const [autocomplete, setAutocomplete] = useState(null);

  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const [imgDataArr, setImgDataArr] = useState([]);
  const [imgDataTextInfo, setImgDataTextInfo] = useState({
    address: "",
    card1: "",
    card2: "",
    summary: "",
  });
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    console.error("google map api key NOT found: ", googleMapsApiKey);
  }

  console.log("Show img data ? : ", showImgData);

  useEffect(() => {
    const sendCoordinates = async () => {
      const sendLat = coordinates.lat;
      const sendLng = coordinates.lng;

      //change as need
      const localPort = 8000;

      try {
        // const res = await axios.get(
        //   `http://localhost:${localPort}/get-location?lat=${sendLat}&lon=${sendLng}`
        // );
        // console.log("res data axios get: ", res.data);
        //const imgDataObj = res.data
        // //set img arr state using res.data
        // if(!imgDataObj){
        //   console.error("Not an object");
        //   return null
        // }
        //convert imgDataObj.image_urls to array AND reverse
        // const imgArray = Object.entries(imgDataObj.image_urls).map(
        //   ([year, imgSrc]) => {
        //     const formattedObj = { year: year, imgSrc: imgSrc };
        //     return formattedObj;
        //   }
        // ).reverse();
        // console.log("converted reversed array: ", imgArray);
        // setImgDataArr((prev) => [...prev, ...imgArray ]);
        // setImgDataTextInfo((prev) => ({
        //   ...prev,
        //   address: imgDataObj.address,
        //   card1: imgDataObj.address,
        //   card2: imgDataObj.card2,
        //   summary: imgDataObj.summary,
        // }));
        // setCanSubmit(true);
      } catch (error) {
        console.error(error);
      }
    };

    sendCoordinates();
    console.log("axios called on every coordinates change");
  }, [coordinates]);

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = async () => {
    console.log("auto complelte: ", autocomplete);
    if (autocomplete !== null) {
      const place = await autocomplete.getPlace();

      console.log("place from autcomplete.getPlace()", place);
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      console.log("lat and long: ", lat, " ", lng);
      setCenter({
        lat,
        lng,
      });

      setCoordinates({ lat, lng });

      // setCanSubmit(true);
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  return (
    <>
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={mapsLibConfig}>
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Search a location"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `400px`,
              height: `38px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              marginBottom: "30px",
            }}
          />
        </Autocomplete>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          options={options}
        >
          <Marker
            position={center}
            // position={coordinates}
            visible={true}
            icon={{
              url: redDot,
              // scaledSize: new window.google.maps.Size(40, 40), // size
            }}
          />
        </GoogleMap>
      </LoadScript>
      {showImgData && (
        <TimeLinePage
          imgDataArr={imgDataArr}
          imgDataTextInfo={imgDataTextInfo}
        />
      )}
    </>
  );
};

export default MapComponent;
