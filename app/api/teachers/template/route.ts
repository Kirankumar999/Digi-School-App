import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

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

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Teachers");

  worksheet.columns = headers.map((h) => ({
    header: h,
    key: h,
    width: Math.max(h.length + 2, 15),
  }));

  worksheet.getRow(1).font = { bold: true };

  for (const row of sampleData) {
    worksheet.addRow(row);
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="teacher_template.xlsx"',
    },
  });
}
