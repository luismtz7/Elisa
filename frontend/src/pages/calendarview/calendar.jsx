import React, { useState } from "react";
import "./calendar.css";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 2)); // Marzo 2025
    const [availability, setAvailability] = useState({});

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const isPastDay = (day) => {
        const today = new Date();
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };

    const generateCalendarDays = () => {
        const totalDays = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        
        // Crear celdas vacías iniciales
        for(let i = 0; i < firstDay; i++) {
            days.push({ day: null, isPast: false });
        }

        // Llenar días del mes
        for(let day = 1; day <= totalDays; day++) {
            days.push({ day, isPast: isPastDay(day) });
        }

        return days;
    };

    const handleDayClick = (day) => {
        if (isPastDay(day)) return;
        const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
        setAvailability(prev => ({ ...prev, [dateKey]: !prev[dateKey] }));
    };

    return (
        <div className="calendar">
            <div className="month-header">
                <button onClick={() => changeMonth(-1)}>&lt;</button>
                <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
                <button onClick={() => changeMonth(1)}>&gt;</button>
            </div>

            <div className="calendar-grid">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="weekday">{day}</div>
                ))}
                
                {generateCalendarDays().map(({ day, isPast }, index) => (
                    <div 
                        key={day || `empty-${index}`}
                        className={`day ${isPast ? 'past' : availability[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`] ? 'available' : 'unavailable'}`}
                        onClick={() => !isPast && handleDayClick(day)}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export { Calendar };