"use client";
import Link from "next/link";

const Header = () => {
	return (
		<header className='absolute inset-x-0 top-0 z-50 bg-slate-200'>
			<nav
				className='flex items-center justify-between p-6 lg:px-8'
				aria-label='Global'>
				<div className='flex lg:flex-1'>
					<Link
						href='/'
						className='p-1.5 font-bold tracking-wider font-4xl'>
						<span>ArtBeat</span>
					</Link>
				</div>
				<div className='hidden lg:flex lg:flex-1 lg:justify-end'>
					<Link
						href='/register'
						className='inline-block text-center bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105'>
						New Register <span aria-hidden='true'>&rarr;</span>
					</Link>
				</div>
			</nav>
		</header>
	);
};

export default Header;
