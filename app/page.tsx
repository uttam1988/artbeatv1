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
		<>
			<header className='absolute inset-x-0 top-0 z-50 bg-slate-200'>
				<nav
					className='flex items-center justify-between p-6 lg:px-8'
					aria-label='Global'>
					<div className='flex lg:flex-1'>
						<a
							href='#'
							className='-m-1.5 p-1.5'>
							<span className='sr-only'>Your Company</span>
						</a>
					</div>
					<div className='flex lg:hidden'>
						<button
							type='button'
							className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'>
							<span className='sr-only'>Open main menu</span>
							<svg
								className='size-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke-width='1.5'
								stroke='currentColor'
								aria-hidden='true'
								data-slot='icon'>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
								/>
							</svg>
						</button>
					</div>
					<div className='hidden lg:flex lg:gap-x-12'>
						<a
							href='#'
							className='text-sm/6 font-semibold text-gray-900'>
							Product
						</a>
						<a
							href='#'
							className='text-sm/6 font-semibold text-gray-900'>
							Features
						</a>
						<a
							href='#'
							className='text-sm/6 font-semibold text-gray-900'>
							Marketplace
						</a>
						<a
							href='#'
							className='text-sm/6 font-semibold text-gray-900'>
							Company
						</a>
					</div>
					<div className='hidden lg:flex lg:flex-1 lg:justify-end'>
						<a
							href='#'
							className='text-sm/6 font-semibold text-gray-900'>
							Log in <span aria-hidden='true'>&rarr;</span>
						</a>
					</div>
				</nav>
				<div
					className='lg:hidden'
					role='dialog'
					aria-modal='true'>
					<div className='fixed inset-0 z-50'></div>
					<div className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
						<div className='flex items-center justify-between'>
							<a
								href='#'
								className='-m-1.5 p-1.5'>
								<span className='sr-only'>Your Company</span>
							</a>
							<button
								type='button'
								className='-m-2.5 rounded-md p-2.5 text-gray-700'>
								<span className='sr-only'>Close menu</span>
								<svg
									className='size-6'
									fill='none'
									viewBox='0 0 24 24'
									stroke-width='1.5'
									stroke='currentColor'
									aria-hidden='true'
									data-slot='icon'>
									<path
										stroke-linecap='round'
										stroke-linejoin='round'
										d='M6 18 18 6M6 6l12 12'
									/>
								</svg>
							</button>
						</div>
						<div className='mt-6 flow-root'>
							<div className='-my-6 divide-y divide-gray-500/10'>
								<div className='space-y-2 py-6'>
									<a
										href='#'
										className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
										Product
									</a>
									<a
										href='#'
										className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
										Features
									</a>
									<a
										href='#'
										className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
										Marketplace
									</a>
									<a
										href='#'
										className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
										Company
									</a>
								</div>
								<div className='py-6'>
									<a
										href='#'
										className='-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
										Log in
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className='max-w-4xl mx-auto p-4 border rounded-lg shadow mt-24'>
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
		</>
	);
};

export default Home;
