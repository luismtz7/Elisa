import React, { useState } from "react";
import "./calendar.css";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date()); // Mes actual
    const [availability, setAvailability] = useState({});
    const [selectedDay, setSelectedDay] = useState(null); // Día seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
    const [selectedAvailability, setSelectedAvailability] = useState(null); // Disponibilidad seleccionada en el modal

    // Cambiar de mes
    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    // Obtener los días del mes
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // Obtener el primer día del mes
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    // Verificar si un día es anterior al día actual
    const isPastDay = (day) => {
        const today = new Date();
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };

    // Generar los días del mes
    const generateCalendarDays = () => {
        const totalDays = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Crear celdas vacías iniciales
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null, isPast: false });
        }

        // Llenar días del mes
        for (let day = 1; day <= totalDays; day++) {
            days.push({ day, isPast: isPastDay(day) });
        }

        return days;
    };

    // Manejar clic en un día
    const handleDayClick = (day) => {
        if (isPastDay(day)) return; // No hacer nada si es un día pasado
        setSelectedDay(day); // Guardar el día seleccionado
        setSelectedAvailability(availability[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`]); // Cargar disponibilidad actual
        setIsModalOpen(true); // Abrir el modal
    };

    // Guardar la disponibilidad seleccionada
    const handleSave = () => {
        if (selectedDay === null) return;
        const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
        setAvailability((prev) => ({
            ...prev,
            [dateKey]: selectedAvailability,
        }));
        setIsModalOpen(false); // Cerrar el modal
    };

    return (
        <article className="calendar">
            {/* Encabezado del mes */}
            <article className="month-header">
                <button onClick={() => changeMonth(-1)}>&lt;</button>
                <h2>{currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}</h2>
                <button onClick={() => changeMonth(1)}>&gt;</button>
            </article>

            {/* Cuadrícula del calendario */}
            <article className="calendar-grid">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <article key={day} className="weekday">
                        {day}
                    </article>
                ))}

                {generateCalendarDays().map(({ day, isPast }, index) => (
                    <article
                        key={day || `empty-${index}`}
                        className={`day ${isPast ? "past" : availability[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`] ? "available" : "unavailable"}`}
                        onClick={() => !isPast && handleDayClick(day)}
                    >
                        {day}
                    </article>
                ))}
            </article>

            {/* Modal para seleccionar disponibilidad */}
            {isModalOpen && (
                <article className="modal-overlay">
                    <article className="modal">
                        <h3>Seleccionar disponibilidad para el día {selectedDay}</h3>
                        <article className="modal-options">
                            <label>
                                <input
                                    type="radio"
                                    name="availability"
                                    checked={selectedAvailability === true}
                                    onChange={() => setSelectedAvailability(true)}
                                />
                                Disponible
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="availability"
                                    checked={selectedAvailability === false}
                                    onChange={() => setSelectedAvailability(false)}
                                />
                                No disponible
                            </label>
                        </article>
                        <article className="modal-actions">
                            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            <button onClick={handleSave}>Guardar</button>
                        </article>
                    </article>
                </article>
            )}
        </article>
    );
};

export { Calendar };