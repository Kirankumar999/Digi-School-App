import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET() {
  const headers = [
    "studentId",
    "firstName",
    "lastName",
    "email",
    "phone",
    "dateOfBirth",
    "gender",
    "grade",
    "section",
    "guardianName",
    "guardianPhone",
    "address",
    "enrollmentDate",
    "status",
  ];

  const sampleData = [
    {
      studentId: "S100001",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@school.com",
      phone: "555-0101",
      dateOfBirth: "2010-05-15",
      gender: "Male",
      grade: "10",
      section: "A1",
      guardianName: "Jane Doe",
      guardianPhone: "555-0100",
      address: "123 Main St, City",
      enrollmentDate: "2024-06-01",
      status: "Active",
    },
    {
      studentId: "S100002",
      firstName: "Sarah",
      lastName: "Smith",
      email: "sarah.smith@school.com",
      phone: "555-0102",
      dateOfBirth: "2011-03-20",
      gender: "Female",
      grade: "9",
      section: "B2",
      guardianName: "Mike Smith",
      guardianPhone: "555-0103",
      address: "456 Oak Ave, Town",
      enrollmentDate: "2024-06-01",
      status: "Active",
    },
  ];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Students");

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
      "Content-Disposition": 'attachment; filename="student_template.xlsx"',
    },
  });
}
