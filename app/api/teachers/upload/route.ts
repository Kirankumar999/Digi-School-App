import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Teacher from "@/lib/models/Teacher";
import ExcelJS from "exceljs";
import { Readable } from "stream";

const EXPECTED_HEADERS = [
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

const REQUIRED_FIELDS = ["teacherId", "firstName", "lastName", "subject", "department"];

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

    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    if (file.name.endsWith(".csv")) {
      await workbook.csv.read(Readable.from(Buffer.from(arrayBuffer)));
    } else {
      await workbook.xlsx.load(arrayBuffer);
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
    const validTeachers: Record<string, unknown>[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const rowNum = i + 2;
      const teacher: Record<string, string> = {};

      for (const field of REQUIRED_FIELDS) {
        const value = String(row[field] ?? "").trim();
        if (!value) {
          errors.push({ row: rowNum, message: `Missing required field: ${field}` });
        }
      }

      for (const header of EXPECTED_HEADERS) {
        teacher[header] = String(row[header] ?? "").trim();
      }

      if (teacher.gender && !["Male", "Female", "Other"].includes(teacher.gender)) {
        teacher.gender = "Male";
      }

      if (teacher.status && !["Active", "Inactive", "On Leave", "Resigned"].includes(teacher.status)) {
        teacher.status = "Active";
      }

      if (!teacher.status) teacher.status = "Active";
      if (!teacher.gender) teacher.gender = "Male";

      if (teacher.teacherId) {
        if (seenIds.has(teacher.teacherId)) {
          errors.push({ row: rowNum, message: `Duplicate Teacher ID: ${teacher.teacherId}` });
        } else {
          seenIds.add(teacher.teacherId);
        }
      }

      if (errors.filter((e) => e.row === rowNum).length === 0) {
        validTeachers.push(teacher);
      }
    }

    if (errors.length > 0 && validTeachers.length === 0) {
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

    const teacherIdList = validTeachers.map((t) => String(t.teacherId));
    const existingIds = await Teacher.find({
      teacherId: { $in: teacherIdList },
    }).select("teacherId");

    const existingIdSet = new Set(existingIds.map((t) => t.teacherId));
    const newTeachers = validTeachers.filter((t) => !existingIdSet.has(String(t.teacherId)));
    const skippedCount = validTeachers.length - newTeachers.length;

    let insertedCount = 0;
    if (newTeachers.length > 0) {
      const result = await Teacher.insertMany(newTeachers, { ordered: false });
      insertedCount = result.length;
    }

    return NextResponse.json({
      message: "Upload complete",
      summary: {
        totalRows: rawData.length,
        inserted: insertedCount,
        skipped: skippedCount,
        errored: errors.length,
      },
      errors: errors.slice(0, 20),
    });
  } catch (error: unknown) {
    console.error("Upload teachers error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
