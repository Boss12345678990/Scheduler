import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import CustomDateCell from '../../components/CustomDateCell';
import { Button, Dialog, DialogTitle, RadioGroup, FormControlLabel, Radio, Avatar, Checkbox } from '@mui/material';
import zhCN from 'date-fns/locale/zh-CN';
import { useNavigate } from 'react-router-dom';
import LightTooltip from '../../components/LightTooltip';
import verifyNotification from '../../utils/verifyNotification';
import html2pdf from "html2pdf.js";
import './CalendarPage.css';
// import getSummary from '../../utils/getSummary';


const locales = {
  'zh-CN': zhCN,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
}); 

const CalendarPage = () => {
  const employeeList = JSON.parse(localStorage.getItem("employees"));
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [workDate, setWorkDate] = useState({});
  const [dailySchedule, setDailySchedule] = useState(
    { "早": { list:[], hasSurgery: false }, 
      "午": { list:[], hasSurgery: false }, 
      "晚": { list:[], hasSurgery: false }, 
      "狀態": "營業" 
    });
  const [loading, serLoading] = useState(false);
  
  const isAssigned = (slot, id) => dailySchedule?.[slot]?.list?.includes?.(id) ?? false;

  useEffect(() => {
    window.readyToPrint = true;
    const storedWorkDate = localStorage.getItem("workDate");
    try 
    {
      const parsedWorkDate = storedWorkDate ? JSON.parse(storedWorkDate) : {};

      if (parsedWorkDate && typeof parsedWorkDate === "object") {
        setWorkDate(parsedWorkDate);
      } 
      else {
        setWorkDate({});
      }
      } 
      catch (err) {
        console.error("Failed to load from localStorage:", err);
        setWorkDate({});
      }
  }, []);
  
  useEffect(() => {
    const validIds = new Set(employeeList.map(e => e.id));
    const newSchedule = {};

    let hasChanged = false;

    for (const date in workDate) {
      const originalShifts = workDate[date];
      const updatedShifts = { ...originalShifts };

      ["早", "午", "晚"].forEach((shift) => {
        if (originalShifts[shift]) {
          const originalList = originalShifts[shift].list || [];
          const filteredList = originalList.filter(id => validIds.has(id));
          updatedShifts[shift] = { ...originalShifts[shift], list: filteredList };

          if (filteredList.length !== originalList.length) {
            hasChanged = true;
          }
        }
      });

      newSchedule[date] = updatedShifts;
    }

    if (hasChanged) {
      setWorkDate(newSchedule);
    }
  }, [employeeList]);

  const assignToEmpolyee = (id, timeSlot) => {
    setDailySchedule(prev => {
      const cur = prev[timeSlot].list || [];
      const newSlot = cur.includes(id)
        ? cur.filter(i => i !== id)
        : [...cur, id];
      return { ...prev, [timeSlot]: {...prev[timeSlot], list: newSlot} };
    });
  };

  const handleSubmit = (date) => {

    if (!verifyNotification(dailySchedule, employeeList)) {
      return;
    }
    setWorkDate(prev => {
        const updated = {
        ...prev,
        [date]: dailySchedule,
      };
      localStorage.setItem("workDate", JSON.stringify(updated));

      return updated;
    });
    setOpen(false);
  }

  const handleGetSummary = async () => {
    serLoading(true);
    try{
      const response = await axios.post("http://localhost:3000/summary", {
        workDate,
        employeeList
      })
      
      alert(response.data.summary);
    }
    catch (err){
      console.error("Failed to get summary:", err);
      alert("總結失敗，請稍後再試。");
    }
    finally{
      serLoading(false);
    }
  
};

/*style={{ height: 'calc(100vh - 40px)', padding: '20px' }}*/
// style={{ maxWidth: "1900px", maxHeight: "940px", width:"100%", height:"100%" }
// style={{ minWidth: "1900px", minHeight: "100vh", width:"100%", height:"100%" }}
  return (
    <>
    <div id="calendar-print-title" style={{ display: "none" }}></div>
    <div id='calendar-container' style={{ width:"1900px", height:"940px" }}>
      <Calendar
        id='calendar-body'
        localizer={localizer}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        messages={{
          next: '下一個',
          previous: '上一個',
          today: '今天',
          month: '月',
          week: '週',
          day: '日',
          agenda: '行程',
          date: '日期',
          time: '時間',
          event: '事件',
          noEventsInRange: '此範圍內沒有任何事件',
        }}
        formats={{
          weekdayFormat: (date) => format(date, 'EEE', { locale: zhCN }),
          monthHeaderFormat: (date) => format(date, 'yyyy年 M月', { locale: zhCN }),
        }}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month', 'week', 'day']}
        style={{ height: '100%',width: '100%', border:"1px solid grey"}}
        components={{
        month: {
          dateCellWrapper: (props) => (
            <CustomDateCell {...props} 
            currentMonth={currentDate} 
            setOpen={setOpen} 
            setSelectedDate={setSelectedDate} 
            workDate={workDate} 
            setDailySchedule={setDailySchedule} />
        )}}
    }
      />
      <Dialog open={open} onClose={() => {setOpen(false); setDailySchedule({ "早": [], "午": [], "晚": [], "狀態": "營業" })}}>
        <DialogTitle>分配 {selectedDate} 的排班</DialogTitle>

        <div className="dialog-body" style={{ padding: 16 }}>
          <div className="radio-group" style={{ display: "flex", marginBottom: 16 }}>
            <RadioGroup row value={dailySchedule.狀態} onChange={(e)=> setDailySchedule(prev => ({ ...prev, 狀態: e.target.value}))}>
              <FormControlLabel value="營業" control={<Radio />} label="營業" />
              <FormControlLabel value="休診" control={<Radio />} label="休診" />
            </RadioGroup>
          </div>
          {dailySchedule.狀態 === "營業"?<>
            {["早", "午", "晚"].map((s) => (
              <div key={s} className="shift"style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 12,
                backgroundColor: "#f9f9f9",
                borderRadius: 8,
                padding: "6px 10px"
              }}>
                <div style={{ width: 30, fontWeight: "bold" }}>{s}:</div>
                <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
                  <FormControlLabel
                      control={
                        <Checkbox
                          checked={dailySchedule[s].hasSurgery}
                          onChange={(e) =>
                            setDailySchedule(prev => ({
                              ...prev,
                              [s]: { ...prev[s], hasSurgery: e.target.checked }
                            }))
                          }
                        />
                      }
                      label="手術時段"
                  />
                  <div style={{ width: 40 }}>牙助:</div>
                  {employeeList.filter(e => e.category === "牙助").map((e) => (
                    <LightTooltip title={e.name} key={e.id}>
                      <Avatar
                        onClick={() => assignToEmpolyee(e.id,s)}
                        sx={{
                          width: 25,
                          height: 25,
                          fontSize: 12,
                          bgcolor:  isAssigned(s, e.id)? "lightblue":"rgba(173, 216, 230, 0.4)",
                          color: isAssigned(s, e.id)?'black':"grey",
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          ml: 0.5
                        }}
                      >
                        {e.name[0].toUpperCase()}
                      </Avatar>
                    </LightTooltip>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", marginLeft: 16 }}>
                  <div style={{ width: 40 }}>櫃台:</div>
                  {employeeList.filter(e => e.category === "櫃台").map((e) => (
                    <LightTooltip title={e.name} key={e.id}>
                      <Avatar
                        onClick={() => assignToEmpolyee(e.id,s)}
                        sx={{
                          width: 25,
                          height: 25,
                          fontSize: 12,
                          bgcolor: isAssigned(s, e.id)? "pink": "rgba(255, 192, 203, 0.4)",
                          color: isAssigned(s, e.id)? 'black': "grey",
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          ml: 0.5
                        }}
                      >
                        {e.name[0].toUpperCase()}
                      </Avatar>
                    </LightTooltip>
                  ))}
                </div>
              </div>
            ))}</>  : null}
          </div>
          <div style={{display: "flex",
                      alignItems: "center",
                      justifyContent:"center",
                      paddingBottom:20}}>
            <Button variant="contained" onClick={() => handleSubmit(selectedDate)}>
              確認
            </Button>
          </div>
      </Dialog>
      <div id="button-group" style={{  display:"flex", gap: 8 }}>
        <Button
          variant="outlined"
          onClick={() => {
            const buttons = document.getElementById("button-group");
            const toolbar = document.querySelector(".rbc-toolbar");
            const titleDiv = document.getElementById("calendar-print-title");
            const title = `${currentDate.getMonth() + 1}月排班表`;

            if (titleDiv) {
              titleDiv.innerText = title;
              titleDiv.style.display = "block";
              titleDiv.style.fontSize = "15px";
              titleDiv.style.textAlign = "center";
              titleDiv.style.marginBottom = "12px";
            }

            buttons.style.display = "none";
            if (toolbar) toolbar.style.display = "none";

            document.body.classList.add("print-mode");

            html2pdf()
              .from(document.body)
              .set({
                jsPDF: { unit: "mm", format: [400, 300], orientation: "landscape" },
                html2canvas: { scale: 5 },
                margin: 0,
                filename: "scheduler.pdf",
              })
              .save()
              .then(() => {
                buttons.style.display = "flex";
                if (toolbar) toolbar.style.display = "flex";
                document.body.classList.remove("print-mode");
                if (titleDiv) titleDiv.style.display = "none"
              });
          }}
        >
          列印排班表 / Print
        </Button>

        <Button variant="outlined" onClick={() => navigate('/')}>
          編輯員工 / Edit Employees
        </Button>
        <Button variant="contained" onClick={handleGetSummary} disabled={loading}>
          {loading ? "總結中…" : "總結工作資訊 /	Generate Work Summary "}
        </Button>
      </div>
    </div>
    </>
  );
};

export default CalendarPage;