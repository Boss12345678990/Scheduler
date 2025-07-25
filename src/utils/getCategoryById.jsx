const getCategoryById = (id) =>{
    const employeeList = JSON.parse(localStorage.getItem("employees"));
    const employee = employeeList.find(e => e.id === id);
    return employee? employee.category : "?";
}

export default getCategoryById;