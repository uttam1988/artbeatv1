"use client";

import { useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const RegistrationForm = () => {
	const [formData, setFormData] = useState({ name: "", mobile: "", email: "" });
	const [success, setSuccess] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Handle form input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Basic validation
		if (!formData.name || !formData.mobile || !formData.email) {
			setSuccess("Please fill in all fields.");
			setIsSubmitting(false);
			return;
		}

		try {
			// Add student to Firestore
			await addDoc(collection(db, "students"), {
				name: formData.name,
				mobile: formData.mobile,
				email: formData.email,
				createdAt: new Date(),
			});

			setSuccess("Student registered successfully!");
			setFormData({ name: "", mobile: "", email: "" }); // Reset form
		} catch (error) {
			console.error("Error adding student:", error);
			setSuccess("Failed to register. Try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='max-w-md mx-auto p-4 border rounded-lg shadow'>
			<h2 className='text-xl font-bold mb-4'>Register as a Student</h2>
			{success && <p className='text-green-500 text-sm mb-2'>{success}</p>}

			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit}>
				<div>
					<label className='block text-sm font-medium'>Name</label>
					<input
						type='text'
						name='name'
						value={formData.name}
						onChange={handleChange}
						className='w-full border p-2 rounded'
					/>
				</div>

				<div>
					<label className='block text-sm font-medium'>Mobile Number</label>
					<input
						type='text'
						name='mobile'
						value={formData.mobile}
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
