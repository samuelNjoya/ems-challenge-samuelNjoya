import { Form } from "react-router";

interface EmployeeFormProps {
  employee?: any;
  actionText: string;
  cancelUrl: string;
}

export default function EmployeeForm({ employee, actionText, cancelUrl }: EmployeeFormProps) {
  
  const handleSubmit = (e: any) => {
    const form = e.currentTarget;
    const dateOfBirth = form.date_of_birth.value;
    const salary = parseFloat(form.salary.value);
    const startDate = form.start_date.value;
    const endDate = form.end_date.value;
    
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      if (age < 18) {
        e.preventDefault();
        alert("Employee must be at least 18 years old");
        return false;
      }
    }
    
    const MINIMUM_SALARY = 36000;
    if (salary < MINIMUM_SALARY) {
      e.preventDefault();
      alert(`Salary must be at least ${MINIMUM_SALARY.toLocaleString('en-US')} FCFA`);
      return false;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        e.preventDefault();
        alert("End Date must be after start Date");
        return false;
      }
    }
  };

  return (
    <Form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
        
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block mb-2 font-medium text-gray-700">
            Full Name <span className="text-red-600">*</span>
          </label>
          <input 
            type="text" 
            name="full_name" 
            id="full_name" 
            required 
            defaultValue={employee?.full_name || ""} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
            Email <span className="text-red-600">*</span>
          </label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            required 
            defaultValue={employee?.email || ""} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block mb-2 font-medium text-gray-700">
            Phone Number
          </label>
          <input 
            type="tel" 
            name="phone_number" 
            id="phone_number" 
            placeholder="+237 6 XX XX XX XX" 
            defaultValue={employee?.phone_number || ""} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="date_of_birth" className="block mb-2 font-medium text-gray-700">
            Date of Birth
          </label>
          <input 
            type="date" 
            name="date_of_birth" 
            id="date_of_birth" 
            max={new Date().toISOString().split('T')[0]} 
            defaultValue={employee?.date_of_birth || ""} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label htmlFor="photo" className="block mb-2 font-medium text-gray-700">
            Photo
          </label>
          <input 
            type="file" 
            name="photo" 
            id="photo" 
            accept="image/*" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {employee?.photo_path && (
            <small className="text-xs text-gray-600 mt-1 block">
              Current: {employee.photo_path.split('/').pop()}
            </small>
          )}
        </div>

        {/* Job Title */}
        <div>
          <label htmlFor="job_title" className="block mb-2 font-medium text-gray-700">
            Job Title <span className="text-red-600">*</span>
          </label>
          <input 
            type="text" 
            name="job_title" 
            id="job_title" 
            required 
            defaultValue={employee?.job_title || ""} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block mb-2 font-medium text-gray-700">
            Department <span className="text-red-600">*</span>
          </label>
          <select 
            name="department" 
            id="department" 
            required 
            defaultValue={employee?.department || ""} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Select a department</option>
            <option value="IT">IT</option>
            <option value="Management">Management</option>
            <option value="Design">Design</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        {/* Salary */}
        <div>
          <label htmlFor="salary" className="block mb-2 font-medium text-gray-700">
            Salary (FCFA) <span className="text-red-600">*</span>
          </label>
          <input 
            type="number" 
            name="salary" 
            id="salary" 
            required 
            min="0" 
            step="0.01" 
            defaultValue={employee?.salary || ""} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <small className="text-xs text-gray-600 mt-1 block">
            Minimum salary: 36,000 FCFA
          </small>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="start_date" className="block mb-2 font-medium text-gray-700">
            Start Date <span className="text-red-600">*</span>
          </label>
          <input 
            type="date" 
            name="start_date" 
            id="start_date" 
            required 
            defaultValue={employee?.start_date || ""} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="end_date" className="block mb-2 font-medium text-gray-700">
            End Date (optional)
          </label>
          <input 
            type="date" 
            name="end_date" 
            id="end_date" 
            defaultValue={employee?.end_date || ""} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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