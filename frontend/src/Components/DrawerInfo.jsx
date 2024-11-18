import React from 'react';
import { Box, Chip, Divider } from '@mui/material';
import styles from './DrawerInfo.module.css';

function calculateTimeDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in months
    const yearsDifference = end.getFullYear() - start.getFullYear();
    const monthsDifference = end.getMonth() - start.getMonth();
    
    // Total months difference
    let totalMonths = yearsDifference * 12 + monthsDifference;
    
    // If the end day is before the start day in the month, subtract 1 from the total months
    if (end.getDate() < start.getDate()) {
        totalMonths -= 1;
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    // Format the result as "X years and Y months" or just "Y months"
    if (years > 0 && months > 0) {
        return `${years} year${years > 1 ? 's' : ''} and ${months} month${months > 1 ? 's' : ''}`;
    } else if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''}`;
    } else {
        return "0 months"; // If there's no difference
    }
}

const DrawerInfo = ({ selectedRow }) => {
  return (
    <Box sx={{ width: 700, color: '#fff' }} role="presentation">
      <div className={styles.drawerContainer}>

        <div className={styles.profile}>
          <h3 style={{ margin: 0 }}>{selectedRow.first_name + ' ' + selectedRow.last_name}</h3>
          <p style={{ margin: 0 }}>{selectedRow.location}</p>
          <a 
            href={selectedRow.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ fontSize: '0.8em', color: '#B3B3B3' }}
            >
            LinkedIn Profile
          </a>
        </div>       

        <Divider sx={{ bgcolor: '#404040' }}/>

        <div className={styles.connections}>
          {/* <Chip label="Markus" variant="outlined" color="secondary"/>
          <Chip label="Konstantina" variant="outlined" color="secondary"/> */}
          {selectedRow.connected_with.map((name, index) => (
            <Chip 
              key={index} 
              label={name} 
              variant="outlined" 
              color="secondary" 
            />
          ))}
        </div>    

        <Divider sx={{ bgcolor: '#404040' }}/>

        <div className={styles.bioSummary}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0 }}>Bio</h4>
            <p style={{ margin: 0, paddingTop: 5 }}>{selectedRow.bio}</p>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0 }}>Summary</h4>
            <p style={{ margin: 0, paddingTop: 5 }}>{selectedRow.summary}</p>
          </div>
        </div>

        <Divider sx={{ bgcolor: '#404040' }}/>

        <h4 style={{ paddingTop: 16, margin: 0 }}>Current Positions</h4>
        { selectedRow.main_role ? 
          <div className={styles.gridContainer}>
            <div>
              <p>{selectedRow.main_role.position}</p>
              {/* <p>{selectedRow.main_role.start_date}</p> */}
              <p>{calculateTimeDifference(selectedRow.main_role.start_date, new Date())}</p>
            </div>
            <div>
              <p>{selectedRow.main_role.company}</p>
              <p>{selectedRow.main_role.industry}</p>
              <p>{selectedRow.main_role.company_size}</p>
              <p>{selectedRow.main_role.year_founded}</p>
              <p>{selectedRow.main_role.location}</p>
            </div>
          </div>  
          : <p>There are no current roles</p>
        }      

        {selectedRow.other_roles.map((role, index) => (
          <div key={index} className={styles.gridContainer}>
            <div>
              <p>{role.position}</p>
              {/* <p>{role.start_date}</p> */}
              <p>{calculateTimeDifference(role.start_date, new Date())}</p>
            </div>
            <div>
              <p>{role.company}</p>
              <p>{role.industry}</p>
              <p>{role.company_size}</p>
              <p>{role.year_founded}</p>
              <p>{role.location}</p>
            </div>
          </div>        
        ))}

        <Divider sx={{ bgcolor: '#404040' }}/>

        <h4 style={{ paddingTop: 16, margin: 0 }}>Past Positions</h4>
        {selectedRow.past_roles.map((past_role, index) => (
          <div key={index} className={styles.gridContainer}>
            <div>
              <p>{past_role.position}</p>
              <p>{calculateTimeDifference(past_role.start_date, past_role.end_date)}</p>
            </div>
            <div>
              <p>{past_role.company}</p>
              <p>{past_role.industry}</p>
              <p>{past_role.company_size}</p>
              <p>{past_role.year_founded}</p>
              <p>{past_role.location}</p>
            </div>
          </div>        
        ))}

      </div> 
    </Box>
  );
};

export default DrawerInfo;
