import { format, isSameMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import dayjs from 'dayjs';
import LightTooltip from './LightTooltip';
import getCategoryById from '../utils/getCategoryById';
import getNameById from '../utils/getNameById';



const CustomDateCell = ({ children, value, currentMonth, setOpen, setSelectedDate, workDate, setDailySchedule}) => {
  
  if (!isSameMonth(value, currentMonth)) {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: '#f0f0f0',
          borderTop: '1px solid grey',
          borderRight: '1px solid grey',
        }}
      >
        {children}
      </div>
    );
  }

  const date = dayjs(value).format("YYYY-MM-DD");
  const daily = workDate[date];

  const handleOpen = () => {
    const current = workDate[date] || {
      早: { list: [], hasSurgery: false },
      午: { list: [], hasSurgery: false },
      晚: { list: [], hasSurgery: false },
      狀態: "營業"
    };
    setSelectedDate(date);
    setDailySchedule(current);
    setOpen(true);
  }
  
  return (
    <>
    {daily?.狀態 === '休診'?<div 
        style={{
          backgroundColor: "#f2c94c",
          color: "#555",
          height: "100%",
          width: "100%",
          borderTop: "1px solid grey",
          borderRight: "1px solid grey",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: 16,
          cursor: "pointer",}}
        onClick={() => handleOpen()}
      >
        休診
      </div>
      :
      <div 
        style={{ 
          padding:0,
          borderTop:"1px solid grey", 
          borderRight:"1px solid grey", 
          height: '100%', 
          width: '100%',
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          position: "relative",
          cursor: 'pointer'}}
        onClick={() => handleOpen()}
      >
        <div
          className="custom-date-number print-only"
          style={{
            position: 'absolute',
            top: 2,
            right: 4,
            fontSize: 10,
            color: '#999',
            zIndex: 2
          }}
        >
          {dayjs(value).date()}
        </div>
        {daily && Object.entries(daily).map(([shift, shiftData]) => {
          if (shift === "狀態") return null;
          const eids = shiftData.list || [];
          if (eids.length === 0) return null;

          // const visibleShifts = arr.filter(([key, s]) => key !== "狀態" && s.list?.length > 0);
          // const isLast = shift === visibleShifts[visibleShifts.length - 1]?.[0];

          return (
              <div
                key={shift}
                style={{
                  fontSize: 18,
                  paddingTop: 15,
                  paddingBottom:4,
                  color: "blue",
                  borderBottom: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:"space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", padding:4, height:"25px"}}>
                  <div style={{ width: 25 }}>{shift}:</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {eids.map((id) => {
                        const name = getNameById(id);
                        const category = getCategoryById(id);

                        if (!name || name === "?") return null;
                        return(
                        <LightTooltip key={id} title={getNameById(id)}>
                          <Avatar
                            className='avatar-name'
                            sx={{
                              width: 25,
                              height: 25,
                              fontSize: 14,
                              bgcolor: category === "牙助" ? "#0c90fcff" : "#fa3e7dff",
                              color: "black",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                          >
                            {name[0].toUpperCase()}
                          </Avatar>
                        </LightTooltip>
                      )})}
                    </div>
                  </div>
                {shiftData.hasSurgery ? <div style={{color: "grey", marginRight:4}}>開刀</div>: null}
              </div>
          );
        })}
        {children}
      </div>}
    </>
  );
};
export default CustomDateCell;
