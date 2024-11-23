import React, { createContext, useContext, useState } from 'react';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filterValues, setFilterValues] = useState({
    selectedFirstName: "",//null,
    selectedLastName: "",
    selectedLocation: [],
    selectedPosition: [],
    selectedPastPosition: [],
    selectedFunction: [],
    includePastFunction: false,  
    // selectedSeniority: "",
      
    selectedCompanyName: "",
    includePastCompanies: false,
    selectedCompanyIndustry: [],
    includePastIndustry: false,
    selectedCompanyHeadquarters: [],
    selectedCompanySize: [0, 7],
    selectedCompanyYear: [1800, 2024],

    selectedKeyword: "",
    selectedConnections: [],

    filteredData: []
  });

  const updateFilterValues = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <FiltersContext.Provider value={{ filterValues, updateFilterValues }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);
