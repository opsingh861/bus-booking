'use client'
import Link from 'next/link';

function Navbar() {
    const isLoggedIn = false
    return (
        <nav className='bg-black text-white p-4'>
            <ul className='flex justify-around items-center cursor-pointer' >
                <li className='italic bold text-yellow-500 text-2xl'><Link href='/'>GoRide</Link></li>
                <li><Link href='/about'>About Us</Link></li>
                <li><Link href="/services">Packages</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                {!isLoggedIn ? <li><Link href="/auth/login">Sign In</Link></li> : <li><Link href="/">User</Link></li>}
            </ul>
        </nav>
    );
}

export default Navbar;
