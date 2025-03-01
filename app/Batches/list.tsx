"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import {
	collection,
	getDocs,
	deleteDoc,
	doc,
	updateDoc,
} from "firebase/firestore";
import dayjs from "dayjs";

const BatchManagement = () => {
	const [batches, setBatches] = useState([]);
	const [editingBatch, setEditingBatch] = useState(null);

	// Fetch batches from Firestore
	useEffect(() => {
		const fetchBatches = async () => {
			const batchSnap = await getDocs(collection(db, "batches"));
			setBatches(batchSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
		};
		fetchBatches();
	}, []);

	// Handle Delete
	const handleDelete = async (id) => {
		await deleteDoc(doc(db, "batches", id));
		setBatches((prev) => prev.filter((batch) => batch.id !== id));
	};

	// Handle Edit Click
	const handleEdit = (batch) => {
		setEditingBatch(batch); // Set selected batch for editing
	};

	// Handle Update
	const handleUpdate = async (updatedBatch) => {
		const batchRef = doc(db, "batches", updatedBatch.id);
		await updateDoc(batchRef, updatedBatch);

		setBatches((prev) =>
			prev.map((batch) =>
				batch.id === updatedBatch.id ? updatedBatch : batch,
			),
		);
		setEditingBatch(null); // Clear editing state after update
	};

	return (
		<div className='p-4 bg-white rounded-lg'>
			<h2 className='text-xl font-bold mb-4'>Batch List</h2>
			<table className='min-w-full border rounded-xl shadow table-auto'>
				<thead>
					<tr className='bg-gray-100'>
						<th className='px-4 py-2'>Batch Name</th>
						<th className='px-4 py-2'>Date & Time</th>
						<th className='px-4 py-2'>Course</th>
						<th className='px-4 py-2'>Students</th>
						<th className='px-4 py-2'>Teachers</th>
						<th className='px-4 py-2'>Actions</th>
					</tr>
				</thead>
				<tbody>
					{batches.map((batch) => (
						<tr
							key={batch.id}
							className='border-b'>
							<td className='px-4 py-2'>{batch.name}</td>
							<td className='px-4 py-2'>
								{dayjs(batch.timing).format("YYYY-MM-DD HH:mm A")}
							</td>
							<td className='px-4 py-2'>{batch.course}</td>
							<td className='px-4 py-2'>{batch.students?.length || 0}</td>
							<td className='px-4 py-2'>{batch.teachers?.length || 0}</td>
							<td className='px-4 py-2'>
								<button
									onClick={() => handleEdit(batch)}
									className='text-blue-500 mr-2'>
									Edit
								</button>
								<button
									onClick={() => handleDelete(batch.id)}
									className='text-red-500'>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Render Edit Form */}
			{editingBatch && (
				<EditBatchForm
					batch={editingBatch}
					onUpdate={handleUpdate}
				/>
			)}
		</div>
	);
};

// Dummy Edit Form Component
const EditBatchForm = ({ batch, onUpdate }) => {
	const [name, setName] = useState(batch.name);
	const [timing, setTiming] = useState(batch.timing);

	const handleSubmit = (e) => {
		e.preventDefault();
		onUpdate({ ...batch, name, timing });
	};

	return (
		<div className='p-4 bg-gray-100 mt-4 rounded'>
			<h3 className='text-lg font-bold mb-2'>Edit Batch</h3>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					value={name}
					onChange={(e) => setName(e.target.value)}
					className='border p-2 w-full mb-2'
					placeholder='Batch Name'
				/>
				<input
					type='datetime-local'
					value={dayjs(timing).format("YYYY-MM-DDTHH:mm")}
					onChange={(e) => setTiming(e.target.value)}
					className='border p-2 w-full mb-2'
				/>
				<button
					type='submit'
					className='bg-blue-500 text-white px-4 py-2 rounded'>
					Update Batch
				</button>
			</form>
		</div>
	);
};

export default BatchManagement;
