import React, { useState, useRef, useEffect } from "react";
import "./calendar.css";
import { jwtDecode } from "jwt-decode";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date()); // Mes actual
    const [availability, setAvailability] = useState({});
    const [selectedDay, setSelectedDay] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [selectedHours, setSelectedHours] = useState([]);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startHour, setStartHour] = useState(null);
    const [currentHoverHour, setCurrentHoverHour] = useState(null);
    const hourGridRef = useRef(null);

    // Generar horas con timestamps para facilitar la comparación
    const generateHours = () => {
        const hours = [];
        for (let hour = 8; hour <= 20; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour}:${minute === 0 ? "00" : minute}`;
                const timestamp = hour * 100 + minute;
                hours.push({
                    value: time,
                    label: hour > 12 
                        ? `${hour - 12}:${minute === 0 ? "00" : minute} PM` 
                        : `${hour}:${minute === 0 ? "00" : minute} AM`,
                    timestamp
                });
            }
        }
        return hours;
    };

    const handleMouseDown = (hour) => {
        setIsMouseDown(true);
        setStartHour(hour);
        toggleHour(hour);
    };

    const handleMouseEnter = (hour) => {
        if (isMouseDown) {
            setCurrentHoverHour(hour);
            selectRange(startHour, hour);
        }
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
        setStartHour(null);
        setCurrentHoverHour(null);
    };

    const selectRange = (start, end) => {
        const hours = generateHours();
        const startIndex = hours.findIndex(h => h.value === start);
        const endIndex = hours.findIndex(h => h.value === end);
        
        const min = Math.min(startIndex, endIndex);
        const max = Math.max(startIndex, endIndex);
        
        const range = hours.slice(min, max + 1).map(h => h.value);
        const newSelection = Array.from(new Set([...selectedHours, ...range]));
        
        setSelectedHours(newSelection);
    };

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
        if (isPastDay(day)) return;
        setSelectedDay(day);
        const dateKey = createDateKey(day);
        setSelectedAvailability(availability[dateKey]?.status ?? null);
        setSelectedHours(availability[dateKey]?.hours || []);
        setIsModalOpen(true);
    };

    const accessToken = localStorage.getItem('access_token');
    let decodedToken = null;
    let userId = '';

    if (accessToken) {
        try {
            decodedToken = jwtDecode(accessToken);
            userId = decodedToken.manicurist_id || '';
        } catch (error) {
            console.error('Error decoding token:', error);
            // Handle the error, e.g., redirect to login or show a message
        }
    } else {
        console.error('No access token found');
        // Handle the case where there is no access token, e.g., redirect to login or show a message
    }

    // Guardar la disponibilidad seleccionada
    const handleSave = async () => {
        if (selectedDay === null) return;
        const dateKey = createDateKey(selectedDay);
    
        const newAvailability = {
            date: dateKey,
            status: selectedAvailability,
            hours: selectedAvailability ? selectedHours : [],
        };
    
        try {
            // Obtener el ID del manicurista (userId)
            const manicuristaId = Number(userId);
    
            // Obtener el horario actual del manicurista
            const responseGet = await fetch(`http://127.0.0.1:8000/api/Manicurists/${manicuristaId}/`);
            const manicuristData = await responseGet.json();
    
            // Actualizar el horario disponible
            const updatedHorario = {
                ...manicuristData.horario_disponible,
                [dateKey]: newAvailability,
            };
    
            // Enviar la actualización al backend
            const responseUpdate = await fetch(`http://127.0.0.1:8000/api/Manicurists/${manicuristaId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    horario_disponible: updatedHorario,
                }),
            });
    
            if (responseUpdate.ok) {
                // Actualizar el estado availability en el frontend
                setAvailability((prevAvailability) => ({
                    ...prevAvailability,
                    [dateKey]: newAvailability,
                }));
    
                setIsModalOpen(false);
            } else {
                console.error('Error saving availability');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Crear clave única para el día
    const createDateKey = (day) =>
        `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;

    // Alternar selección de una hora
    const toggleHour = (hour) => {
        setSelectedHours(prev => {
            if (prev.includes(hour)) {
                return prev.filter(h => h !== hour);
            }
            return [...prev, hour];
        });
    };

        // ==============================================
    // 1. useEffect para cargar disponibilidad inicial
    // ==============================================
    useEffect(() => {
        const loadAvailability = async () => {
            try {
                const manicuristaId = Number(userId);
                const response = await fetch(`http://127.0.0.1:8000/api/Manicurists/${manicuristaId}/`);
                
                if (response.ok) {
                    const manicuristData = await response.json();
                    setAvailability(manicuristData.horario_disponible || {});
                }
            } catch (error) {
                console.error('Error loading availability:', error);
            }
        };

        if (userId) loadAvailability();
    }, [userId]); // Se ejecuta al cambiar userId

    // Efecto para manejar eventos globales del mouse
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isMouseDown) {
                handleMouseUp();
            }
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);
        return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isMouseDown]);

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

                {generateCalendarDays().map(({ day, isPast }, index) => {
                    const dateKey = createDateKey(day);
                    const isAvailable = availability[dateKey]?.status;

                    return (
                        <article
                            key={day || `empty-${index}`}
                            className={`day ${isPast ? "past" : isAvailable ? "available" : "unavailable"}`}
                            onClick={() => !isPast && handleDayClick(day)}
                        >
                            {day}
                        </article>
                    );
                })}
            </article>

            {/* Modal para seleccionar disponibilidad */}
            {isModalOpen && (
                <article className="modal-overlay">
                    <article className="modal">
                        <h3>Disponibilidad para el {selectedDay} de {currentDate.toLocaleString("default", { month: "long" })}</h3>

                        <article className="availability-toggle">
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

                        {selectedAvailability && (
                            <article className="hour-selection">
                                <h4>Selecciona las horas disponibles:</h4>
                                <article 
                                    className="hour-grid"
                                    ref={hourGridRef}
                                    onMouseLeave={() => handleMouseUp()}
                                >
                                    {generateHours().map((hour) => (
                                        <article
                                            key={hour.value}
                                            className={`hour-btn ${
                                                selectedHours.includes(hour.value) ? "selected" : ""
                                            } ${currentHoverHour === hour.value ? "hovered" : ""}`}
                                            onMouseDown={() => handleMouseDown(hour.value)}
                                            onMouseEnter={() => handleMouseEnter(hour.value)}
                                            onMouseUp={handleMouseUp}
                                        >
                                            {hour.label}
                                        </article>
                                    ))}
                                </article>
                            </article>
                        )}

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