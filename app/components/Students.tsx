"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs, Timestamp } from "firebase/firestore";

// Define TypeScript types for the student data
interface Student {
	id: string;
	studentName: string;
	parentName: string;
	mobile: string;
	alternateMobile: string;
	email: string;
	dateOfJoining: string;
	admissionFee: string;
	course: string[];
}

const Students = () => {
	// State for students, loading, and error
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch students from Firestore
	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "students"));
				const studentList = querySnapshot.docs.map((doc) => {
					const data = doc.data();

					// Convert Firestore timestamp to readable date
					const formattedDate =
						data.dateOfJoining instanceof Timestamp
							? data.dateOfJoining.toDate().toLocaleDateString()
							: data.dateOfJoining;

					return {
						id: doc.id,
						studentName: data.studentName,
						parentName: data.parentName,
						mobile: data.mobile,
						alternateMobile: data.alternateMobile,
						email: data.email,
						admissionFee: data.admissionFee,
						course: Array.isArray(data.selectedCourses)
							? data.selectedCourses
							: [data.selectedCourses], // Ensure array
						dateOfJoining: formattedDate, // Fixed date issue
					};
				}) as Student[];

				setStudents(studentList);
			} catch (err) {
				console.error("Error fetching students:", err);
				setError("Failed to load students. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchStudents();
	}, []);

	// Show loading, error, or student list
	if (loading) {
		return (
			<div className='h-screen w-full flex flex-col justify-center items-center'>
				<p className='font-semibold text-lg'>Loading students...</p>
			</div>
		);
	}

	if (error) {
		return <p className='text-red-500'>{error}</p>;
	}

	return (
		<div className='p-4 bg-white rounded-lg mt-4'>
			<h2 className='text-xl font-bold mb-4'>Student List</h2>
			{students.length > 0 ? (
				<table className='min-w-full border rounded-xl shadow table-auto'>
					<thead>
						<tr className='bg-gray-100'>
							{[
								"Student Name",
								"Parent Name",
								"Mobile",
								"Alternate Mobile",
								"Courses",
								"Email",
								"Date of Joining",
								"Admission Fee Amount",
							].map((header) => (
								<th
									key={header}
									className='px-6 py-3 text-left text-sm font-medium text-gray-700'>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{students.map((student) => (
							<tr
								key={student.id}
								className='border-b'>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{student.studentName}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{student.parentName}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{student.mobile}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{student.alternateMobile}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									<ul>
										{student.course.map((course, index) => (
											<li key={index}>{course}</li>
										))}
									</ul>
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{student.email}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{student.dateOfJoining}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{student.admissionFee}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No students found.</p>
			)}
		</div>
	);
};

export default Students;
