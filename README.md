# Dental Clinic Scheduler

A web-based scheduling system designed for a dental clinic to assign staff (Dental Assistants and Front Desk) to shifts (Morning, Afternoon, Evening) on a calendar view. Built to simplify and visualize the clinic's daily workforce planning.

## Demos
<img src="./src/assets/emloyee_setup_demo.gif" alt="Setup_demo" width="700" />
<img src="./src/assets/schedule_demo.gif" alt="Schedule_demo" width="700" />

## Features

- Interactive monthly calendar with printing support
- Employee setup page for adding/removing staff
- Smart validation:
  - Warns if no dental assistants are scheduled
  - Enforces at least 2 assistants for surgery shifts
- Local storage persistence
- **OpenAI API integration**:
  - Summarizes monthly employee work hours
  - Lists closed days and highlights staff who reached 160 hour

## Technologies Used

- **React** – component-based UI
- **Material UI** – design system for modern UI
- **react-big-calendar** – calendar component
- **localStorage** – persist schedule and employee data
- **OpenAI API** – for AI-generated shift summaries

## Motivation
This scheduler was built to help manage staff assignments at my mom's dental clinic. It aims to reduce miscommunication, ensure surgery readiness, and provide a printable daily view of assignments.

## Future Improvements
1. Admin login
2. Backend database integration
3. Mobile-friendly responsive layout

	
    
