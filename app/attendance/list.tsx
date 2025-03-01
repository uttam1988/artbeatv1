"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const AttendanceList = () => {
	const [attendanceRecords, setAttendanceRecords] = useState([]);
	const [students, setStudents] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState("");

	useEffect(() => {
		// Fetch students
		const fetchStudents = async () => {
			try {
				const studentSnap = await getDocs(collection(db, "students"));
				const studentList = studentSnap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setStudents(studentList);
			} catch (error) {
				console.error("Error fetching students:", error);
			}
		};

		fetchStudents();
	}, []);

	useEffect(() => {
		// Fetch attendance records
		const fetchAttendance = async () => {
			try {
				const attendanceSnap = await getDocs(collection(db, "attendance"));
				const attendanceList = attendanceSnap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setAttendanceRecords(attendanceList);
			} catch (error) {
				console.error("Error fetching attendance records:", error);
			}
		};

		fetchAttendance();
	}, []);

	// Filter attendance based on selected student
	const filteredRecords = selectedStudent
		? attendanceRecords.filter((record) => record.studentId === selectedStudent)
		: attendanceRecords;

	return (
		<div className='w-full mx-auto p-4'>
			{/* Student Filter */}
			<select
				className='border p-2 mb-4 w-full'
				onChange={(e) => setSelectedStudent(e.target.value)}>
				<option value=''>All Students</option>
				{students.map((student) => (
					<option
						key={student.id}
						value={student.id}>
						{student.studentName}
					</option>
				))}
			</select>

			{/* Attendance Table */}
			<div className='overflow-x-auto'>
				<table className='w-full border-collapse border border-gray-300'>
					<thead>
						<tr className='bg-gray-200'>
							<th className='border p-2'>Student Name</th>
							<th className='border p-2'>Batch</th>
							<th className='border p-2'>Month</th>
							<th className='border p-2'>Attendance</th>
						</tr>
					</thead>
					<tbody>
						{filteredRecords.length > 0 ? (
							filteredRecords.map((record) => (
								<tr
									key={record.id}
									className='text-center'>
									<td className='border p-2'>
										{record.studentName || "Unknown"}
									</td>
									<td className='border p-2'>{record.batchId || "N/A"}</td>
									<td className='border p-2'>{record.month}</td>
									<td className='border p-2 text-left'>
										{Object.entries(record.attendance || {}).map(
											([date, status]) => (
												<div
													key={date}
													className={
														status === "Present"
															? "text-green-500"
															: "text-red-500"
													}>
													{date}: {status}
												</div>
											),
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan='4'
									className='text-center p-4'>
									No attendance records found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AttendanceList;
