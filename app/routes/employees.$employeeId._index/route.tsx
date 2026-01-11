import { useLoaderData, type ActionFunction, useNavigation } from "react-router"
import { getDB } from "~/db/getDB"
import EmployeeForm from "~/components/EmployeeForm";
import Spinner from "~/components/Spinner";
import Toast from "~/components/Toast";
import { useState, useEffect } from "react";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function loader({ params }: any) {
  const db = await getDB()
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", [params.employeeId])
  
  if (!employee) {
    throw new Response("Employee not found", { status: 404 })
  }
  
  return { employee }
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_number = formData.get("phone_number") || null;
  const date_of_birth = formData.get("date_of_birth") || null;
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date") || null;
  const photoFile = formData.get("photo") as File;

  const db = await getDB();
  
  // Get current employee to keep old photo if no new upload
  const currentEmployee = await db.get("SELECT photo_path FROM employees WHERE id = ?", [params.employeeId]);
  let photo_path = currentEmployee.photo_path;

  // Handle photo upload if new file provided
  if (photoFile && photoFile.size > 0) {
    const uploadDir = join(process.cwd(), "public", "uploads", "photos");
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const fileExtension = photoFile.name.split('.').pop();
    const fileName = `employee_${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    const arrayBuffer = await photoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    photo_path = `/uploads/photos/${fileName}`;
  }
  
  await db.run(
    `UPDATE employees 
     SET full_name = ?, email = ?, phone_number = ?, date_of_birth = ?, photo_path = ?,
         job_title = ?, department = ?, salary = ?, start_date = ?, end_date = ?
     WHERE id = ?`,
    [full_name, email, phone_number, date_of_birth, photo_path, job_title, department, salary, start_date, end_date, params.employeeId]
  );
  
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", [params.employeeId]);
  return { success: true, employee };
};

export default function EmployeePage() {
  const loaderData = useLoaderData();
  const employee = loaderData.employee;
  const [isEditing, setIsEditing] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (navigation.state === "idle" && isSubmitting === false && isEditing) {
      setIsEditing(false);
      setShowToast(true);
    }
  }, [navigation.state]);

  return (
    <div className="p-5 max-w-5xl mx-auto">
      {isSubmitting && <Spinner message="Updating employee..." />}
      {showToast && <Toast message="Employee updated successfully!" type="success" onClose={() => setShowToast(false)} />}

      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        {isEditing ? "Edit Employee" : "Employee Details"}
      </h1>

      {!isEditing ? (
        <>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-5">
            <div className="flex gap-8 items-start">
              {/* Photo */}
              <div>
                {employee.photo_path ? (
                  <img 
                    src={employee.photo_path} 
                    alt={employee.full_name} 
                    className="w-36 h-36 object-cover rounded-lg border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-36 h-36 bg-gray-200 rounded-lg flex items-center justify-center text-5xl text-gray-400">
                    👤
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="border-b-2 border-blue-600 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-blue-600 m-0">{employee.full_name}</h2>
                  <p className="text-gray-600 mt-1 mb-0">{employee.job_title}</p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Email</label>
                    <p className="mt-1 text-sm text-gray-800">{employee.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Phone</label>
                    <p className="mt-1 text-sm text-gray-800">{employee.phone_number || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Date of Birth</label>
                    <p className="mt-1 text-sm text-gray-800">{employee.date_of_birth || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Department</label>
                    <p className="mt-1 text-sm text-gray-800">{employee.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Salary</label>
                    <p className="mt-1 text-sm text-gray-800">{new Intl.NumberFormat('en-US').format(employee.salary)} FCFA</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">Start Date</label>
                    <p className="mt-1 text-sm text-gray-800">{employee.start_date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">End Date</label>
                    <p className="mt-1 text-sm text-gray-800">{employee.end_date || "Active"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(true)} 
            className="px-6 py-2.5 bg-yellow-500 text-gray-900 rounded-md text-sm font-medium hover:bg-yellow-600 transition-colors mb-8"
          >
            Edit Employee
          </button>
        </>
      ) : (
        <>
          <EmployeeForm 
            employee={employee} 
            actionText="Save Changes" 
            cancelUrl={`/employees/${employee.id}`} 
          />
          <button 
            onClick={() => setIsEditing(false)} 
            className="px-6 py-2.5 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors mb-5"
          >
            Cancel Edit
          </button>
        </>
      )}

      <div className="flex gap-4">
        <a href="/employees" className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors no-underline inline-block">
          Employees
        </a>
        <a href="/employees/new" className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors no-underline inline-block">
          New Employee
        </a>
        <a href="/timesheets" className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors no-underline inline-block">
          Timesheets
        </a>
      </div>
    </div>
  )
}