'use client'
import Link from 'next/link';

function Navbar() {
    const isLoggedIn = false
    return (
        <nav className='bg-black text-white p-4'>
            <ul className='flex justify-around items-center cursor-pointer' >
                <li className='italic bold text-yellow-500 text-2xl'><Link href='/'>BusBuzz</Link></li>
                <li className='hover:text-gray-300'><Link href='/about'>About Us</Link></li>
                <li className='hover:text-gray-300'><Link href="/services">Packages</Link></li>
                <li className='hover:text-gray-300'><Link href="/contact">Contact Us</Link></li>
                {!isLoggedIn ? <li className='hover:text-gray-300'><Link href="/auth/login">Sign In</Link></li> : <li className='hover:text-gray-300'><Link href="/">User</Link></li>}
            </ul>
        </nav>
    );
}

export default Navbar;
