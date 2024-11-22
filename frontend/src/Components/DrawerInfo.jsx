import React from 'react';
import { Box, Chip, Divider } from '@mui/material';
import styles from './DrawerInfo.module.css';

// function calculateTimeDifference(startDate, endDate) {
//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     // Calculate the difference in months
//     const yearsDifference = end.getFullYear() - start.getFullYear();
//     const monthsDifference = end.getMonth() - start.getMonth();
    
//     // Total months difference
//     let totalMonths = yearsDifference * 12 + monthsDifference;
    
//     // If the end day is before the start day in the month, subtract 1 from the total months
//     if (end.getDate() < start.getDate()) {
//         totalMonths -= 1;
//     }

//     const years = Math.floor(totalMonths / 12);
//     const months = totalMonths % 12;

//     // Format the result as "X years and Y months" or just "Y months"
//     if (years > 0 && months > 0) {
//         return `${years} year${years > 1 ? 's' : ''} and ${months} month${months > 1 ? 's' : ''}`;
//     } else if (years > 0) {
//         return `${years} year${years > 1 ? 's' : ''}`;
//     } else if (months > 0) {
//         return `${months} month${months > 1 ? 's' : ''}`;
//     } else {
//         return "0 months"; // If there's no difference
//     }
// }

function formatDate(dateString) {
  if (!dateString) return "Invalid Date";
  
  const options = { year: 'numeric', month: 'short' };
  const date = new Date(dateString);

  return isNaN(date) ? "Invalid Date" : date.toLocaleDateString('en-US', options);
}

const DrawerInfo = ({ selectedRow }) => {
  return (
    <Box sx={{ width: 700, color: '#fff' }} role="presentation">
      <div className={styles.drawerContainer}>

        <div className={styles.profile}>
          <h3 style={{ margin: 0 }}>{selectedRow.first_name + ' ' + selectedRow.last_name}</h3>
          <p style={{ margin: 0 }}>{selectedRow.location}</p>
          <a 
            href={selectedRow.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ fontSize: '0.8em', color: '#B3B3B3' }}
            >
            LinkedIn Profile
          </a>
        </div>       

        <Divider sx={{ bgcolor: '#404040' }}/>

        <div className={styles.connections}>
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

        <div className={styles.gridContainer}>
          <div>
            <h4>Bio</h4>
            <p style={{ marginTop: 16 }}>{selectedRow.bio}</p>
          </div>
          <div>
            <h4>Summary</h4>
            <p style={{ marginTop: 16 }} className={styles.description}>{selectedRow.summary}</p>
          </div>
        </div>

        <Divider sx={{ bgcolor: '#404040' }}/>

        <h4 style={{ paddingTop: 16, margin: 0 }}>Current Positions</h4>
        {!selectedRow.main_role && (!selectedRow.other_roles || selectedRow.other_roles.length === 0) ? (
          <p className={styles.gridContainer}>There are no current roles</p>
        ) : (
          <>
          {selectedRow.main_role && (
            <div className={styles.gridContainer}>
              <div>
                <p className={styles.title}>{selectedRow.main_role.position}</p>
                {/* <p>{selectedRow.main_role.start_date}</p> */}
                <p className={styles.topPad + ' ' + styles.small}>since {formatDate(selectedRow.main_role.start_date)}</p>
                <p className={styles.topPad}>{selectedRow.main_role.description}</p>
              </div>
              <div>
                <p><a style={{ textDecoration: 'none' }} className={styles.title} href={selectedRow.main_role.company_website} target="_blank" rel="noopener noreferrer">{selectedRow.main_role.company}</a> - {selectedRow.main_role.industry}</p>
                <p className={styles.topPad + ' ' + styles.small}>{selectedRow.main_role.location.split(',')[0]} - {selectedRow.main_role.company_size} people - since {selectedRow.main_role.year_founded}</p>
                <p className={styles.topPad + ' ' + styles.small}><a style={{ textDecoration: 'none' }} href={selectedRow.main_role.company_linkedin_link} target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
                <p className={styles.topPad + ' ' + styles.description}>{selectedRow.main_role.company_description}</p>
              </div>
            </div>  
          )}     

          {selectedRow.other_roles && selectedRow.other_roles.map((role, index) => (
            <div key={index} className={styles.gridContainer}>
              <div>
                <p className={styles.title}>{role.position}</p>
                {/* <p>{role.start_date}</p> */}
                <p className={styles.topPad + ' ' + styles.small}>since {formatDate(role.start_date)}</p>
                <p className={styles.topPad}>{role.description}</p>
              </div>
              <div>
                <p><a style={{ textDecoration: 'none' }} className={styles.title} href={role.company_website} target="_blank" rel="noopener noreferrer">{role.company}</a> - {role.industry}</p>
                <p className={styles.topPad + ' ' + styles.small}>{role.location.split(',')[0]} - {role.company_size} people - since {role.year_founded}</p>
                <p className={styles.topPad + ' ' + styles.description}>{role.company_description}</p>
              </div>
            </div>        
          ))}
          </>
        )}

        <Divider sx={{ bgcolor: '#404040' }}/>

        <h4 style={{ paddingTop: 16, margin: 0 }}>Past Positions</h4>
        { !selectedRow.past_roles || selectedRow.past_roles.length === 0 ? 
          (<p className={styles.gridContainer}>There are no past roles</p> )
          :
          (selectedRow.past_roles.map((past_role, index) => (
            <div key={index} className={styles.gridContainer}>
              <div>
                <p className={styles.title}>{past_role.position}</p>
                <p className={styles.topPad + ' ' + styles.small}>{formatDate(past_role.start_date)} - {formatDate(past_role.end_date)}</p>
                <p>{past_role.description}</p>
              </div>
              <div>
                <p><a style={{ textDecoration: 'none' }} className={styles.title} href={past_role.company_website} target="_blank" rel="noopener noreferrer">{past_role.company}</a> - {past_role.industry}</p>
                <p className={styles.topPad + ' ' + styles.small}>{past_role.location.split(',')[0]} - {past_role.company_size} people - since {past_role.year_founded}</p>
                <p className={styles.topPad + ' ' + styles.description}>{past_role.company_description}</p>
              </div>
            </div>        
          ))) 
        }

      </div> 
    </Box>
  );
};

export default DrawerInfo;
