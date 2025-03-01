"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import {
	collection,
	addDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	doc,
} from "firebase/firestore";

// TypeScript Interface for Course
interface Course {
	id: string;
	courseName: string;
	courseFee: number;
}

const CourseManagement = () => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [courseName, setCourseName] = useState("");
	const [courseFee, setCourseFee] = useState("");
	const [editingCourse, setEditingCourse] = useState<Course | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch Courses from Firestore
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "courses"));
				const courseList = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as Course[];
				setCourses(courseList);
			} catch (err) {
				console.error("Error fetching courses:", err);
				setError("Failed to load courses.");
			} finally {
				setLoading(false);
			}
		};
		fetchCourses();
	}, []);

	// Add a New Course
	const handleAddCourse = async () => {
		if (!courseName || !courseFee) {
			alert("Please enter both course name and fee.");
			return;
		}

		try {
			const docRef = await addDoc(collection(db, "courses"), {
				courseName,
				courseFee: parseInt(courseFee),
			});
			setCourses([
				...courses,
				{ id: docRef.id, courseName, courseFee: parseInt(courseFee) },
			]);
			setCourseName("");
			setCourseFee("");
		} catch (err) {
			console.error("Error adding course:", err);
		}
	};

	// Edit a Course
	const handleEditCourse = (course: Course) => {
		setEditingCourse(course);
		setCourseName(course.courseName);
		setCourseFee(course.courseFee.toString());
	};

	// Update a Course
	const handleUpdateCourse = async () => {
		if (!editingCourse) return;

		try {
			const courseRef = doc(db, "courses", editingCourse.id);
			await updateDoc(courseRef, {
				courseName,
				courseFee: parseInt(courseFee),
			});

			setCourses(
				courses.map((c) =>
					c.id === editingCourse.id
						? { ...c, courseName, courseFee: parseInt(courseFee) }
						: c,
				),
			);

			setEditingCourse(null);
			setCourseName("");
			setCourseFee("");
		} catch (err) {
			console.error("Error updating course:", err);
		}
	};

	// Delete a Course
	const handleDeleteCourse = async (id: string) => {
		if (!confirm("Are you sure you want to delete this course?")) return;

		try {
			await deleteDoc(doc(db, "courses", id));
			setCourses(courses.filter((course) => course.id !== id));
		} catch (err) {
			console.error("Error deleting course:", err);
		}
	};

	if (loading) return <p>Loading courses...</p>;
	if (error) return <p className='text-red-500'>{error}</p>;

	return (
		<>
			<h2 className='text-xl font-bold mb-4'>Course Management</h2>

			{/* Add/Edit Course Form */}
			<div className='mb-6'>
				<input
					type='text'
					placeholder='Course Name'
					value={courseName}
					onChange={(e) => setCourseName(e.target.value)}
					className='border p-2 rounded mr-2'
				/>
				<input
					type='number'
					placeholder='Course Fee'
					value={courseFee}
					onChange={(e) => setCourseFee(e.target.value)}
					className='border p-2 rounded mr-2'
				/>
				{editingCourse ? (
					<button
						onClick={handleUpdateCourse}
						className='bg-blue-500 text-white px-4 py-2 rounded'>
						Update Course
					</button>
				) : (
					<button
						onClick={handleAddCourse}
						className='bg-green-500 text-white px-4 py-2 rounded'>
						Add Course
					</button>
				)}
			</div>

			{/* Course List */}
			{courses.length > 0 ? (
				<table className='w-full lg:w-auto border rounded-xl shadow table-auto'>
					<thead>
						<tr className='bg-gray-100'>
							{["Course Name", "Course Fee", "Actions"].map((header) => (
								<th
									key={header}
									className='px-6 py-3 text-left text-sm font-medium text-gray-700'>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{courses.map((course) => (
							<tr
								key={course.id}
								className='border-b'>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{course.courseName}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									₹{course.courseFee}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900'>
									<button
										onClick={() => handleEditCourse(course)}
										className='bg-yellow-500 text-white px-3 py-1 rounded mr-2'>
										Edit
									</button>
									<button
										onClick={() => handleDeleteCourse(course.id)}
										className='bg-red-500 text-white px-3 py-1 rounded'>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No courses found.</p>
			)}
		</>
	);
};

export default CourseManagement;
