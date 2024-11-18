import React from 'react';
import { Box, Chip, Divider } from '@mui/material';
import styles from './DrawerInfo.module.css';

const DrawerInfo = ({ selectedRow }) => {
  return (
    <Box sx={{ width: 700, color: '#fff' }} role="presentation">
      <div className={styles.drawerContainer}>

        <div className={styles.profile}>
          <h3 style={{ margin: 0 }}>{selectedRow.col1}</h3>
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
          <Chip label="Markus" variant="outlined" color="secondary"/>
          <Chip label="Konstantina" variant="outlined" color="secondary"/>
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

        <div className={styles.currentPositions}>
          <h4 style={{ margin: 0 }}>Current Positions</h4>

          <p>{selectedRow.main_role.position}</p>
          <p>{selectedRow.main_role.start_date}</p>
        </div>        

        <Divider sx={{ bgcolor: '#404040' }}/>

        <div className={styles.pastPositions}>
          <h4 style={{ margin: 0 }}>Past Positions</h4>

          <p>{selectedRow.past_roles[0].position}</p>
          <p>{selectedRow.past_roles[0].start_date}</p>
          <p>{selectedRow.past_roles[0].end_date}</p>

        </div> 

      </div> 
    </Box>
  );
};

export default DrawerInfo;
