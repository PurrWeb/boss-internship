import React from "react"
import StaffDay from "./containers/staff-day"

export default class HoursConfirmationApp extends React.Component {
    render(){
        return <StaffDay />;

        return <div>
            <HoursChart
                clockedEvents={events}
                clockedIntervals={intervals}
                rotaedShifts={shifts}
                hoursAssignments={window.hoursAssignments}
                rotaDate={new RotaDate({shiftStartsAt: new Date(2016, 10, 1, 8, 0),})} />
        </div>
    }
}