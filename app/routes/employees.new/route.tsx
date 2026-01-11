import { redirect, type ActionFunction, useNavigation } from "react-router";
import { getDB } from "~/db/getDB";
import EmployeeForm from "~/components/EmployeeForm";
import Spinner from "~/components/Spinner";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const action: ActionFunction = async ({ request }) => {
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

  let photo_path = null;

  // Handle photo upload
  if (photoFile && photoFile.size > 0) {
    const uploadDir = join(process.cwd(), "public", "uploads", "photos");
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = photoFile.name.split('.').pop();
    const fileName = `employee_${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Save file
    const arrayBuffer = await photoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // Store relative path for database
    photo_path = `/uploads/photos/${fileName}`;
  }

  const db = await getDB();
  
  await db.run(
    `INSERT INTO employees 
     (full_name, email, phone_number, date_of_birth, photo_path, job_title, department, salary, start_date, end_date) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, phone_number, date_of_birth, photo_path, job_title, department, salary, start_date, end_date]
  );
  
  return redirect("/employees");
};

export default function NewEmployeePage() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="p-5 max-w-4xl mx-auto">
      {isSubmitting && <Spinner message="Creating employee..." />}

      <h1 className="text-2xl font-bold mb-5 text-gray-800">Create New Employee</h1>

      <EmployeeForm 
        actionText="Create Employee"
        cancelUrl="/employees"
      />
    </div>
  );
}