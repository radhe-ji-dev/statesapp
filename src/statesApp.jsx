import React, { useState, useEffect } from "react";

function StatesApp() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  // Derived disabled logic
  const isStateDisabled = !selectedCountry;
  const isCityDisabled = !selectedState;

  // Fetch all countries on mount
  useEffect(() => {
    fetch("https://location-selector.labs.crio.do/countries")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setCountries(data))
      .catch((err) => {
        console.error("Error fetching countries", err);
        setCountries([]); // keep placeholder only
      });
  }, []);

  // Fetch states when selectedCountry changes
  useEffect(() => {
    if (!selectedCountry) return;

    const encodedCountry = encodeURIComponent(selectedCountry);

    fetch(
      `https://location-selector.labs.crio.do/country=${encodedCountry}/states`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setStates(data))
      .catch((err) => {
        console.error("Error fetching states", err);
        setStates([]); // keep placeholder only
      });
  }, [selectedCountry]);

  // Fetch cities when selectedState changes
  useEffect(() => {
    if (!selectedState) return;

    const encodedCountry = encodeURIComponent(selectedCountry);
    const encodedState = encodeURIComponent(selectedState);

    fetch(
      `https://location-selector.labs.crio.do/country=${encodedCountry}/state=${encodedState}/cities`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setCities(data))
      .catch((err) => {
        console.error("Error fetching cities", err);
        setCities([]); // keep placeholder only
      });
  }, [selectedState, selectedCountry]);

  return (
    <div>
      {/* Country Dropdown */}
      <select
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          // Reset downstream selections
          setSelectedState("");
          setSelectedCity("");
          setStates([]);
          setCities([]);
        }}
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {/* State Dropdown */}
      <select
        disabled={isStateDisabled}
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
          // Reset city when state changes
          setSelectedCity("");
          setCities([]);
        }}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      {/* City Dropdown */}
      <select
        disabled={isCityDisabled}
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* Display selected location */}
      {selectedCountry && selectedState && selectedCity && (
        <p>
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </p>
      )}
    </div>
  );
}

export default StatesApp;
