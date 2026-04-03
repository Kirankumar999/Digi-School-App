import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const headers = [
    "teacherId",
    "firstName",
    "lastName",
    "email",
    "phone",
    "dateOfBirth",
    "gender",
    "subject",
    "department",
    "qualification",
    "experience",
    "address",
    "joiningDate",
    "salary",
    "status",
  ];

  const sampleData = [
    {
      teacherId: "T100001",
      firstName: "Robert",
      lastName: "Williams",
      email: "robert.w@school.com",
      phone: "555-0201",
      dateOfBirth: "1985-03-15",
      gender: "Male",
      subject: "Mathematics",
      department: "Science",
      qualification: "M.Sc Mathematics",
      experience: "10 years",
      address: "123 Elm St, City",
      joiningDate: "2015-06-01",
      salary: "55000",
      status: "Active",
    },
    {
      teacherId: "T100002",
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily.j@school.com",
      phone: "555-0202",
      dateOfBirth: "1990-07-22",
      gender: "Female",
      subject: "English",
      department: "Languages",
      qualification: "M.A English Literature",
      experience: "6 years",
      address: "456 Oak Ave, Town",
      joiningDate: "2019-08-15",
      salary: "48000",
      status: "Active",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData, { header: headers });

  const colWidths = headers.map((h) => ({
    wch: Math.max(h.length + 2, 15),
  }));
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="teacher_template.xlsx"',
    },
  });
}
