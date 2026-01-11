import { useLoaderData } from "react-router"
import { getDB } from "~/db/getDB"
import { useState, useMemo } from "react"

export async function loader() {
  const db = await getDB()
  const employees = await db.all("SELECT * FROM employees;")
  return { employees }
}

export default function EmployeesPage() {
  const { employees } = useLoaderData()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState("full_name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const departments = useMemo(() => {
    const depts = [...new Set(employees.map((e: any) => e.department))]
    return depts.sort()
  }, [employees])

  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...employees]

    if (searchTerm) {
      result = result.filter((emp: any) =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.job_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterDepartment !== "all") {
      result = result.filter((emp: any) => emp.department === filterDepartment)
    }

    result.sort((a: any, b: any) => {
      let aVal = a[sortColumn]
      let bVal = b[sortColumn]

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [employees, searchTerm, sortColumn, sortDirection, filterDepartment])

  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEmployees = filteredAndSortedEmployees.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleFilter = (value: string) => {
    setFilterDepartment(value)
    setCurrentPage(1)
  }

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees List</h1>
        
        <div className="flex gap-3">
          <a href="/employees/new" className="px-5 py-2.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors no-underline">
            New Employee
          </a>
          <a href="/timesheets" className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors no-underline">
            Timesheets
          </a>
        </div>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          type="text"
          placeholder="Search (name, email, job title)..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        
        <select
          value={filterDepartment}
          onChange={(e) => handleFilter(e.target.value)}
          className="min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="all">All Departments</option>
          {departments.map((dept: any) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

     
      <div className="mb-3 text-sm text-gray-600">
        {filteredAndSortedEmployees.length} employee(s) found
      </div>

      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th
                onClick={() => handleSort("full_name")}
                className="px-4 py-3 text-left border-b-2 border-gray-300 cursor-pointer select-none hover:bg-gray-200 transition-colors"
              >
                Name {sortColumn === "full_name" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("email")}
                className="px-4 py-3 text-left border-b-2 border-gray-300 cursor-pointer select-none hover:bg-gray-200 transition-colors"
              >
                Email {sortColumn === "email" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("job_title")}
                className="px-4 py-3 text-left border-b-2 border-gray-300 cursor-pointer select-none hover:bg-gray-200 transition-colors"
              >
                Job Title {sortColumn === "job_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("department")}
                className="px-4 py-3 text-left border-b-2 border-gray-300 cursor-pointer select-none hover:bg-gray-200 transition-colors"
              >
                Department {sortColumn === "department" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-center border-b-2 border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-5 text-center text-gray-400">
                  No employees found
                </td>
              </tr>
            ) : (
              paginatedEmployees.map((employee: any) => (
                <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {employee.photo_path ? (
                        <img 
                          src={employee.photo_path} 
                          alt={employee.full_name} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg">
                           {employee.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-gray-800">{employee.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{employee.email}</td>
                  <td className="px-4 py-3 text-gray-700">{employee.job_title}</td>
                  <td className="px-4 py-3 text-gray-700">{employee.department}</td>
                  <td className="px-4 py-3 text-center">
                    <a
                      href={`/employees/${employee.id}`}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors no-underline inline-block"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex justify-center items-center gap-3">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
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
  )
}