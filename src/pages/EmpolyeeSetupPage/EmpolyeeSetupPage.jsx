import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  TextField, Button, Box,Chip, 
  RadioGroup, FormControlLabel,
  FormLabel, Radio, Avatar
} from '@mui/material';


const EmployeeSetupPage = () => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("牙助");
    const [error, setError] = useState(false);
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("employees");
        try {
            const parsed = stored ? JSON.parse(stored) : [];
            if (Array.isArray(parsed)) {
            setEmployees(parsed);
            } else {
            setEmployees([])
            }
        } catch (err) {
            console.error(err);
            setEmployees([]);
        }
    }, []);
    
    const handleAdd = () => {
        if (!name.trim()) {
            setError(true);
            return;
        }
        const newEmployee = { 
            id: uuidv4(),
            name: name.trim(), 
            category: category
        }
        const updatedList = [...employees, newEmployee];
        setEmployees(updatedList);
        localStorage.setItem("employees", JSON.stringify(updatedList));
        
        setName(""); 
        setCategory("牙助");
        setError(false);
        
    }
    const handleDelete = (eid) => {
        const updatedList = employees.filter((e) => e.id !== eid);
        setEmployees(updatedList);
        localStorage.setItem("employees", JSON.stringify(updatedList));
    }

    return (
        <div style={{ padding: 32, maxWidth: 1000, margin: '0 auto' }}>
            <h2 style={{ marginBottom: 24 }}>員工設定/Employee Setup</h2>

            <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
            <div style={{ flex: 1 }}>
                <h4>牙助/Dental Assistance:</h4>
                <Box display="flex" flexWrap="wrap" gap={1}>
                {employees.filter(e => e.category === "牙助").map((e) => (
                    <Chip
                    avatar={<Avatar 
                            sx={{
                                bgcolor: "lightblue",
                                color: "black"
                            }}>
                            {e.name[0]}
                            </Avatar>}
                    label={e.name}
                    key={e.id}
                    variant="outlined"
                    onDelete={() => handleDelete(e.id)}
                    />
                ))}
                </Box>
            </div>

            <div style={{ flex: 1 }}>
                <h4>櫃台/Front Desk:</h4>
                <Box display="flex" flexWrap="wrap" gap={1}>
                {employees.filter(e => e.category === "櫃台").map((e) => (
                    <Chip
                    avatar={<Avatar 
                            sx={{
                                bgcolor: "pink",
                                color: "black"
                            }}>
                            {e.name[0]}
                            </Avatar>}
                    label={e.name}
                    key={e.id}
                    variant="outlined"
                    onDelete={() => handleDelete(e.id)}
                    />
                ))}
                </Box>
            </div>
            </div>
            <div style={{
            background: "#f9f9f9",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            marginBottom: 24,
            }}>
            <h3>請輸入員工名字和職位/Add New Employee</h3>
            <Box display="flex" alignItems="center" gap={3}>
                <TextField
                label="名字/Name"
                variant="standard"
                value={name}
                placeholder="請輸入員工名字/Employee Name"
                error={error}
                helperText={error ? "名字不能為空" : ""}
                onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setError(false);
                }}
                />

                <RadioGroup row value={category} onChange={(e) => setCategory(e.target.value)}>
                <FormControlLabel value="牙助" control={<Radio />} label="牙助/Dental Assistance" />
                <FormControlLabel value="櫃台" control={<Radio />} label="櫃台/Front Desk" />
                </RadioGroup>

                <Button variant="contained" onClick={handleAdd}>確認/Add</Button>
            </Box>
            </div>

            <Button variant="contained" onClick={() => navigate('/calendar')}>完成/Done</Button>
        </div>
        );
    
}
export default EmployeeSetupPage;