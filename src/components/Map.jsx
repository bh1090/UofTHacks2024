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
const MapComponent = () => {
  const [center, setCenter] = useState(initialCenter);
  const [autocomplete, setAutocomplete] = useState(null);

  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    console.error("google map api key NOT found: ", googleMapsApiKey);
  }

  useEffect(() => {
    const sendCoordinates = async () => {
      const sendLat = coordinates.lat;
      const sendLng = coordinates.lng;

      //change as need
      const localPort = 8000;
      const res = await axios.get(
        `http://localhost:${localPort}/get-location?lat=${sendLat}&lon=${sendLng}`
      );

      console.log("res data axios get: ", res.data);
    };

    // sendCoordinates();
    console.log('axios called on every coordinates change');
  }, [coordinates]);

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    console.log("auto complelte: ", autocomplete);
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      console.log("place from autcomplete.getPlace()", place);
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      console.log("lat and long: ", lat, " ", lng);
      setCenter({
        lat,
        lng,
      });

      setCoordinates({ lat, lng });
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={mapsLibConfig}>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Search a location"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            position: "absolute",
            top: "10px",
            left: "50%",
            marginLeft: "-120px",
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
  );
};

export default MapComponent;
