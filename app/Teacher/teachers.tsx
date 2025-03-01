"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { format } from "date-fns";
import { collection, getDocs, Timestamp } from "firebase/firestore";

// Define TypeScript types for teachers
interface Teacher {
	id: string;
	teacherName: string;
	mobile: string;
	email: string;
	dateOfJoining: string;
	speciality: string[];
	address: string;
}

const Teachers = () => {
	// State for teachers, loading, and error
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch teachers from Firestore
	useEffect(() => {
		const fetchTeachers = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "teachers"));
				const teacherList = querySnapshot.docs.map((doc) => {
					const data = doc.data();

					// Convert Firestore timestamp to readable date

					// Convert Firestore timestamp or ISO string to formatted date
					const formattedDate =
						data.dateOfJoining instanceof Timestamp
							? format(data.dateOfJoining.toDate(), "dd-MMM-yyyy")
							: format(new Date(data.dateOfJoining), "dd-MMM-yyyy");

					return {
						id: doc.id,
						teacherName: data.name,
						mobile: data.mobile,
						email: data.email,
						speciality: Array.isArray(data.speciality)
							? data.speciality
							: [data.speciality], // Ensure it's an array
						dateOfJoining: formattedDate, // Fixed date issue
						address: data.address,
					};
				}) as Teacher[];

				setTeachers(teacherList);
			} catch (err) {
				console.error("Error fetching teachers:", err);
				setError("Failed to load teachers. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchTeachers();
	}, []);

	// Show loading, error, or teacher list
	if (loading) {
		return (
			<div className='h-screen w-full flex flex-col justify-center items-center'>
				<p className='font-semibold text-lg'>Loading teachers...</p>
			</div>
		);
	}

	if (error) {
		return <p className='text-red-500'>{error}</p>;
	}

	return (
		<div className='p-4 bg-white rounded-lg mt-4'>
			<h2 className='text-xl font-bold mb-4'>Teacher List</h2>
			{teachers.length > 0 ? (
				<table className='min-w-full border rounded-xl shadow table-auto'>
					<thead>
						<tr className='bg-gray-100'>
							{[
								"Teacher Name",
								"Mobile",
								"Email",
								"Address",
								"Speciality",
								"Date of Joining",
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
						{teachers.map((teacher) => (
							<tr
								key={teacher.id}
								className='border-b'>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{teacher.teacherName}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{teacher.mobile}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{teacher.email}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{teacher.address}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									<ul>
										{teacher.speciality.map((course, index) => (
											<li key={index}>{course}</li>
										))}
									</ul>
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{teacher.dateOfJoining}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No teachers found.</p>
			)}
		</div>
	);
};

export default Teachers;
