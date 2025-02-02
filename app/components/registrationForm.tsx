"use client";

import { useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const courses = [
	"Guitar 1",
	"Guitar 2",
	"Guitar 3",
	"Art1",
	"Art2",
	"Art3",
	"Song1",
	"Song2",
	"Song3",
	"Dance1",
	"Dance2",
	"Dance3",
	"Flute1",
	"Flute2",
	"Flute3",
	"Piano1",
	"Piano2",
	"Piano3",
	"Tabla1",
	"Tabla2",
	"Tabla3",
	"Violin1",
	"Violin2",
	"Violin3",
];

const RegistrationForm = () => {
	const [formData, setFormData] = useState({
		studentName: "",
		parentName: "",
		mobile: "",
		alternateMobile: "",
		email: "",
		dateOfJoining: "",
		admissionFee: "",
		course: "",
	});
	const [success, setSuccess] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Handle form input change
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Basic validation
		if (Object.values(formData).some((value) => !value.trim())) {
			setSuccess("Please fill in all fields.");
			setIsSubmitting(false);
			return;
		}

		try {
			// Add student to Firestore
			await addDoc(collection(db, "students"), {
				...formData,
				createdAt: new Date(),
			});

			setSuccess("Student registered successfully!");

			// Reset form
			setFormData({
				studentName: "",
				parentName: "",
				mobile: "",
				alternateMobile: "",
				email: "",
				dateOfJoining: "",
				admissionFee: "",
				course: "",
			});
			window.location.href = "/";
		} catch (error) {
			console.error("Error adding student:", error);
			setSuccess("Failed to register. Try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='max-w-2xl mx-auto p-4 border rounded-lg shadow w-full'>
			<h2 className='text-xl font-bold mb-4'>Register as a Student</h2>
			{success && <p className='text-green-500 text-sm mb-2'>{success}</p>}

			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit}>
				<div>
					<label className='block text-sm font-medium'>Student Name</label>
					<input
						type='text'
						name='studentName'
						value={formData.studentName}
						onChange={handleChange}
						className='w-full border p-2 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>Parent Name</label>
					<input
						type='text'
						name='parentName'
						value={formData.parentName}
						onChange={handleChange}
						className='w-full border p-2 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>Mobile</label>
					<input
						type='text'
						name='mobile'
						value={formData.mobile}
						onChange={handleChange}
						className='w-full border p-2 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>Alternate Mobile</label>
					<input
						type='text'
						name='alternateMobile'
						value={formData.alternateMobile}
						onChange={handleChange}
						className='w-full border p-2 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>Email</label>
					<input
						type='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
						className='w-full border p-2 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>Joining Date</label>
					<input
						type='date'
						name='dateOfJoining'
						value={formData.dateOfJoining}
						onChange={handleChange}
						className='w-full border p-2 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>Admission Fee</label>
					<input
						type='text'
						name='admissionFee'
						value={formData.admissionFee}
						onChange={handleChange}
						className='w-full border p-2 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>Select Course</label>
					<select
						name='course'
						value={formData.course}
						onChange={handleChange}
						className='w-full border p-2 rounded bg-white'>
						<option value=''>-- Select a Course --</option>
						{courses.map((course) => (
							<option
								key={course}
								value={course}>
								{course}
							</option>
						))}
					</select>
				</div>
				<button
					type='submit'
					className='bg-blue-500 text-white py-2 px-4 rounded'
					disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Register"}
				</button>
			</form>
		</div>
	);
};

export default RegistrationForm;
