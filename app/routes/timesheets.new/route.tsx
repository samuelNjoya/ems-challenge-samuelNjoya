import { useLoaderData, redirect, useNavigation } from "react-router";
import { getDB } from "~/db/getDB";
import TimesheetForm from "~/components/TimesheetForm";
import Spinner from "~/components/Spinner";
import type { ActionFunction } from "react-router";

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees ORDER BY full_name');
  return { employees };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary") || null;

  const db = await getDB();
  
  await db.run(
    'INSERT INTO timesheets (employee_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)',
    [employee_id, start_time, end_time, summary]
  );
  
  return redirect("/timesheets");
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="p-5 max-w-3xl mx-auto">
      {isSubmitting && <Spinner message="Creating timesheet..." />}

      <h1 className="text-2xl font-bold mb-5 text-gray-800">Create New Timesheet</h1>

      <TimesheetForm 
        employees={employees}
        actionText="Create Timesheet"
        cancelUrl="/timesheets"
      />

      <div className="flex gap-4 mt-8">
        <a href="/timesheets" className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors no-underline inline-block">
          Timesheets
        </a>
        <a href="/employees" className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors no-underline inline-block">
          Employees
        </a>
      </div>
    </div>
  );
}