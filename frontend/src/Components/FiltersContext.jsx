import React, { createContext, useContext, useState } from 'react';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filterValues, setFilterValues] = useState({
    selectedName: null,
    selectedLocation: [],
    selectedPosition: [],
    selectedFunction: [],
    selectedSeniority: "",
    selectedIndustry: [],
    includePastFunction: false,    

    selectedCompanyName: [],
    includePastCompanies: false,
    selectedCompanyIndustry: [],
    includePastIndustry: false,
    selectedCompanyHeadquarters: [],
    selectedCompanySize: [0, 2],
    selectedCompanyYear: [2014, 2024],

    selectedKeyword: "",
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
