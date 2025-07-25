import getCategoryById from "./getCategoryById";

const verifyNotification = (schedule, employeeList) => {
  let totalDentalAssistance = 0;
  let count = employeeList.filter(e => e.category === "牙助").length;
  for (const shift in schedule) {
    if (shift === "狀態"){
      if(schedule[shift] === "休診") {
        return true;
      }
      continue;
    }
    let dentalAssistance = 0;
    const {list, hasSurgery} = schedule[shift];
    for (const employeeId of list) {
        if (getCategoryById(employeeId) === "牙助"){
          dentalAssistance += 1;
          totalDentalAssistance += 1;
        }
    }
    if( hasSurgery && count >= 2 && dentalAssistance < 2){
      alert(`${shift}時段有手術，請安排至少兩位牙助`);
      return false;
    }
  }
  if (totalDentalAssistance === 0){
    return window.confirm("確定不安排牙助？");
  }
  return true;
}
export default verifyNotification;