"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
} from "firebase/firestore";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const BatchManagement = () => {
	const [batches, setBatches] = useState([]);
	const [courses, setCourses] = useState<{ id: string; courseName: string }[]>(
		[],
	);
	const [students, setStudents] = useState<
		{ id: string; studentName: string }[]
	>([]);
	const [teachers, setTeachers] = useState([]);
	const [batchName, setBatchName] = useState("");
	const [timing, setTiming] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState("");
	const [selectedStudents, setSelectedStudents] = useState([]);
	const [selectedTeachers, setSelectedTeachers] = useState([]);
	const [editingId, setEditingId] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const [batchSnap, courseSnap, studentSnap, teacherSnap] =
				await Promise.all([
					getDocs(collection(db, "batches")),
					getDocs(collection(db, "courses")),
					getDocs(collection(db, "students")),
					getDocs(collection(db, "teachers")),
				]);

			setBatches(batchSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
			setCourses(courseSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
			setStudents(
				studentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
			);
			setTeachers(
				teacherSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
			);
		};
		fetchData();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!batchName || !timing || !selectedCourse) return;

		const batchData = {
			name: batchName,
			timing: timing.toISOString(), // Store in ISO format
			course: selectedCourse,
			students: selectedStudents,
			teachers: selectedTeachers,
		};

		if (editingId) {
			await updateDoc(doc(db, "batches", editingId), batchData);
			setBatches((prev) =>
				prev.map((batch) =>
					batch.id === editingId ? { ...batch, ...batchData } : batch,
				),
			);
		} else {
			const docRef = await addDoc(collection(db, "batches"), batchData);
			setBatches((prev) => [...prev, { id: docRef.id, ...batchData }]);
		}

		setBatchName("");
		setTiming(null);
		setSelectedCourse("");
		setSelectedStudents([]);
		setSelectedTeachers([]);
		setEditingId(null);
	};

	const handleEdit = (batch) => {
		setEditingId(batch.id);
		setBatchName(batch.name);
		setTiming(dayjs(batch.timing)); // Convert back to DayJS object
		setSelectedCourse(batch.course);
		setSelectedStudents(batch.students || []);
		setSelectedTeachers(batch.teachers || []);
	};

	const handleDelete = async (id) => {
		await deleteDoc(doc(db, "batches", id));
		setBatches((prev) => prev.filter((batch) => batch.id !== id));
	};

	return (
		<div className='p-4 bg-white rounded-lg'>
			<h2 className='text-xl font-bold mb-4'>Batch Management</h2>
			<form
				onSubmit={handleSubmit}
				className='mb-4'>
				<input
					type='text'
					value={batchName}
					onChange={(e) => setBatchName(e.target.value)}
					placeholder='Batch Name'
					className='border p-2 w-full mb-2'
				/>

				<div className='flex flex-col gap-1 mb-2'>
					<label htmlFor='datetime'>Select Date & Time</label>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateTimePicker
							value={timing}
							onChange={(newValue) => setTiming(newValue)}
							slotProps={{ textField: { size: "small", className: "w-full" } }}
						/>
					</LocalizationProvider>
				</div>

				<div className='mb-2'>
					<p className='font-semibold mb-1'>Select a Course</p>
					<div className='flex gap-2 flex-wrap'>
						{courses.map((course) => (
							<label
								key={course.id}
								className='flex items-center space-x-2'>
								<input
									type='radio'
									value={course.courseName}
									checked={selectedCourse === course.courseName}
									onChange={() => setSelectedCourse(course.courseName)}
								/>
								<span>{course.courseName}</span>
							</label>
						))}
					</div>
				</div>

				<div className='mb-2'>
					<p className='font-semibold mb-1'>Select Students</p>
					<div className='flex gap-2 flex-wrap'>
						{students.map((student) => (
							<label
								key={student.id}
								className='flex items-center space-x-2'>
								<input
									type='checkbox'
									checked={selectedStudents.includes(student.id)}
									onChange={() =>
										setSelectedStudents((prev) =>
											prev.includes(student.id)
												? prev.filter((id) => id !== student.id)
												: [...prev, student.id],
										)
									}
								/>
								<span>{student.studentName}</span>
							</label>
						))}
					</div>
				</div>
				<div className='mb-2'>
					<p className='font-semibold mb-1'>Select Teachers</p>
					<div className='flex gap-2 flex-wrap'>
						{teachers.map((teacher) => (
							<label
								key={teacher.id}
								className='flex items-center space-x-2'>
								<input
									type='checkbox'
									checked={selectedTeachers.includes(teacher.id)}
									onChange={() =>
										setSelectedTeachers((prev) =>
											prev.includes(teacher.id)
												? prev.filter((id) => id !== teacher.id)
												: [...prev, teacher.id],
										)
									}
								/>
								<span>{teacher.name}</span>
							</label>
						))}
					</div>
				</div>

				<button
					type='submit'
					className='bg-blue-500 text-white p-2 rounded'>
					{editingId ? "Update Batch" : "Add Batch"}
				</button>
			</form>

			<table className='min-w-full border rounded-xl shadow table-auto'>
				<thead>
					<tr className='bg-gray-100'>
						<th className='px-4 py-2'>Batch Name</th>
						<th className='px-4 py-2'>Date & Time</th>
						<th className='px-4 py-2'>Course</th>
						<th className='px-4 py-2'>Students</th>
						<th className='px-4 py-2'>Teachers</th>
						<th className='px-4 py-2'>Actions</th>
					</tr>
				</thead>
				<tbody>
					{batches.map((batch) => (
						<tr
							key={batch.id}
							className='border-b'>
							<td className='px-4 py-2'>{batch.name}</td>
							<td className='px-4 py-2'>
								{dayjs(batch.timing).format("YYYY-MM-DD HH:mm A")}
							</td>
							<td className='px-4 py-2'>{batch.course}</td>
							<td className='px-4 py-2'>{batch.students?.length || 0}</td>
							<td className='px-4 py-2'>{batch.teachers?.length || 0}</td>
							<td className='px-4 py-2'>
								<button
									onClick={() => handleEdit(batch)}
									className='mr-2 text-blue-500'>
									Edit
								</button>
								<button
									onClick={() => handleDelete(batch.id)}
									className='text-red-500'>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default BatchManagement;
