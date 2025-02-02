"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

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
	course: string;
}

const Students = () => {
	// Type the state for students, loading, and error
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch students from Firestore
	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "students"));
				const studentList = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as Student[];
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

	// Show loading, error, or the list of students
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
		<div className='container mx-auto mt-28'>
			<h2 className='text-xl font-bold mb-4'>Student List</h2>
			{students.length > 0 ? (
				<table className='min-w-full border rounded-xl shadow table-auto'>
					<thead>
						<tr className='bg-gray-100'>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-700'>
								Student Name
							</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-700'>
								Parent Name
							</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-700'>
								Mobile
							</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-700'>
								Alternate Mobile
							</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-700'>
								Course
							</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-700'>
								Email
							</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-700'>
								Date of Joining
							</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-700'>
								Admission Fee Amount
							</th>
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
									{student.course}
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
