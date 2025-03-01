"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import dayjs from "dayjs";

const Attendance = () => {
	const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
	const [students, setStudents] = useState<
		{ id: string; studentName: string }[]
	>([]);
	const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
	const [selectedStudent, setSelectedStudent] = useState<{
		id: string;
		studentName: string;
	} | null>(null);
	const [attendance, setAttendance] = useState({});

	useEffect(() => {
		const fetchBatches = async () => {
			const batchSnap = await getDocs(collection(db, "batches"));
			const batchList = batchSnap.docs.map((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					name: data.name || "Unknown", // Ensure `name` exists
				};
			});
			setBatches(batchList);
		};

		fetchBatches();
	}, []);

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const studentSnap = await getDocs(collection(db, "students"));
				const studentList = studentSnap.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id,
						studentName: data.studentName || "Unknown", // Ensure `studentName` exists
					};
				});
				setStudents(studentList);
			} catch (error) {
				console.error("Error fetching students:", error);
			}
		};
		fetchStudents();
	}, []);

	const today = dayjs();
	const daysInMonth = today.daysInMonth();
	const startOfMonth = today.startOf("month").day();
	const monthName = today.format("MMMM YYYY");

	// Toggle Attendance Status
	const toggleAttendance = (date) => {
		if (!selectedStudent) return alert("Select a student first");
		setAttendance((prev) => ({
			...prev,
			[date]: prev[date] === "Present" ? "Absent" : "Present",
		}));
	};

	// Save Attendance in Firestore
	const submitAttendance = async () => {
		if (!selectedStudent || !selectedStudent.studentName) {
			return alert(
				"Please select a valid student before submitting attendance.",
			);
		}

		const attendanceRecord = {
			studentName: selectedStudent.studentName,
			studentId: selectedStudent.id, // Store ID for reference
			batchName: selectedBatch, // Add batch reference
			month: monthName,
			attendance: attendance,
		};
		debugger;

		try {
			await setDoc(
				doc(db, "attendance", `${selectedStudent.id}_${monthName}`),
				attendanceRecord,
			);
			alert("Attendance saved successfully!");
		} catch (error) {
			console.error("Error saving attendance:", error);
			alert("Failed to save attendance.");
		}
	};

	return (
		<div className='max-w-3xl mx-auto p-4 bg-white shadow rounded-lg'>
			<h2 className='text-xl font-bold text-center mb-4'>
				Attendance Tracking
			</h2>

			{/* Batch Selection */}
			<select
				className='border p-2 mb-4 w-full'
				onChange={(e) => setSelectedBatch(e.target.value)}>
				<option value=''>Select a Batch</option>
				{batches.map((batch) => (
					<option
						key={batch.id}
						value={batch.name}>
						{batch.name}
					</option>
				))}
			</select>

			{/* Student Selection */}
			<select
				className='border p-2 mb-4 w-full'
				onChange={(e) => {
					const student = students.find((s) => s.id === e.target.value) || null; // Ensure null if not found
					console.log("Selected Student:", student); // Debugging log
					setSelectedStudent(student);
				}}>
				<option value=''>Select a Student</option>
				{students.map((student) => (
					<option
						key={student.id}
						value={student.id}>
						{student.studentName}
					</option>
				))}
			</select>

			{/* Display Current Month */}
			<h3 className='text-lg font-semibold text-center my-4'>{monthName}</h3>

			{/* Calendar Grid */}
			<div className='grid grid-cols-7 text-center font-bold mb-2'>
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div
						key={day}
						className='py-2'>
						{day}
					</div>
				))}
			</div>

			<div className='grid grid-cols-7 gap-2'>
				{/* Empty Cells for Month Start */}
				{Array.from({ length: startOfMonth }).map((_, i) => (
					<div
						key={`empty-${i}`}
						className='py-6'></div>
				))}

				{/* Days of the Month */}
				{Array.from({ length: daysInMonth }).map((_, i) => {
					const date = today.date(i + 1).format("YYYY-MM-DD");
					const isPresent = attendance[date] === "Present";

					return (
						<div
							key={date}
							className='border p-2 rounded flex flex-col items-center text-sm'>
							<div className='font-bold'>{i + 1}</div>
							<button
								onClick={() => toggleAttendance(date)}
								className={`mt-2 px-2 py-1 rounded text-white text-xs ${
									isPresent ? "bg-green-500" : "bg-red-500"
								}`}>
								{isPresent ? "Present" : "Absent"}
							</button>
						</div>
					);
				})}
			</div>

			{/* Submit Button */}
			<button
				onClick={submitAttendance}
				className='mt-4 w-full bg-blue-500 text-white py-2 rounded text-lg font-bold'>
				Submit Attendance
			</button>
		</div>
	);
};

export default Attendance;
