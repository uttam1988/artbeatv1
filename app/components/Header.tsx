"use client";
import Link from "next/link";

const Header = () => {
	return (
		<header className='absolute inset-x-0 top-0 z-50 bg-slate-200'>
			<div className='container mx-auto'>
				<nav
					className='flex items-center justify-between py-4'
					aria-label='Global'>
					<div className='flex lg:flex-1'>
						<Link
							href='/'
							className='p-1.5 font-bold tracking-wider text-xl lg:text-3xl text-yellow-600 [text-shadow:0em_0.1em_0.1em_rgba(0_0_0/_0.2)] font-mono'>
							<span>ArtBeat</span>
						</Link>
					</div>
					<div className='hidden lg:flex lg:flex-1 lg:justify-end'>
						<Link
							href='/register'
							className='inline-block text-center bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105'>
							New Register <span aria-hidden='true'>&rarr;</span>
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;
