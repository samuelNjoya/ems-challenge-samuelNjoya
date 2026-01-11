import { useLoaderData, type ActionFunction, useNavigation } from "react-router"
import { getDB } from "~/db/getDB"
import TimesheetForm from "~/components/TimesheetForm";
import Spinner from "~/components/Spinner";
import Toast from "~/components/Toast";
import { useState, useEffect } from "react";

export async function loader({ params }: any) {
  const db = await getDB()
  
  const timesheet = await db.get(
    `SELECT timesheets.*, employees.full_name, employees.job_title 
     FROM timesheets 
     JOIN employees ON timesheets.employee_id = employees.id 
     WHERE timesheets.id = ?`,
    [params.timesheetId]
  )
  
  if (!timesheet) {
    throw new Response("Timesheet not found", { status: 404 })
  }
  
  const employees = await db.all('SELECT id, full_name FROM employees ORDER BY full_name');
  
  return { timesheet, employees }
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary") || null;

  const db = await getDB();
  
  await db.run(
    `UPDATE timesheets 
     SET employee_id = ?, start_time = ?, end_time = ?, summary = ?
     WHERE id = ?`,
    [employee_id, start_time, end_time, summary, params.timesheetId]
  );
  
  const timesheet = await db.get(
    `SELECT timesheets.*, employees.full_name, employees.job_title 
     FROM timesheets 
     JOIN employees ON timesheets.employee_id = employees.id 
     WHERE timesheets.id = ?`,
    [params.timesheetId]
  );
  const employees = await db.all('SELECT id, full_name FROM employees ORDER BY full_name');
  
  return { success: true, timesheet, employees };
};

export default function TimesheetPage() {
  const loaderData = useLoaderData();
  const timesheet = loaderData.timesheet;
  const employees = loaderData.employees;
  const [isEditing, setIsEditing] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const start = new Date(timesheet.start_time)
  const end = new Date(timesheet.end_time)
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

  useEffect(() => {
    if (navigation.state === "idle" && isSubmitting === false && isEditing) {
      setIsEditing(false);
      setShowToast(true);
    }
  }, [navigation.state]);

  return (
    <div className="p-5 max-w-4xl mx-auto">
      {isSubmitting && <Spinner message="Updating timesheet..." />}
      {showToast && <Toast message="Timesheet updated successfully!" type="success" onClose={() => setShowToast(false)} />}

      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        {isEditing ? "Edit Timesheet" : "Timesheet Details"}
      </h1>

      {!isEditing ? (
        <>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-5">
            <div className="border-b-2 border-blue-600 pb-4 mb-6">
              <h2 className="text-xl font-bold text-blue-600 m-0">{timesheet.full_name}</h2>
              <p className="text-gray-600 mt-1 mb-0">{timesheet.job_title}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">Start Date & Time</label>
                <p className="mt-1 text-base text-gray-800">{timesheet.start_time}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600">End Date & Time</label>
                <p className="mt-1 text-base text-gray-800">{timesheet.end_time}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600">Duration</label>
                <p className="mt-1 text-base text-gray-800">
                  {durationHours.toFixed(1)} hour{durationHours > 1 ? 's' : ''}
                </p>
              </div>

              {timesheet.summary && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600">Work Summary</label>
                  <p className="mt-1 text-sm p-3 bg-white border border-gray-200 rounded text-gray-800">
                    {timesheet.summary}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2.5 bg-yellow-500 text-gray-900 rounded-md text-sm font-medium hover:bg-yellow-600 transition-colors mb-8"
          >
            Edit Timesheet
          </button>
        </>
      ) : (
        <>
          <TimesheetForm 
            timesheet={timesheet}
            employees={employees}
            actionText="Save Changes"
            cancelUrl={`/timesheets/${timesheet.id}`}
          />
        </>
      )}

      <div className="flex gap-4">
        <a href="/timesheets" className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors no-underline inline-block">
          Timesheets
        </a>
        <a href="/timesheets/new" className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors no-underline inline-block">
          New Timesheet
        </a>
        <a href="/employees" className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors no-underline inline-block">
          Employees
        </a>
      </div>
    </div>
  )
}