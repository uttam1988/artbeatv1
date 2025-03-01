"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useSearchParams, useRouter } from "next/navigation";
import dayjs from "dayjs";

const AttendanceEntry = () => {
	const searchParams = useSearchParams();
	const batchId = searchParams.get("batchId");
	const date = searchParams.get("date");
	const router = useRouter();

	const [students, setStudents] = useState([]);
	const [attendance, setAttendance] = useState({});

	// Fetch students of the batch
	useEffect(() => {
		if (!batchId) return;

		const fetchBatchStudents = async () => {
			const batchRef = doc(db, "batches", batchId);
			const batchSnap = await getDoc(batchRef);
			if (batchSnap.exists()) {
				const batchData = batchSnap.data();
				setStudents(batchData.students || []);
			}
		};

		fetchBatchStudents();
	}, [batchId]);

	// Fetch existing attendance record
	useEffect(() => {
		if (!batchId || !date) return;

		const fetchAttendance = async () => {
			const attendanceRef = doc(db, "attendance", `${batchId}_${date}`);
			const attendanceSnap = await getDoc(attendanceRef);
			if (attendanceSnap.exists()) {
				setAttendance(attendanceSnap.data().records);
			} else {
				// Default all students to "absent"
				setAttendance(
					Object.fromEntries(students.map((student) => [student, "absent"])),
				);
			}
		};

		fetchAttendance();
	}, [batchId, date, students]);

	// Handle attendance update
	const handleAttendanceChange = (studentId, status) => {
		setAttendance((prev) => ({
			...prev,
			[studentId]: status,
		}));
	};

	// Save attendance
	const handleSubmit = async () => {
		await setDoc(doc(db, "attendance", `${batchId}_${date}`), {
			batchId,
			date,
			records: attendance,
		});
		router.push("/attendance"); // Redirect back to calendar
	};

	return (
		<div className='p-4 bg-white rounded-lg'>
			<h2 className='text-xl font-bold mb-4'>
				Mark Attendance for {dayjs(date).format("YYYY-MM-DD")}
			</h2>

			<table className='min-w-full border rounded-xl shadow table-auto'>
				<thead>
					<tr className='bg-gray-100'>
						<th className='px-4 py-2'>Student Name</th>
						<th className='px-4 py-2'>Status</th>
					</tr>
				</thead>
				<tbody>
					{students.map((student) => (
						<tr
							key={student}
							className='border-b'>
							<td className='px-4 py-2'>{student}</td>
							<td className='px-4 py-2'>
								<select
									className='border p-2'
									value={attendance[student] || "absent"}
									onChange={(e) =>
										handleAttendanceChange(student, e.target.value)
									}>
									<option value='present'>Present</option>
									<option value='absent'>Absent</option>
								</select>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<button
				onClick={handleSubmit}
				className='bg-blue-500 text-white px-4 py-2 rounded mt-4'>
				Save Attendance
			</button>
		</div>
	);
};

export default AttendanceEntry;
