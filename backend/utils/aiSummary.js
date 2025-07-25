import { OpenAI } from "openai";
import dotenv from 'dotenv';
dotenv.config();


const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY, 
});

const getSummary = async (workDate, employees) => {

  const empMap = Object.fromEntries(employees.map(e => [e.id, { ...e, hours: 0 }]));
  const closedDates = [];

  for (const [date, schedule] of Object.entries(workDate)) {
    if (schedule.狀態 === "休診") {
      closedDates.push(date);
      continue;
    }
    for (const shift of ["早", "午", "晚"]) {
      const hours = shift === "早" || shift === "午" ? 2 : 4;
      for (const id of schedule[shift].list || []) {
        if (empMap[id]) empMap[id].hours += hours;
      }
    }
  }

  const summary = `Date Summary: 休診日期: ${closedDates.join(", ")} Employee Hours:
                ${Object.values(empMap)
                .map(e => `${e.name} (${e.category}): ${e.hours} 小時`)
                .join("\n")}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "你是一個牙科助理排班統計分析助手。" },
      { role: "user", content: `以下是診所的排班摘要:\n${summary}\n請幫我用條理清晰的方式總結出誰達到160小時,以及簡要說明。` }
    ],
  });
  return response.choices[0].message.content;
};

export default getSummary;