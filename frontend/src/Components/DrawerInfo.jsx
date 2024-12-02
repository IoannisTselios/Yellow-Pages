import React, { useState } from 'react';
import { Box, Chip, Divider } from '@mui/material';
import styles from './DrawerInfo.module.css';
import ShowMoreText from './ShowMoreText';

function formatDate(dateString) {
  if (!dateString) return "Invalid Date";
  
  const options = { year: 'numeric', month: 'short' };
  const date = new Date(dateString);

  return isNaN(date) ? "Invalid Date" : date.toLocaleDateString('en-US', options);
}

const DrawerInfo = ({ selectedRow }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box sx={{ width: 800, color: '#fff' }} role="presentation">
      <div className={styles.drawerContainer}>

        <div className={styles.profile}>
          <h2 style={{ margin: 0 }}>{selectedRow.first_name + ' ' + selectedRow.last_name}</h2>
          <p style={{ margin: 0 }}>{selectedRow.location}</p>
          <a 
            href={selectedRow.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ fontSize: '13px', color: '#B3B3B3' }}
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

        <div className={styles.gridContainerBioSummary}>
          <div>
            <h2>Bio</h2>
            <p style={{ marginTop: 16 }}>{selectedRow.bio}</p>
          </div>

          <Divider orientation="vertical" sx={{ bgcolor: '#404040', height: '100%', width: '1px' }} />

          <div>
            <h2>Summary</h2>
            <ShowMoreText
              text={selectedRow.summary}
              limit={200}
              style={{ marginTop: '16px' }}
            />
          </div>
        </div>

        <Divider sx={{ bgcolor: '#404040' }}/>

        <h2 style={{ paddingTop: 16, margin: 0 }}>Current Positions</h2>
        {!selectedRow.main_role && (!selectedRow.other_roles || selectedRow.other_roles.length === 0) ? (
          <p className={styles.gridContainer}>There are no current roles</p>
        ) : (
          <>
          {selectedRow.main_role && (
            <div className={styles.gridContainer}>
              <div>
                <p className={styles.title}>{selectedRow.main_role.position}</p>
                <p className={styles.topPad + ' ' + styles.small}>since {formatDate(selectedRow.main_role.start_date)}</p>
                <p className={styles.topPad}>{selectedRow.main_role.description}</p>
              </div>
              <div>
                <p><a style={{ textDecoration: 'none' }} className={styles.title} href={selectedRow.main_role.company_website} target="_blank" rel="noopener noreferrer">{selectedRow.main_role.company}</a> - {selectedRow.main_role.industry}</p>
                <p className={styles.topPad + ' ' + styles.small}>{selectedRow.main_role.location.split(',')[0]} - {selectedRow.main_role.company_size} people - since {selectedRow.main_role.year_founded}</p>
                <p className={styles.topPad + ' ' + styles.small}><a style={{ fontSize: '13px', color: '#B3B3B3' }} href={selectedRow.main_role.company_linkedin_link} target="_blank" rel="noopener noreferrer">Company LinkedIn</a></p>
                <ShowMoreText
                  text={selectedRow.main_role.company_description}
                  style={{ paddingTop: '5px' }}
                />
              </div>
            </div>  
          )}     

          {selectedRow.other_roles && selectedRow.other_roles.map((role, index) => (
            <div key={index} className={styles.gridContainer}>
              <div>
                <p className={styles.title}>{role.position}</p>
                <p className={styles.topPad + ' ' + styles.small}>since {formatDate(role.start_date)}</p>
                <p className={styles.topPad}>{role.description}</p>
              </div>
              <div>
                <p><a style={{ textDecoration: 'none' }} className={styles.title} href={role.company_website} target="_blank" rel="noopener noreferrer">{role.company}</a> - {role.industry}</p>
                <p className={styles.topPad + ' ' + styles.small}>{role.location.split(',')[0]} - {role.company_size} people - since {role.year_founded}</p>
                <p className={styles.topPad + ' ' + styles.small}><a style={{ fontSize: '13px', color: '#B3B3B3' }} href={role.company_linkedin_link} target="_blank" rel="noopener noreferrer">Company LinkedIn</a></p>
                <ShowMoreText
                  text={role.company_description}
                  style={{ paddingTop: '5px' }}
                />
              </div>
            </div>        
          ))}
          </>
        )}

        <Divider sx={{ bgcolor: '#404040' }}/>

        <h2 style={{ paddingTop: 16, margin: 0 }}>Past Positions</h2>
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
                <p className={styles.topPad + ' ' + styles.small}><a style={{ fontSize: '13px', color: '#B3B3B3' }} href={past_role.company_linkedin_link} target="_blank" rel="noopener noreferrer">Company LinkedIn</a></p>
                <ShowMoreText
                  text={past_role.company_description}
                  style={{ paddingTop: '5px' }}
                />
              </div>
            </div>        
          ))) 
        }

      </div> 
    </Box>
  );
};

export default DrawerInfo;
