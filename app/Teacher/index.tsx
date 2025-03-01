"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { db } from "../lib/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

interface TeacherForm {
	name: string;
	age: number;
	mobile: string;
	email?: string;
	address: string;
	speciality: string[];
	dateOfJoining: string; // Added Date of Joining field
}

const TeacherRegistration = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TeacherForm>();

	const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
	const [courses, setCourses] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [coursesLoading, setCoursesLoading] = useState(true);
	const [coursesError, setCoursesError] = useState<string | null>(null);

	// Fetch courses from Firestore
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "courses"));
				const fetchedCourses = querySnapshot.docs.map(
					(doc) => doc.data().courseName,
				);
				setCourses(fetchedCourses);
			} catch (err) {
				console.error("Error fetching courses:", err);
				setCoursesError("Failed to fetch courses.");
			} finally {
				setCoursesLoading(false);
			}
		};

		fetchCourses();
	}, []);

	// Handle multi-selection manually
	const handleCheckboxChange = (course: string) => {
		setSelectedCourses((prev) =>
			prev.includes(course)
				? prev.filter((c) => c !== course)
				: [...prev, course],
		);
	};

	const onSubmit = async (data: TeacherForm) => {
		setLoading(true);
		try {
			await addDoc(collection(db, "teachers"), {
				...data,
				speciality: selectedCourses,
				dateOfJoining: new Date(data.dateOfJoining).toISOString(), // Store in ISO format
			});
			setSuccess("Teacher registered successfully!");
			reset();
			setSelectedCourses([]);
		} catch (err) {
			console.error("Error adding teacher:", err);
			setError("Failed to register teacher. Try again.");
		}
		setLoading(false);
	};

	return (
		<div className='max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-6'>
			<h2 className='text-2xl font-bold mb-4'>Register Teacher</h2>

			{success && <p className='text-green-600'>{success}</p>}
			{error && <p className='text-red-500'>{error}</p>}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='space-y-4'>
				{/* Name */}
				<div>
					<label className='block text-sm font-medium'>Name *</label>
					<input
						{...register("name", { required: "Name is required" })}
						className='mt-1 block w-full border border-gray-300 rounded-md p-2'
					/>
					{errors.name && (
						<p className='text-red-500 text-sm'>{errors.name.message}</p>
					)}
				</div>

				{/* Age */}
				<div>
					<label className='block text-sm font-medium'>Age *</label>
					<input
						type='number'
						{...register("age", {
							required: "Age is required",
							min: { value: 18, message: "Must be 18 or older" },
						})}
						className='mt-1 block w-full border border-gray-300 rounded-md p-2'
					/>
					{errors.age && (
						<p className='text-red-500 text-sm'>{errors.age.message}</p>
					)}
				</div>

				{/* Mobile */}
				<div>
					<label className='block text-sm font-medium'>Mobile Number *</label>
					<input
						type='tel'
						{...register("mobile", {
							required: "Mobile is required",
							pattern: {
								value: /^[0-9]{10}$/,
								message: "Enter a valid 10-digit number",
							},
						})}
						className='mt-1 block w-full border border-gray-300 rounded-md p-2'
					/>
					{errors.mobile && (
						<p className='text-red-500 text-sm'>{errors.mobile.message}</p>
					)}
				</div>

				{/* Email */}
				<div>
					<label className='block text-sm font-medium'>Email (Optional)</label>
					<input
						type='email'
						{...register("email")}
						className='mt-1 block w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* Address */}
				<div>
					<label className='block text-sm font-medium'>Address *</label>
					<textarea
						{...register("address", { required: "Address is required" })}
						className='mt-1 block w-full border border-gray-300 rounded-md p-2'></textarea>
					{errors.address && (
						<p className='text-red-500 text-sm'>{errors.address.message}</p>
					)}
				</div>

				{/* Date of Joining */}
				<div>
					<label className='block text-sm font-medium'>Date of Joining *</label>
					<input
						type='date'
						{...register("dateOfJoining", {
							required: "Date of joining is required",
						})}
						className='mt-1 block w-full border border-gray-300 rounded-md p-2'
					/>
					{errors.dateOfJoining && (
						<p className='text-red-500 text-sm'>
							{errors.dateOfJoining.message}
						</p>
					)}
				</div>

				{/* Speciality (Multi-Select Checkboxes) */}
				<div>
					<label className='block text-sm font-medium'>
						Speciality (Select Courses) *
					</label>
					{coursesLoading ? (
						<p className='text-gray-500 text-sm'>Loading courses...</p>
					) : coursesError ? (
						<p className='text-red-500 text-sm'>{coursesError}</p>
					) : (
						<div className='mt-1 flex flex-wrap gap-2'>
							{courses.map((course) => (
								<label
									key={course}
									className='flex items-center space-x-2'>
									<input
										type='checkbox'
										value={course}
										checked={selectedCourses.includes(course)}
										onChange={() => handleCheckboxChange(course)}
										className='w-4 h-4'
									/>
									<span>{course}</span>
								</label>
							))}
						</div>
					)}
					{selectedCourses.length === 0 && !coursesLoading && (
						<p className='text-red-500 text-sm'>
							At least one course is required
						</p>
					)}
				</div>

				{/* Submit Button */}
				<button
					type='submit'
					disabled={loading}
					className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600'>
					{loading ? "Registering..." : "Register Teacher"}
				</button>
			</form>
		</div>
	);
};

export default TeacherRegistration;
