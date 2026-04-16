import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Student from "@/lib/models/Student";
import ExcelJS from "exceljs";

const EXPECTED_HEADERS = [
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

const REQUIRED_FIELDS = ["studentId", "firstName", "lastName", "grade", "section"];

function parseWorksheet(worksheet: ExcelJS.Worksheet): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell((cell, colNumber) => {
    headers[colNumber] = String(cell.value ?? "").trim();
  });
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const record: Record<string, unknown> = {};
    headers.forEach((header, colNumber) => {
      if (header) {
        const cell = row.getCell(colNumber);
        record[header] = cell.value ?? "";
      }
    });
    rows.push(record);
  });
  return rows;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = new ExcelJS.Workbook();
    if (file.name.endsWith(".csv")) {
      await workbook.csv.read(require("stream").Readable.from(buffer));
    } else {
      await workbook.xlsx.load(buffer);
    }
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return NextResponse.json({ error: "No worksheet found in file" }, { status: 400 });
    }
    const rawData = parseWorksheet(worksheet);

    if (rawData.length === 0) {
      return NextResponse.json({ error: "The uploaded file is empty" }, { status: 400 });
    }

    if (rawData.length > 1000) {
      return NextResponse.json(
        { error: "Maximum 1000 rows allowed per upload" },
        { status: 400 }
      );
    }

    const errors: { row: number; message: string }[] = [];
    const validStudents: Record<string, unknown>[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const rowNum = i + 2; // +2 because row 1 is header, data starts at row 2
      const student: Record<string, string> = {};

      for (const field of REQUIRED_FIELDS) {
        const value = String(row[field] ?? "").trim();
        if (!value) {
          errors.push({ row: rowNum, message: `Missing required field: ${field}` });
        }
      }

      for (const header of EXPECTED_HEADERS) {
        student[header] = String(row[header] ?? "").trim();
      }

      if (student.gender && !["Male", "Female", "Other"].includes(student.gender)) {
        student.gender = "Male";
      }

      if (student.status && !["Active", "Inactive", "Graduated", "Transferred"].includes(student.status)) {
        student.status = "Active";
      }

      if (!student.status) student.status = "Active";
      if (!student.gender) student.gender = "Male";

      if (student.studentId) {
        if (seenIds.has(student.studentId)) {
          errors.push({ row: rowNum, message: `Duplicate Student ID: ${student.studentId}` });
        } else {
          seenIds.add(student.studentId);
        }
      }

      if (errors.filter((e) => e.row === rowNum).length === 0) {
        validStudents.push(student);
      }
    }

    if (errors.length > 0 && validStudents.length === 0) {
      return NextResponse.json(
        {
          error: "All rows have validation errors",
          errors: errors.slice(0, 50),
          totalErrors: errors.length,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const studentIdList = validStudents.map((s) => String(s.studentId));
    const existingIds = await Student.find({
      studentId: { $in: studentIdList },
    }).select("studentId");

    const existingIdSet = new Set(existingIds.map((s) => s.studentId));
    const newStudents = validStudents.filter((s) => !existingIdSet.has(String(s.studentId)));
    const skippedCount = validStudents.length - newStudents.length;

    let insertedCount = 0;
    if (newStudents.length > 0) {
      const result = await Student.insertMany(newStudents, { ordered: false });
      insertedCount = result.length;
    }

    return NextResponse.json({
      message: `Upload complete`,
      summary: {
        totalRows: rawData.length,
        inserted: insertedCount,
        skipped: skippedCount,
        errored: errors.length,
      },
      errors: errors.slice(0, 20),
    });
  } catch (error: unknown) {
    console.error("Upload students error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
