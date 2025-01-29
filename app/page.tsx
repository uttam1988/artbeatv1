"use client";

import { useEffect, useState } from "react";
import { db } from "./lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Define TypeScript types for the student data
interface Student {
	id: string;
	name: string;
	mobile: string;
	email: string;
}

const Home = () => {
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
		return <p>Loading students...</p>;
	}

	if (error) {
		return <p className='text-red-500'>{error}</p>;
	}

	return (
		<div className='max-w-4xl mx-auto p-4 border rounded-lg shadow'>
			<h2 className='text-xl font-bold mb-4'>Student List</h2>
			{students.length > 0 ? (
				<ul className='space-y-4'>
					{students.map((student) => (
						<li
							key={student.id}
							className='border p-4 rounded shadow'>
							<p>
								<strong>Name:</strong> {student.name}
							</p>
							<p>
								<strong>Mobile:</strong> {student.mobile}
							</p>
							<p>
								<strong>Email:</strong> {student.email}
							</p>
						</li>
					))}
				</ul>
			) : (
				<p>No students found.</p>
			)}
		</div>
	);
};

export default Home;
