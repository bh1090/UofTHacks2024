import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import mapStyles from './mapStyles.json';
import './Map.css';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 43.6607, // latitude
  lng: -79.39663, // longitude
};

const options = {
  styles: mapStyles,
};


const MapComponent = () => {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBrQv-SiO5LK52NoNWVIS1uGM3wxFnjR7g" // API key here
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={options}
      >
        {/* Child components like markers can go here */}
        <Marker
          position={{ lat: -34.397, lng: 150.644 }} // Example marker position
          icon={{
            path: 'M16 0C7.164 0 0 7.164 0 16s16 48 16 48s16-48 16-48S24.836 0 16 0zm0 28c-3.313 0-6-2.687-6-6s2.687-6 6-6s6 2.687 6 6s-2.687 6-6 6zm0 0',
            fillColor: 'red', // Marker color
            fillOpacity: 1, // Marker opacity
            strokeWeight: 0, // No border
            scale: 1, // Marker size
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;