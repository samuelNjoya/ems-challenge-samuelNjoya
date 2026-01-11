import { useLoaderData } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { getDB } from "~/db/getDB";
import { Temporal } from '@js-temporal/polyfill';

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name FROM timesheets JOIN employees ON timesheets.employee_id = employees.id ORDER BY timesheets.start_time DESC"
  );
  const employees = await db.all(
    "SELECT DISTINCT employees.id, employees.full_name FROM employees JOIN timesheets ON employees.id = timesheets.employee_id ORDER BY employees.full_name"
  );
  return { timesheetsAndEmployees, employees };
}

// Format date for display
function formatDateTime(dateTimeString: string) {
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees, employees } = useLoaderData();
  const [isTableView, setIsTableView] = useState(true);
  const [calendarLoaded, setCalendarLoaded] = useState(false);
  const [calendarError, setCalendarError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTimesheets = useMemo(() => {
    let result = [...timesheetsAndEmployees];

    if (searchTerm) {
      result = result.filter((ts: any) =>
        ts.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ts.summary && ts.summary.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterEmployee !== "all") {
      result = result.filter((ts: any) => String(ts.employee_id) === filterEmployee);
    }

    return result;
  }, [timesheetsAndEmployees, searchTerm, filterEmployee]);

  const totalPages = Math.ceil(filteredTimesheets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTimesheets = filteredTimesheets.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilter = (value: string) => {
    setFilterEmployee(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!isTableView && !calendarLoaded) {
      let isMounted = true;

      const loadCalendar = async () => {
        try {
          const [calendarModule, reactModule] = await Promise.all([
            import('@schedule-x/calendar'),
            import('@schedule-x/react')
          ]);

          await import('@schedule-x/theme-default/dist/index.css');

          if (!isMounted) return;

          const { createCalendar, createViewWeek, createViewMonthGrid } = calendarModule;

          // Convert database dates to Temporal.ZonedDateTime
          // const calendarEvents = timesheetsAndEmployees.map((timesheet: any) => {
          //   // Format: "2026-01-06 08:00:00" -> "2026-01-06T08:00:00"
          //   const startISO = timesheet.start_time.replace(' ', 'T');
          //   const endISO = timesheet.end_time.replace(' ', 'T');
            
          //   // Create Temporal.ZonedDateTime with timezone (Africa/Douala for Cameroon)
          //   const startZoned = Temporal.PlainDateTime.from(startISO).toZonedDateTime('Africa/Douala');
          //   const endZoned = Temporal.PlainDateTime.from(endISO).toZonedDateTime('Africa/Douala');

          //   return {
          //     id: String(timesheet.id),
          //     title: `${timesheet.full_name}${timesheet.summary ? ' - ' + timesheet.summary : ''}`,
          //     start: startZoned,
          //     end: endZoned,
          //   };
          // });

          // const calendar = createCalendar({
          //   views: [createViewWeek(), createViewMonthGrid()],
          //   events: calendarEvents,
          //   defaultView: 'week',
          // });

          const calendarEvents = timesheetsAndEmployees.map((timesheet: any) => {
  // Le format attendu par Schedule-X est "YYYY-MM-DD HH:mm"
  // Si tes dates en DB sont "2026-01-06 08:00:00", on garde les 16 premiers caractères.
  const start = timesheet.start_time.substring(0, 16); 
  const end = timesheet.end_time.substring(0, 16);

  return {
    id: String(timesheet.id),
    title: `${timesheet.full_name}${timesheet.summary ? ' - ' + timesheet.summary : ''}`,
    start: start, // On passe la string directement
    end: end,     // On passe la string directement
  };
});

const calendar = createCalendar({
  views: [createViewWeek(), createViewMonthGrid()],
  events: calendarEvents,
  defaultView: 'week',
  // On gère la timezone globalement ici plutôt que par événement
  timeZone: 'Africa/Douala', 
});

          const calendarContainer = document.getElementById('calendar-container');
          if (calendarContainer) {
            calendar.render(calendarContainer);
            setCalendarLoaded(true);
          }
        } catch (error:any) {
          console.error("Error loading calendar:", error);
          setCalendarError(error.message);
        }
      };

      loadCalendar();

      return () => {
        isMounted = false;
      };
    }
  }, [isTableView, calendarLoaded, timesheetsAndEmployees]);

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Timesheets</h1>
        
        <div className="flex gap-3">
          <a href="/timesheets/new" className="px-5 py-2.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors no-underline">
            New Timesheet
          </a>
          <a href="/employees" className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors no-underline">
            Employees
          </a>
        </div>
      </div>

      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setIsTableView(true)}
          className={`px-5 py-2.5 rounded-md font-medium transition-colors ${
            isTableView ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => setIsTableView(false)}
          className={`px-5 py-2.5 rounded-md font-medium transition-colors ${
            !isTableView ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Calendar View
        </button>
      </div>

      {isTableView ? (
        <div>
          <div className="flex gap-3 mb-5 flex-wrap">
            <input
              type="text"
              placeholder="Search (employee, summary)..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            
            <select
              value={filterEmployee}
              onChange={(e) => handleFilter(e.target.value)}
              className="min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="all">All Employees</option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3 text-sm text-gray-600">
            {filteredTimesheets.length} timesheet(s) found
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left border-b-2 border-gray-300">Employee</th>
                  <th className="px-4 py-3 text-left border-b-2 border-gray-300">Start</th>
                  <th className="px-4 py-3 text-left border-b-2 border-gray-300">End</th>
                  <th className="px-4 py-3 text-left border-b-2 border-gray-300">Summary</th>
                  <th className="px-4 py-3 text-center border-b-2 border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTimesheets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-5 text-center text-gray-400">No timesheets found</td>
                  </tr>
                ) : (
                  paginatedTimesheets.map((timesheet: any) => (
                    <tr key={timesheet.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{timesheet.full_name}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDateTime(timesheet.start_time)}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDateTime(timesheet.end_time)}</td>
                      <td className="px-4 py-3 text-gray-700">{timesheet.summary || "-"}</td>
                      <td className="px-4 py-3 text-center">
                        <a href={`/timesheets/${timesheet.id}`} className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors no-underline inline-block">
                          View
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex justify-center items-center gap-3">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {calendarError ? (
            <div className="p-5 bg-red-100 text-red-800 border border-red-300 rounded-md">
              <strong>Error:</strong> {calendarError}
              <br />
              <button
                onClick={() => {
                  setCalendarError(null);
                  setCalendarLoaded(false);
                }}
                className="mt-3 px-4 py-1.5 bg-red-800 text-white rounded text-sm hover:bg-red-900 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div id="calendar-container" className="border border-gray-300 rounded-md overflow-hidden min-h-[600px]">
              {!calendarLoaded && (
                <div className="flex justify-center items-center h-[600px] text-gray-600 text-base">
                  Loading calendar...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}