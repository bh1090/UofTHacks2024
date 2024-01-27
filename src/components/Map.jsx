import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import mapStyles from './mapStyles.json';
import './Map.css';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const initialCenter = {
  lat: 43.6607, // latitude
  lng: -79.39663, // longitude
};

const options = {
  styles: mapStyles,
};

const MapComponent = () => {
  const [center, setCenter] = useState(initialCenter);
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBrQv-SiO5LK52NoNWVIS1uGM3wxFnjR7g"
      libraries={['places']} // Add this prop to load the Places library
    >
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
            marginLeft: "-120px" // Half of the width to center it
          }}
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={options}
      >
        <Marker position={center} visible={true} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
