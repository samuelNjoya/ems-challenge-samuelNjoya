import { Form } from "react-router";

interface TimesheetFormProps {
  timesheet?: any;
  employees: any[];
  actionText: string;
  cancelUrl: string;
}

export default function TimesheetForm({ timesheet, employees, actionText, cancelUrl }: TimesheetFormProps) {
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const startTime = form.start_time.value;
    const endTime = form.end_time.value;
    
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (start >= end) {
        e.preventDefault();
        alert("End time must be after start time");
        return false;
      }
    }
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 mb-6">
        
        {/* Employee */}
        <div>
          <label htmlFor="employee_id" className="block mb-2 font-medium text-gray-700">
            Employee <span className="text-red-600">*</span>
          </label>
          <select
            name="employee_id"
            id="employee_id"
            required
            defaultValue={timesheet?.employee_id || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Select an employee</option>
            {employees.map((employee: any) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Time */}
        <div>
          <label htmlFor="start_time" className="block mb-2 font-medium text-gray-700">
            Start Time <span className="text-red-600">*</span>
          </label>
          <input
            type="datetime-local"
            name="start_time"
            id="start_time"
            required
            defaultValue={timesheet?.start_time?.replace(' ', 'T') || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* End Time */}
        <div>
          <label htmlFor="end_time" className="block mb-2 font-medium text-gray-700">
            End Time <span className="text-red-600">*</span>
          </label>
          <input
            type="datetime-local"
            name="end_time"
            id="end_time"
            required
            defaultValue={timesheet?.end_time?.replace(' ', 'T') || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <small className="text-xs text-gray-600 mt-1 block">
            Must be after start time
          </small>
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block mb-2 font-medium text-gray-700">
            Work Summary
          </label>
          <textarea
            name="summary"
            id="summary"
            rows={4}
            placeholder="Describe the work performed..."
            defaultValue={timesheet?.summary || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-vertical"
          />
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-5">
        <span className="text-red-600">*</span> Required fields
      </p>

      <div className="flex gap-3 mb-5">
        <button
          type="submit"
          className="px-8 py-2.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
        >
          {actionText}
        </button>
        <a
          href={cancelUrl}
          className="px-8 py-2.5 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors inline-block no-underline"
        >
          Cancel
        </a>
      </div>
    </Form>
  );
}