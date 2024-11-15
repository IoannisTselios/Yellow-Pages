import React, { createContext, useContext, useState } from 'react';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filterValues, setFilterValues] = useState({
    selectedName: '',
    selectedLocation: [],
    selectedPosition: [],
    selectedFunction: [],
    selectedSeniority: [],
    selectedIndustry: [],
    includePastFunction: false,    

    selectedCompanyName: [],
    selectedCompanyIndustry: [],
    includePastIndustry: false,
    selectedCompanyHeadquarters: [],

    selectedKeyword: [],
    selectedConnections: []
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
