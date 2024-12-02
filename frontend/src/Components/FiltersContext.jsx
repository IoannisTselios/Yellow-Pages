import React, { createContext, useContext, useState } from 'react';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filterValues, setFilterValues] = useState({
    selectedFirstName: "",
    selectedLastName: "",
    selectedLocation: [],
    selectedPosition: [],
    includePastPosition: false,  
    // selectedPastPosition: [],
    selectedFunction: [],
    includePastFunction: false,  
    // selectedSeniority: "",
      
    selectedCompanyName: "",
    includePastCompanies: false,
    selectedCompanyIndustry: [],
    includePastIndustry: false,
    selectedCompanyHeadquarters: [],
    selectedCompanySize: [0, 7],
    selectedCompanyYearStart: 1400,
    selectedCompanyYearEnd: 2024,  

    selectedKeyword: [],
    selectedConnections: [],

    // save the url of the connections endpoint
    requestURL: '',

    // the result of the get_connection_list that gets passed to the table
    filteredData: [],

    // State for pagination
    rowCount: 0,
    paginationModel: {
      pageSize: 15,
      page: 0,
    },

    expertise: false
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
