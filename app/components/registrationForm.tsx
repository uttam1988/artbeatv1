"use client";

import { useState, useEffect } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

const RegistrationForm = () => {
	const [formData, setFormData] = useState({
		studentName: "",
		parentName: "",
		mobile: "",
		alternateMobile: "",
		email: "",
		dateOfJoining: "",
		admissionFee: "",
		selectedCourses: [],
	});

	const [courses, setCourses] = useState<string[]>([]);
	const [message, setMessage] = useState<{
		text: string;
		type: "success" | "error";
	} | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch courses from Firestore
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "courses"));
				const fetchedCourses = querySnapshot.docs.map(
					(doc) => doc.data().courseName,
				); // Assuming each course has a `name` field
				setCourses(fetchedCourses);
			} catch (error) {
				console.error("Error fetching courses:", error);
				setMessage({ text: "Failed to load courses.", type: "error" });
			}
		};

		fetchCourses();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleCheckboxChange = (e) => {
		const { value, checked } = e.target;
		setFormData((prevData) => {
			const updatedCourses = checked
				? [...prevData.selectedCourses, value]
				: prevData.selectedCourses.filter((c) => c !== value);
			return { ...prevData, selectedCourses: updatedCourses };
		});
	};

	const validateForm = () => {
		const {
			studentName,
			mobile,
			email,
			dateOfJoining,
			admissionFee,
			selectedCourses,
		} = formData;
		if (
			!studentName ||
			!mobile ||
			!email ||
			!dateOfJoining ||
			!admissionFee ||
			selectedCourses.length === 0
		) {
			return "All fields are required, including at least one course selection.";
		}
		if (!/^\d{10}$/.test(mobile)) return "Invalid mobile number.";
		if (formData.alternateMobile && !/^\d{10}$/.test(formData.alternateMobile))
			return "Invalid alternate mobile number.";
		if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
			return "Invalid email format.";
		if (isNaN(Number(admissionFee))) return "Admission fee must be a number.";
		return null;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setMessage(null);

		const validationError = validateForm();
		if (validationError) {
			setMessage({ text: validationError, type: "error" });
			setIsSubmitting(false);
			return;
		}

		try {
			await addDoc(collection(db, "students"), {
				...formData,
				admissionFee: Number(formData.admissionFee),
				dateOfJoining: new Date(formData.dateOfJoining),
				createdAt: new Date(),
			});

			setMessage({ text: "Student registered successfully!", type: "success" });
			setFormData({
				studentName: "",
				parentName: "",
				mobile: "",
				alternateMobile: "",
				email: "",
				dateOfJoining: "",
				admissionFee: "",
				selectedCourses: [],
			});
		} catch (error) {
			setMessage({ text: "Failed to register. Try again.", type: "error" });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='w-full mx-auto p-4 border rounded-lg shadow bg-white'>
			<h2 className='text-xl font-bold mb-4'>Register as a Student</h2>
			{message && (
				<p
					className={`text-sm mb-2 ${
						message.type === "success" ? "text-green-500" : "text-red-500"
					}`}>
					{message.text}
				</p>
			)}
			<form
				className='flex flex-col gap-5'
				onSubmit={handleSubmit}>
				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-8 gap-6'>
					{[
						"studentName",
						"parentName",
						"mobile",
						"alternateMobile",
						"email",
						"dateOfJoining",
						"admissionFee",
					].map((name) => (
						<div key={name}>
							<label className='block text-sm font-medium capitalize'>
								{name.replace(/([A-Z])/g, " $1")}
							</label>
							<input
								type={name === "dateOfJoining" ? "date" : "text"}
								name={name}
								value={formData[name]}
								onChange={handleChange}
								className='w-full border p-2 rounded'
							/>
						</div>
					))}
				</div>
				<div>
					<label className='block text-sm font-medium'>Select Courses</label>
					<div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2'>
						{courses.length > 0 ? (
							courses.map((course) => (
								<label
									key={course}
									className='flex items-center space-x-2'>
									<input
										type='checkbox'
										value={course}
										checked={formData.selectedCourses.includes(course)}
										onChange={handleCheckboxChange}
										className='w-4 h-4'
									/>
									<span>{course}</span>
								</label>
							))
						) : (
							<p className='text-gray-500'>Loading courses...</p>
						)}
					</div>
				</div>
				<div className='flex w-full justify-center'>
					<button
						type='submit'
						className='bg-blue-500 hover:bg-blue-800 text-white py-2 px-4 rounded-full text-lg font-bold w-64'
						disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Register"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default RegistrationForm;
