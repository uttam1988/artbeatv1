import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/app/components/ui/card";
import Students from "../components/Students";
import RegistrationForm from "../components/registrationForm";
import TeacherRegistration from "../Teacher";
import Teachers from "../Teacher/teachers";
import Courses from "../Courses";
import BatchManagement from "../Batches";
import Attendance from "../attendance/page";
import AttendanceList from "../attendance/list";

export default function AdminDashboard() {
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<div className='flex h-screen'>
			{/* Sidebar */}
			<Sidebar setActiveTab={setActiveTab} />

			{/* Main Content */}
			<div className='flex-1 p-6 overflow-auto'>
				{activeTab === "overview" && <DashboardOverview />}
				{activeTab === "students" && <StudentManagement />}
				{activeTab === "teachers" && <TeacherManagement />}
				{activeTab === "coursesbatches" && <CourseManagement />}
				{activeTab === "attendance" && <AttendanceTracking />}
				{activeTab === "payments" && <PaymentManagement />}
			</div>
		</div>
	);
}

function Sidebar({ setActiveTab }) {
	return (
		<div className='w-64 bg-white shadow-md h-full p-4 space-y-4'>
			<Link
				href='/'
				className='p-1.5 font-bold tracking-wider text-xl lg:text-3xl text-yellow-600 [text-shadow:0em_0.1em_0.1em_rgba(0_0_0/_0.2)] font-mono'>
				<span>ArtBeat</span>
			</Link>
			<nav>
				<SidebarItem
					icon='dashboard'
					label='Dashboard'
					onClick={() => setActiveTab("overview")}
				/>
				<SidebarItem
					icon='people'
					label='Students'
					onClick={() => setActiveTab("students")}
				/>
				<SidebarItem
					icon='person'
					label='Teachers'
					onClick={() => setActiveTab("teachers")}
				/>
				<SidebarItem
					icon='menu_book'
					label='Courses & Batches'
					onClick={() => setActiveTab("coursesbatches")}
				/>
				<SidebarItem
					icon='check_circle'
					label='Attendance'
					onClick={() => setActiveTab("attendance")}
				/>
				<SidebarItem
					icon='payments'
					label='Payments'
					onClick={() => setActiveTab("payments")}
				/>
			</nav>
		</div>
	);
}

function SidebarItem({ icon, label, onClick }) {
	return (
		<button
			className='flex items-center w-full p-3 text-left hover:bg-gray-200 rounded-lg'
			onClick={onClick}>
			<span className='material-icons mr-3'>{icon}</span> {label}
		</button>
	);
}

function DashboardOverview() {
	return (
		<div>
			<h2 className='text-2xl font-bold mb-4'>Dashboard Overview</h2>
			<div className='grid grid-cols-3 gap-4'>
				<StatCard
					title='Total Students'
					value='250'
					icon='people'
				/>
				<StatCard
					title='Attendance Today'
					value='220'
					icon='check_circle'
				/>
				<StatCard
					title='Total Fees Collected'
					value='$12,500'
					icon='payments'
				/>
			</div>
			<Students />
		</div>
	);
}

function StatCard({ title, value, icon }) {
	return (
		<Card className='p-4 flex items-center justify-between'>
			<span className='material-icons text-blue-500 text-4xl'>{icon}</span>
			<div>
				<h3 className='text-lg font-semibold'>{title}</h3>
				<p className='text-xl font-bold'>{value}</p>
			</div>
		</Card>
	);
}

function StudentManagement() {
	return (
		<Card>
			<div className='flex w-full justify-between items-center'>
				<h2 className='text-xl font-bold'>Student Management</h2>
			</div>
			<CardContent>
				<RegistrationForm />
			</CardContent>
			<Students />
		</Card>
	);
}

function TeacherManagement() {
	return (
		<Card>
			<CardContent>
				<h2 className='text-xl font-bold'>Teacher Management</h2>
				<TeacherRegistration />
			</CardContent>
			<Teachers />
		</Card>
	);
}

function CourseManagement() {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12'>
			<Card>
				<CardContent>
					<Courses />
				</CardContent>
			</Card>
			<Card>
				<CardContent>
					<BatchManagement />
				</CardContent>
			</Card>
		</div>
	);
}

function AttendanceTracking() {
	return (
		<div className='flex flex-col gap-5'>
			<Card>
				<CardContent>
					<h2 className='text-xl font-bold'>Attendance Tracking</h2>
					<Attendance />
				</CardContent>
			</Card>
			<Card>
				<CardContent>
					<h2 className='text-xl font-bold'>Student Attendance Records</h2>
					<AttendanceList />
				</CardContent>
			</Card>
		</div>
	);
}

function PaymentManagement() {
	return (
		<Card>
			<CardContent>
				<h2 className='text-xl font-bold'>Payment Management</h2>
			</CardContent>
		</Card>
	);
}
